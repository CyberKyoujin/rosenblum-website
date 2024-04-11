from django.urls import path
from base.views.order_views import order_create, OrdersView, OrderView

urlpatterns = [
    path('create/', order_create),
    path('orders/', OrdersView.as_view(), name='orders'),
    path('<str:pk>/', OrderView.as_view(), name='order'),
]
