from django.urls import path, include
from rest_framework.routers import DefaultRouter

from base.views.admin_views import (AdminLoginView, TranslationViewSet, 
                                    GlobalMessagesView,
                                )

router = DefaultRouter()
router.register(r'translations', TranslationViewSet, basename='translations')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', AdminLoginView.as_view(), name='login'),
    path('messages/', GlobalMessagesView.as_view(), name="global-messages"),
]

