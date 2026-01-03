from rest_framework import viewsets, filters
from base.models import CustomUser, Message, RequestObject, RequestAnswer
from base.serializers import MessageSerializer, RequestSerializer, RequestAnswerSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().prefetch_related("files").order_by('-timestamp')
    serializer_class = MessageSerializer
    
    def get_permissions(self):
        
        admin_actions = []
        
        if self.action in admin_actions:
            return [IsAdminUser()]
        
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        target_user_id = self.request.query_params.get('user_id')
        
        if target_user_id:
            
            if user.is_staff:
                return Message.objects.filter(
                    Q(sender_id=target_user_id) | Q(receiver_id=target_user_id)
                ).order_by('-timestamp')
            
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')
        
    def perform_create(self, serializer):
        print(self.request.data)
        serializer.save(sender=self.request.user, receiver=CustomUser.objects.get(pk=self.request.data['id']))
        
    @action(detail=False, methods=['post'])
    def toggle(self, request):
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
        
        
class RequestViewSet(viewsets.ModelViewSet):
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
    
    filterset_fields = ['is_new']
    
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_permissions(self):
        
        admin_actions = ['list', 'retrieve', 'toggle', 'answers']
        
        if self.action in admin_actions:
            return [IsAdminUser()]
        
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle(self, request, pk=None):
        request_obj = self.get_object()
        request_obj.is_new = False
        request_obj.save()
        return Response({'status': 'request toggled'})
    
    @action(detail=True, methods=['get', 'post'], url_path='answers')
    def answers(self, request, pk=None):
       
        request_obj = self.get_object() 

        if request.method == 'GET':
            answers = RequestAnswer.objects.filter(request=request_obj)
            serializer = RequestAnswerSerializer(answers, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            
            data = request.data.copy()
            data['request'] = request_obj.id 
            
            serializer = RequestAnswerSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    