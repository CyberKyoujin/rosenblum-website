from django.urls import path
from base.views.order_views import OrderCreateView

urlpatterns = [
    path('create/',OrderCreateView.as_view()),
]
