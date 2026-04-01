import logging
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
from django.db import transaction, IntegrityError
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
import requests
from rest_framework_simplejwt.authentication import JWTAuthentication
from google_maps_reviews import ReviewsClient
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

import requests
from rest_framework import generics
from base.services.email_verification import verify_email, send_verification_code, generate_verification_code
from django.shortcuts import get_object_or_404
from base.services.google_reviews import sync_google_reviews
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from base.services.email_notifications import send_reset_link_email

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'email', 'first_name', 'last_name', 'phone_number']
    ordering_fields = ['date_joined', 'first_name', 'last_name', 'orders_count']
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            qs = self.queryset.filter(is_superuser=False)
        else:
            qs = self.queryset.filter(id=user.id)
        
        if self.action == 'list':
            qs = qs.annotate(orders_count=Count('order'))
        
        return qs

    def get_permissions(self):
        public_actions = [
            'register', 'verify_email', 'resend_code', 
            'reset_password_link', 'reset_password_confirm', 'google_login'
        ]
        if self.action in public_actions:
            return [AllowAny()]
        if self.action in ['me', 'retrieve', 'delete_me'] and not self.request.user.is_staff:
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'me':
            return UserDataSerializer
        return CustomUserSerializer
    

    @action(detail=False, methods=['delete'])
    def delete_me(self, request):
        user = request.user
        logger.info("[Auth]: User %s requested account deletion.", user.email)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = UserDataSerializer(user)
            return Response(serializer.data)
        
        serializer = CustomUserSerializer(user, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def register(self, request):
        email = request.data.get('email', '').strip().lower()
        if CustomUser.objects.filter(email=email).exists():
            logger.info(f"[Auth]: Registration failed - user {email} already exists.")
            return Response({"detail": "User already exists"}, status=status.HTTP_409_CONFLICT)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
        except IntegrityError:
            logger.warning(f"[Auth]: Registration race condition - user {email} already exists (IntegrityError).")
            return Response({"detail": "User already exists"}, status=status.HTTP_409_CONFLICT)
        logger.info(f"[Auth]: New user registered: {user.email}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='verify-email')
    def verify_email(self, request):
        user_email = request.data.get('email', '')
        verification_code = request.data.get('code', '')
        
        result = verify_email(user_email, verification_code)
        
        if not result.ok:
            logger.warning(f"[Auth]: Email verification failed for {user_email}: {result.error}")
            return Response({"detail": result.error, "attempts": result.attempts}, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"[Auth]: Email verified successfully for {user_email}")
        
        return Response({"detail": "Email verified!"})

    @action(detail=False, methods=['post'], url_path='resend-code')
    def resend_code(self, request):
        email = request.data.get("email", "").strip().lower()
        user = get_object_or_404(CustomUser, email=email)

        with transaction.atomic():
            EmailVerification.objects.filter(user=user).delete()
            verification_code = generate_verification_code()
            EmailVerification.objects.create(user=user, code=verification_code)
            transaction.on_commit(lambda: send_verification_code(email, user.first_name, user.last_name, verification_code=verification_code))

        return Response({"detail": "New code sent."})

    @action(detail=False, methods=['post'], url_path='reset-password-link')
    def reset_password_link(self, request):
        email = request.data.get("email", "").strip().lower()
        logger.info(f"[Auth]: Password reset requested for {email}")
        try:
            user = CustomUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/password-reset/confirm/{uid}/{token}/"
            send_reset_link_email(email, user.first_name, user.last_name, reset_link)
        except CustomUser.DoesNotExist:
            logger.warning(f"[Auth]: Password reset requested for non-existent email: {email}")
            return Response({"detail": "If an account with that email exists, a reset link has been sent."}) 
        return Response({"detail": "Link sent."})

    @action(detail=False, methods=['post'], url_path='reset-password-confirm')
    def reset_password_confirm(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')

        try:
            
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                logger.info(f"[Auth]: Password reset successful for user ID {uid}")
                return Response({"detail": "Password reset success."})
            
            logger.warning(f"[Auth]: Invalid password reset token for user ID {uid}")
            return Response({"detail": "Invalid link."}, status=400)
        
        except Exception as e:
            logger.error(f"[Auth]: Password reset failed. Error: {str(e)}")
            return Response({"detail": "Invalid data."}, status=400)
    

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserTokenObtainPairSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        
        response.set_cookie("access", data['access'], httponly=True, secure=True, samesite='None', max_age=300)
        response.set_cookie("refresh", data['refresh'], httponly=True, secure=True, samesite='None', max_age=86400)
        
        return response

    
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        
        if not refresh_token:
            return Response({"detail": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CustomTokenRefreshSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        response = Response({"detail": "Successfully refreshed token"}, status=status.HTTP_200_OK)
        
        response.set_cookie("access", data['access'], httponly=True, secure=True, samesite='None', max_age=300)
        response.set_cookie("refresh", data['refresh'], httponly=True, secure=True, samesite='None', max_age=86400)
        
        return response
    
class GoogleLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            # Check if Google OAuth is configured
            if not settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY:
                return Response({
                    'error': 'Google OAuth is not configured on the server',
                    'detail': 'SOCIAL_AUTH_GOOGLE_OAUTH2_KEY is missing'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            token = request.data.get('access_token')
            
            if not token:
                return Response({
                    'error': 'access_token is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
            )

            with transaction.atomic():
                user, created = CustomUser.objects.get_or_create(email=idinfo['email'])

                if created:
                    user.first_name = idinfo.get('given_name', '')
                    user.last_name = idinfo.get('family_name', '')
                    user.profile_img_url = idinfo.get('picture', '')
                    user.is_active = True
                    user.save()
                    logger.info(f"[Google Login]: Created new user from Google: {user.email}")
                else:
                    logger.info(f"[Google Login]: Existing user logged in via Google: {user.email}")

                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                response = Response({'detail': 'Login successful'}, status=status.HTTP_200_OK)
                
                response.set_cookie("access", str(access_token), httponly=True, secure=True, samesite='None', max_age=300)
                response.set_cookie("refresh", str(refresh), httponly=True, secure=True, samesite='None', max_age=86400)

                return response

        except ValueError as e:
            logger.warning(f"[Google Login]: Token verification failed: {str(e)}")
            return Response({
                'error': 'Invalid token',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.exception(f"[Google Login]: Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': 'Internal server error',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                logger.warning(f"[Logout]: Failed to blacklist refresh token: {str(e)}")
                
        response = Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie("access", samesite='None')
        response.delete_cookie("refresh", samesite='None')
        return response
        
class ReviewListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ReviewSerializer
    pagination_class = None
    queryset = Review.objects.all().prefetch_related("translations").order_by("-review_timestamp")

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["lang"] = self.request.query_params.get("lang")
        return ctx
            
            
            