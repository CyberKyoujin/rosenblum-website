from django.urls import path
from base.views.admin_views import AdminLoginView


urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='login'),
    
]
