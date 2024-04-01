from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import CustomUserSerializer, UserTokenObtainPairSerializer
from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from rest_framework_simplejwt.tokens import RefreshToken
from social_core.exceptions import AuthForbidden, AuthFailed
from google.oauth2 import id_token
from google.auth.transport import requests
from base.models import CustomUser
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView


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
    

class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    
    
class GoogleLogin(APIView):
    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get('access_token')
        
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY)
            print(idinfo)
            user, created = CustomUser.objects.get_or_create(email=idinfo['email'], first_name=idinfo['given_name'], last_name=idinfo['family_name'], profile_img_url=idinfo['picture'])
            if created:
                user.save()
            
            refresh = RefreshToken.for_user(user)
            access_token = UserTokenObtainPairSerializer.get_token(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(access_token.access_token),
                
            }, status=status.HTTP_200_OK)
            
        except ValueError as e: 
            return Response({'error': str(e)}, status=400)