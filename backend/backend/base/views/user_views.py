from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import CustomUserSerializer, CustomTokenRefreshSerializer, UserTokenObtainPairSerializer, UserDataSerializer, MessageSerializer, RequestSerializer, ReviewSerializer
from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from rest_framework_simplejwt.tokens import RefreshToken
from social_core.exceptions import AuthForbidden, AuthFailed
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from base.models import CustomUser, Message, File, RequestObject, Review, EmailVerification
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
import requests
from rest_framework_simplejwt.views import TokenRefreshView
from google_maps_reviews import ReviewsClient
import requests
from rest_framework import generics
from base.services.email_verification import verify_email, send_verification_code
from django.shortcuts import get_object_or_404
from base.services.google_reviews import sync_google_reviews
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from base.services.email_notifications import send_reset_link_email

class UserRegisterView(APIView):
    def post(self, request):
        
        raw_email = request.data.get('email', '')
        email = raw_email.strip()
        
        if CustomUser.objects.filter(email=email).exists():
            return Response(status=status.HTTP_409_CONFLICT)
        
        data = request.data.copy()
        data['email'] = email
        
        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationView(APIView):
    def post(self, request):
        user_email = request.data.get('email', '')
        verification_code = request.data.get('code', '')  
        
        if not user_email or not verification_code:
            return Response(
                {"detail": "Email and code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = verify_email(user_email, verification_code)
        
        if not result.ok:
            error_map = {
                'user_not_found': ({"detail": 'User not found.'}, status.HTTP_404_NOT_FOUND),
                'no_active_verification': ({"detail": "No active verification found."}, status.HTTP_400_BAD_REQUEST),
                'verification_code_expired': ({"detail": "Verification code expired."}, status.HTTP_400_BAD_REQUEST),
                'no_verification_attempts': ({"detail": "No verification attempts left."}, status.HTTP_400_BAD_REQUEST),
                'invalid_verification_code': ({"detail": "Invalid verification code.", "attempts": result.attempts}, status.HTTP_400_BAD_REQUEST),   
            }
            
            body, code_status = error_map.get(result.error, ({"detail": "Unknown error"}, status.HTTP_400_BAD_REQUEST))
            
            return Response(body, status=code_status)
        
        return Response({"detail": "Email verified!"}, status=status.HTTP_200_OK)
    
class ResendVerificationCode(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip()
        
        user = get_object_or_404(CustomUser, email=email)
        
        EmailVerification.objects.filter(user=user).delete()
        
        verification_code = send_verification_code(email, user.first_name, user.last_name)
        EmailVerification.objects.create(user=user, code=verification_code)
        
        return Response({"detail": "New verification code sent."}, status=status.HTTP_200_OK)
        
class SendPasswordResetLink(APIView):
    def post(self, request):
        email = request.data.get("email", "").strip()
        
        try:
            user = CustomUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            frontend_url = "http://localhost:3000"
            reset_link = f"{frontend_url}/password-reset/confirm/{uid}/{token}/"
            
            print(f"Link: {reset_link}")
            
            send_reset_link_email(email, user.first_name, user.last_name, reset_link)
            
            return Response({"detail": "Link to password change has been successfully sent."}, status=status.HTTP_200_OK)
        
        except CustomUser.DoesNotExist:
            return Response({"detail": "Link to password change has been successfully sent."}, status=status.HTTP_200_OK)
        
class ResetPassword(APIView):
    def post(self, request):
        print(request.data)
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')

        if not uidb64 or not token or not password:
            return Response(
                {"detail": "Missing required fields (uid, token, password)."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response(
                {"detail": "Invalid UID."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired token."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response(
            {"detail": "Password has been reset successfully."}, 
            status=status.HTTP_200_OK
        )
        
            
            
class UserView(APIView):
    permission_classes = [IsAuthenticated,]
    def get(self, request):
        user = request.user
        serializer = UserDataSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
        
    
class UserTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer
    
    
class GoogleLogin(APIView):
    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get('access_token')
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY)

            print(idinfo)
            
            with transaction.atomic():
                user, created = CustomUser.objects.get_or_create(email=idinfo['email'])

                if created:
                    user.first_name = idinfo['given_name']
                    user.last_name = idinfo['family_name']
                    user.profile_img_url = idinfo['picture']
                    user.is_active = True
                    user.save()

                refresh = RefreshToken.for_user(user)
                access_token = UserTokenObtainPairSerializer.get_token(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(access_token.access_token),
                }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({'error': str(e)}, status=400)
        
        
class UserUpdateView(APIView):
    def patch(self, request):
        print(request.data)
        serializer = CustomUserSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

       
class UserMesagesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        messages = Message.objects.filter(Q(sender=request.user) | Q(receiver=request.user)).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ToggleViewed(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        messages = Message.objects.filter(Q(sender=request.user) | Q(receiver=request.user))
        messages.update(viewed=True)
        return Response(status=status.HTTP_200_OK)
    
    
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        message_text = request.data.get('message')
        receiver = CustomUser.objects.get(email="tester2@gmail.com")
        sender = request.user
        
        message = Message.objects.create(sender=sender, receiver=receiver, message=message_text)
        
        if request.FILES.getlist('files'):
            for file in request.FILES.getlist('files'):
                File.objects.create(message=message, file=file)
    
        return Response(status=status.HTTP_200_OK)
    
class RequestView(CreateAPIView):
    queryset = RequestObject.objects.all()
    serializer_class = RequestSerializer


class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    pagination_class = None
    def get_queryset(self):
        return (
            Review.objects
            .all()
            .prefetch_related("translations")
            .order_by("-review_timestamp")
        )

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["lang"] = self.request.query_params.get("lang")
        return ctx
            
            
            