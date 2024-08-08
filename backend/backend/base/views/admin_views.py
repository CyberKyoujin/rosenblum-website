from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserTokenObtainPairSerializer
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from base.models import CustomUser, Order, Message, File
from base.serializers import CustomUserSerializer, UserDataSerializer, OrderSerializer, MessageSerializer
from django.contrib.auth import authenticate
from google.cloud import storage
from django.conf import settings
import datetime
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

class AdminLoginView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    def post(self, request: Request, *args, **kwargs) -> Response:
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if user.is_superuser:
            return super().post(request, *args, **kwargs)
        else:
            return Response({"details": "Only admin users are allowed!"}, status=status.HTTP_403_FORBIDDEN)

class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
# GOOGLE STORAGE VIEWS

def get_gcs_client():
    client = storage.Client(credentials=settings.GS_CREDENTIALS, project=settings.GS_CREDENTIALS.project_id)
    return client

def get_gcs_bucket():
    client = get_gcs_client()
    bucket_name = settings.GS_BUCKET_NAME
    return client.bucket(bucket_name)

def get_file_url(file_name):
    bucket = get_gcs_bucket()
    blob = bucket.blob(file_name)
    return blob.generate_signed_url(version='v4', expiration=datetime.timedelta(hours=1), method='GET')

class FileURLView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        file_name = request.data.get('file_name')
        if not file_name:
            return Response({'error': 'file_name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        url = get_file_url(file_name)
        return Response({'url': url}, status=status.HTTP_200_OK)
    
    
class UserDataView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, *args, **kwargs):
        user = CustomUser.objects.get(pk=pk)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ToggleOrder(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, *args, **kwargs):
        order = Order.objects.get(pk=pk)
        order.new = False
        order.save()
        return Response(status=status.HTTP_200_OK)
    
    
class UserOrdersView(APIView):
    def get(self, request, pk, *args, **kwargs):
        orders = Order.objects.filter(user=pk)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class UserMessagesView(APIView):
    def get(self, request, pk, *args,  **kwargs):
        messages = Message.objects.filter(Q(sender=pk) | Q(receiver=pk)).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ToggleViewed(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, *args,  **kwargs):
        messages = Message.objects.filter(Q(sender=pk) | Q(receiver=pk))
        messages.update(viewed=True)
        return Response(status=status.HTTP_200_OK)
    
    
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        message_text = request.data.get('message')
        print(message_text)
        receiver = CustomUser.objects.get(id=pk)
        sender = request.user
        
        message = Message.objects.create(sender=sender, receiver=receiver, message=message_text)
        
        if request.FILES.getlist('files'):
            for file in request.FILES.getlist('files'):
                File.objects.create(message=message, file=file)
    
        return Response(status=status.HTTP_200_OK)