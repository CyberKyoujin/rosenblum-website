from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import TranslateSerializer, UserTokenObtainPairSerializer, RequestSerializer
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from base.models import CustomUser, Order, Message, File, RequestObject, RequestAnswer, Translation
from base.serializers import CustomUserSerializer, UserDataSerializer, TranslationSerializer, OrderSerializer, MessageSerializer, RequestAnswerSerializer
from django.contrib.auth import authenticate
from google.cloud import storage
from django.conf import settings
import datetime
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Count
from django.db.models import Case, When, F, Q, Max, IntegerField, OuterRef, Subquery
from base.services.translations import stream_translate_text
from rest_framework.generics import GenericAPIView
from django.http import StreamingHttpResponse

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


# LIST VIEWS

class CustomerListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(is_superuser=False)
    serializer_class = CustomUserSerializer   
        
    filter_backends = [
        filters.SearchFilter,      
        DjangoFilterBackend,        
        filters.OrderingFilter
    ]
    
    search_fields = [
        'id', 
        'email', 
        'first_name', 
        'last_name',
        'phone_number'
    ]
        
    ordering_fields = ['date_joined', 'first_name', 'last_name', 'orders_count']
    ordering = ['date_joined']
        
    def get_queryset(self):
        return CustomUser.objects.filter(is_superuser=False).annotate(orders_count=Count('order'))
        
class RequestsView(generics.ListAPIView):
    queryset = RequestObject.objects.all()
    serializer_class = RequestSerializer
        
    filter_backends = [
        filters.SearchFilter,      
        DjangoFilterBackend,        
        filters.OrderingFilter
    ]
    
    search_fields = [
        'id', 
        'name', 
        'email', 
        'phone_number',
    ]
    
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
class RequestView(APIView):
    def get(self, request, pk):
        try:
            request_obj = RequestObject.objects.get(id=pk)
            serializer = RequestSerializer(request_obj, many=False, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except RequestObject.DoesNotExist:
            return Response({'detail': 'Request not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class RequestAnswerView(APIView):
    def get(self, request, pk):
        request_answers = RequestAnswer.objects.filter(request=pk)
        serializer = RequestAnswerSerializer(request_answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CreateRequestAnswerView(CreateAPIView):
    queryset = RequestAnswer.objects.all()
    serializer_class = RequestAnswerSerializer

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
    
class GlobalMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]
    
    filter_backends = [
        filters.SearchFilter,      
        DjangoFilterBackend,        
        filters.OrderingFilter
    ]
    
    search_fields = [
        'id',
        'sender__first_name', 
        'sender__last_name', 
        'sender__email',
        'receiver__first_name', 
        'receiver__last_name', 
        'receiver__email',
        'message'
    ]
    
    filterset_fields = ['viewed']
    
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        user = self.request.user
        
        all_my_messages = Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        )

        partner_expression = Case(
            When(sender=user, then=F('receiver_id')),
            default=F('sender_id'),
            output_field=IntegerField(),
        )

        latest_message_ids = all_my_messages.annotate(
            partner_id=partner_expression
        ).values('partner_id').annotate(
            max_id=Max('id') 
        ).values('max_id')

        return Message.objects.filter(id__in=latest_message_ids).order_by('-timestamp')

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
    
    
class ToggleViewed(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        sender_id = request.data.get('sender_id')
        
        if not sender_id:
            return Response(
                {"error": "sender_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        
        updated_count = Message.objects.filter(
            receiver=request.user,  
            sender_id=sender_id,    
            viewed=False            
        ).update(viewed=True)

        return Response(
            {"status": "success", "updated_count": updated_count}, 
            status=status.HTTP_200_OK
        )
    
    
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
    
    
class SearchView(APIView):
    def post(self, request):
        search_query = request.data.get('query')
        customers = CustomUser.objects.filter(Q(first_name__icontains=search_query)| Q(last_name__icontains=search_query) | Q(email__icontains=search_query))
        orders = Order.objects.filter(Q(email__icontains=search_query) | Q(name__icontains=search_query))
        serializer = CustomUserSerializer(customers, many=True)
        orders_serializer = OrderSerializer(orders, many=True)
        data = {"customers": serializer.data, "orders": orders_serializer.data}
        return Response(data, status=status.HTTP_200_OK)
    
class TranslateText(GenericAPIView):
    
    serializer_class = TranslateSerializer
    
    def post(self, request):
        
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            
            text = serializer.validated_data['text']
            lan_to = serializer.validated_data['lan_to']
            
            event_stream = stream_translate_text(text, lan_to)
            
            response = StreamingHttpResponse(event_stream, content_type='text/plain')
            
            return response
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TranslationsView(generics.ListAPIView):
    serializer_class = TranslationSerializer
    queryset = Translation.objects.all()
    
    filter_backends = [
        filters.SearchFilter,      
        DjangoFilterBackend,        
        filters.OrderingFilter
    ]
    
    search_fields = [
        'id',
        'name', 
    ]
    
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
class TranslationView(APIView):
    def get(self, request, pk, *args, **kwargs):
        translation = Translation.objects.get(pk=pk)
        serializer = TranslationSerializer(translation)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CreateTranslationView(generics.CreateAPIView):
    serializer_class = TranslationSerializer
    queryset = Translation.objects.all()

        