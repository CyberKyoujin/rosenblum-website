import logging
from rest_framework.response import Response
from rest_framework import status
from base.models import Order
from django.db.models import Q
from base.serializers import CostEstimateSerializer, OrderSerializer, OrderUpdateSerializer
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from base.pagination import CustomPagination
from base.services.google_storage import get_file_url
from base.services.telegram import notify_new_order, notify_cost_estimate_created, notify_order_status_changed
from rest_framework.decorators import action
from base.services.generate_estimate import generate_quote_pdf
from django.core.files.base import ContentFile
from base.models import CostEstimate

logger = logging.getLogger(__name__)
        
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('files', 'documents', 'cost_estimate', 'invoice').select_related('user')
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['id', 'name', 'email', 'phone_number', 'message']
    filterset_fields = ['status', 'is_new', 'order_type', 'payment_status', 'payment_type']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        return OrderSerializer
    
    def get_permissions(self):
        # Only admins can delete orders or view any user's orders
        admin_actions = ["destroy", "user_orders"]
        # Guests (anonymous) can create, view and update their own orders via UUID
        anonymous_allowed = ["create", "retrieve", "list", "update", "partial_update"]

        if self.action in admin_actions:
            return [IsAdminUser()]
        if self.action in anonymous_allowed:
            return [AllowAny()]  
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        uuid = self.request.query_params.get('uuid')
        
        # 1. If Admin - return all orders
        if user.is_authenticated and user.is_staff:
            return self.queryset

        # 2. If User is authenticated - return their orders; also allow uuid access
        if user.is_authenticated:
            if uuid:
                return self.queryset.filter(Q(user=user) | Q(guest_uuid=uuid))
            return self.queryset.filter(user=user)

        # 3. If uuid is received - return orders for that uuid
        if uuid:
            return self.queryset.filter(guest_uuid=uuid)

        # 4. Otherwise - return empty queryset
        logger.warning("[ORDER VIEWSET] Unauthenticated request to OrderViewSet without uuid. Returning empty queryset.")
        return self.queryset.none()
    
    def create(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        instance = serializer.instance

        logger.info("[ORDER VIEWSET] Order %s created (type=%s, user=%s)", instance.id, instance.order_type, instance.user_id or "anonymous")

        if instance.guest_uuid:
            return Response(
                {'id': instance.id, 'is_new': instance.is_new, 'guest_uuid': str(instance.guest_uuid)},
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {'id': instance.id, 'is_new': instance.is_new},
            status=status.HTTP_201_CREATED
        )
        
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        order = serializer.save(user=user)
        notify_new_order(order)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        instance = serializer.save()
        if instance.status != old_status:
            notify_order_status_changed(instance, instance.status)
        
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
    

class CreateCostEstimateViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = CostEstimateSerializer

    def create(self, request):
        
        order_id = request.data.get('order_id')
        
        if not order_id:
            logger.warning("[Cost Estimate]: Cost estimate creation failed: Missing order_id in request.")
            return Response({'error': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pdf_bytes = generate_quote_pdf(order_id)
            order = Order.objects.get(pk=order_id)
            
            if CostEstimate.objects.filter(order=order).exists():
                logger.info("[Cost Estimate]: Cost estimate already exists for order_id=%s", order_id)
                return Response({'error': 'Cost estimate already exists for this order'}, status=status.HTTP_400_BAD_REQUEST)

            CostEstimate.objects.create(
                order=order,
                file=ContentFile(pdf_bytes, name=f'cost_estimate_{order_id}.pdf'),
            )

            notify_cost_estimate_created(order)

            return Response({'details': 'Cost estimate created'}, status=status.HTTP_201_CREATED)
        
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception("[Cost Estimate]: Unexpected error during cost estimate creation for order %s: %s", order_id, str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)