from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from base.models import Order,File
from base.serializers import OrderSerializer, FileSerializer

class OrderCreateView(APIView):
    def post(self, request):
        data = request.data
        file_serializer = FileSerializer(data=data['name'])
        order_serializer = OrderSerializer(data=request.data)
        
        print(data['name'])
        return Response(data)


