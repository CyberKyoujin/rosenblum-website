from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from base.models import Order,File, CustomUser
from base.serializers import OrderSerializer, FileSerializer
from rest_framework.decorators import api_view

@api_view(['POST'])
def order_create(request):
    if request.method == 'POST':
        
        print(request.user)
        
        name = request.data.get('name')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        city = request.data.get('city')
        street = request.data.get('street')
        zip = request.data.get('zip')
        message = request.data.get('message')
        user = None
        
        if request.user.is_authenticated:
            user = request.user
        else:
            user = None
        
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


