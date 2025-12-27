"""
URL configuration for backend project.

"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from base.views.message_views import MessageViewSet, RequestViewSet
from base.views.order_views import OrderViewSet

router = DefaultRouter()

router.register(r'messages', MessageViewSet, basename='message')
router.register(r'requests', RequestViewSet, basename='request')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('user/', include('base.urls.user_urls')),
    path('admin-user/', include('base.urls.admin_urls')),
    path('statistics/', include('base.urls.statistics_urls'))
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
