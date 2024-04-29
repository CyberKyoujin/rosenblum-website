from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import CustomUserSerializer, UserTokenObtainPairSerializer, UserDataSerializer, MessageSerializer
from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from rest_framework_simplejwt.tokens import RefreshToken
from social_core.exceptions import AuthForbidden, AuthFailed
from google.oauth2 import id_token
from google.auth.transport import requests
from base.models import CustomUser, Message, File
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Q
from rest_framework.decorators import api_view

class UserRegisterView(APIView):
    def post(self, request):
        email = request.data['email']
        if CustomUser.objects.filter(email=email).exists():
            return Response(status=status.HTTP_306_RESERVED)
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserView(APIView):
    permission_classes = [IsAuthenticated,]
    def get(self, request):
        user = request.user
        serializer = UserDataSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    

class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    
    
class GoogleLogin(APIView):
    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get('access_token')
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY)

            print(idinfo)
            
            with transaction.atomic():
                user, created = CustomUser.objects.get_or_create(email=idinfo['email'])

                if created:
                    user.first_name = idinfo['given_name']
                    user.last_name = idinfo['family_name']
                    user.profile_img_url = idinfo['picture']
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
    def put(self, request):
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
        receiver = CustomUser.objects.get(email="tester@gmail.com")
        sender = request.user
        
        message = Message.objects.create(sender=sender, receiver=receiver, message=message_text)
        
        if request.FILES.getlist('files'):
            for file in request.FILES.getlist('files'):
                File.objects.create(message=message, file=file)
    
        return Response(status=status.HTTP_200_OK)
    

