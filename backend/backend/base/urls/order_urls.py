from django.urls import path
from base.views.order_views import order_create

urlpatterns = [
    path('create/', order_create),
]
