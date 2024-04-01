from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from base.models import Order,File
from base.serializers import OrderSerializer, FileSerializer

class OrderCreateView(APIView):
    def post(self, request):
        data = request.data
        user = None
        if request.user:
            user = request.user
        
        order = Order.objects.create(
            user=user,
            name=data['name'],
            email=data['email'],
            phone_number=data['phone_number'],
            city=data['city'],
            street=data['street'],
            zip=data['zip'],
            message=data['message']
            )
        
        files = request.FILES.getlist['files']
        for file in files:
            File.objects.create(order=order,file=file)

        return Response(status=status.HTTP_200_OK)


