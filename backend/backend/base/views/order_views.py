from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Order,File, CustomUser
from base.serializers import OrderSerializer, FileSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from base.pagination import CustomPagination

@api_view(['POST'])
def order_create(request):
    if request.method == 'POST':
        
        name = request.data.get('name')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        city = request.data.get('city')
        street = request.data.get('street')
        zip = request.data.get('zip')
        message = request.data.get('message')
        user = request.user if request.user.is_authenticated else None
        
        order = Order.objects.create(
            user=user,
            name=name,
            email=email,
            phone_number=phone_number,
            city=city,
            street=street,
            zip=zip,
            message=message
        )
        
        for file in request.FILES.getlist('files'):
            File.objects.create(order=order, file=file)

        return Response(status=status.HTTP_200_OK)


class OrdersView(generics.ListAPIView):
    
    serializer_class = OrderSerializer
    pagination_class = None
    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.filter(user=user.id).prefetch_related('files').order_by('-date')
        return queryset
    
class OrdersViewSet(generics.ListAPIView):
    permission_classes = []
    queryset = Order.objects.select_related("user").all()
    serializer_class = OrderSerializer
    pagination_class = CustomPagination
    
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
        'message'
    ]
    
    filterset_fields = ['status', 'is_new']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
class OrderView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
            serializer = OrderSerializer(order, many=False, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class OrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        serializer.save()
        
class OrderDeleteView(generics.DestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Order successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
    
    def perform_destroy(self, instance):
        instance.delete()
