from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status, filters, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from base.models import CustomUser, Order, Message, File, RequestObject, RequestAnswer, Translation
from base.serializers import CustomUserSerializer, TranslationSerializer, OrderSerializer, MessageSerializer, RequestAnswerSerializer, TranslateSerializer, UserTokenObtainPairSerializer, RequestSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Case, When, F, Q, Max, IntegerField
from base.services.translations import stream_translate_text
from django.http import StreamingHttpResponse
from base.pagination import CustomPagination
from rest_framework import viewsets
from rest_framework.decorators import action

# AUTHENTICATION VIEWS

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
   

# MESSAGE VIEWS

class GlobalMessagesView(generics.ListAPIView):
    
    permission_classes = [IsAdminUser]
    
    '''
    Returns messages in chat format
    '''
    
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
    
    
# Translations

class TranslationViewSet(viewsets.ModelViewSet):
    queryset = Translation.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = TranslationSerializer
    
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
    
    @action(detail=False, methods=['post'])
    def translate(self, request):

        serializer = TranslateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        text = serializer.validated_data['text']
        lan_to = serializer.validated_data['lan_to']
        
        event_stream = stream_translate_text(text, lan_to)
        
        return StreamingHttpResponse(event_stream, content_type='text/plain')
    