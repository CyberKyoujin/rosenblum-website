from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Order,File, CustomUser
from base.serializers import OrderSerializer, FileSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

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

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.filter(user=user.id).prefetch_related('files').order_by('-date')
        return queryset
    
class OrdersListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    

class OrderView(APIView):
    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found'}, status=status.HTTP_400_BAD_REQUEST)