from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserTokenObtainPairSerializer
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from base.models import CustomUser
from base.serializers import CustomUserSerializer
from django.contrib.auth import authenticate


class AdminLoginView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    def post(self, request: Request, *args, **kwargs) -> Response:
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user.is_superuser:
            return super().post(request, *args, **kwargs)
        else:
            return Response({"details": "Only admin users are allowed!"}, status=status.HTTP_403_FORBIDDEN)

    
class TokenView(APIView):
    def get(self, request):
        token = get_token(request)
        print(token + 'dfdf')
        return Response({'csrfToken': get_token(request)})
    

class UserListView(APIView):
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)