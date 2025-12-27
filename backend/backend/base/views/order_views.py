from rest_framework.response import Response
from rest_framework import status
from base.models import Order
from base.serializers import OrderSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from base.pagination import CustomPagination
from base.services.google_storage import get_file_url
from rest_framework.decorators import action

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('files').select_related('user')
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['id', 'name', 'email', 'phone_number', 'message']
    filterset_fields = ['status', 'is_new']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)
        
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle(self, request, pk=None):
        order = self.get_object()
        order.is_new = False
        order.save()
        return Response({'status': 'order toggled'})

    @action(detail=False, methods=['get'], url_path='user/(?P<user_pk>[^/.]+)', permission_classes=[IsAdminUser])
    def user_orders(self, request, user_pk=None):
        orders = Order.objects.filter(user_id=user_pk)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='get-file-url')
    def get_file_url_action(self, request):
        file_name = request.data.get('file_name')
        if not file_name:
            return Response({'error': 'file_name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        url = get_file_url(file_name) 
        return Response({'url': url}, status=status.HTTP_200_OK)
