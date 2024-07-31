from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserTokenObtainPairSerializer

class AdminLoginView(TokenObtainPairView):
    permission_classes = [IsAdminUser]
    serializer_class = UserTokenObtainPairSerializer
        