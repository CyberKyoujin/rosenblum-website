from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count, F
from django.db.models.functions import TruncDay, TruncMonth
from base.models import Order, RequestObject, CustomUser
from django.utils import timezone
from datetime import timedelta

class DashboardStatsView(APIView):
    """
    Base Data
    """
    permission_classes = []

    def get(self, request):
        return Response({
            "total_orders": Order.objects.count(),
            "new_orders": Order.objects.filter(status=Order.Status.REVIEW).count(),
        })
        

class OrderStatusDistributionView(APIView):
    
    permission_classes = []

    def get(self, request):
        
        data = Order.objects.values('status').annotate(value=Count('id'))
        
        order_status_de = {
        "review": "Wird bearbeitet",
        "in_progress": "Ausführung",
        "completed": "Fertig",
        "ready_pick_up": "Abholbereit",
        "sent": "Versandt",
        "canceled": "Storniert"
        }
        
        formatted_data = [
            {
                "id": item['status'],
                "value": item['value'],
                "label": order_status_de[item['status']]  
            }
            for item in data
        ]
        return Response(formatted_data)
    
class OrderDynamicsView(APIView):
    permission_classes = []

    def get(self, request):
        last_year = timezone.now() - timedelta(days=365)
        
        data = Order.objects.filter(timestamp__gte=last_year) \
            .annotate(period=TruncMonth('timestamp')) \
            .values('period') \
            .annotate(count=Count('id')) \
            .order_by('period')
            
        return Response(data)

class OrderTypeDistributionView(APIView):
    permission_classes = []
    
    def get(self, request):
        # Сравнение типов заказов
        data = Order.objects.values('order_type').annotate(value=Count('id'))
        return Response(data)

class GeographyStatsView(APIView):
    permission_classes = []

    def get(self, request):
        # Топ 10 городов
        data = Order.objects.exclude(city__isnull=True).exclude(city__exact='') \
            .values('city') \
            .annotate(count=Count('id')) \
            .order_by('-count')[:10]
        return Response(data)

class UserGrowthView(APIView):
    permission_classes = []

    def get(self, request):
        # Динамика регистраций
        data = CustomUser.objects.annotate(period=TruncMonth('date_joined')) \
            .values('period') \
            .annotate(count=Count('id')) \
            .order_by('period')
        return Response(data)

class ComparisonStatsView(APIView):
    permission_classes = []

    def get(self, request):
        """
        Сложнее всего: нужно объединить две модели на одной временной шкале.
        Делаем два запроса и объединяем в Python (или используем сложный Union).
        Для графиков проще отдать два массива.
        """
        # Берем данные за последние 6 месяцев, например
        start_date = timezone.now() - timedelta(days=180)
        
        orders = Order.objects.filter(timestamp__gte=start_date)\
            .annotate(period=TruncMonth('timestamp'))\
            .values('period')\
            .annotate(count=Count('id'))\
            .order_by('period')

        requests = RequestObject.objects.filter(timestamp__gte=start_date)\
            .annotate(period=TruncMonth('timestamp'))\
            .values('period')\
            .annotate(count=Count('id'))\
            .order_by('period')

        # Формируем ответ, который удобно скормить MUI Chart
        # На фронте нужно будет убедиться, что оси X (period) совпадают, 
        # либо сделать map по всем уникальным датам здесь, в Python.
        
        return Response({
            "orders": list(orders),
            "requests": list(requests)
        })