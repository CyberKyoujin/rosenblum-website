from django.urls import path, include
from base.views.user_views import (UserTokenRefreshView, 
                                   UserTokenObtainPairView, 
                                   GoogleLogin,
                                   
                                   ReviewListView, 
                                   )

from rest_framework.routers import DefaultRouter
from base.views.user_views import UserViewSet

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UserTokenObtainPairView.as_view(), name='login'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('token-refresh/', UserTokenRefreshView.as_view(), name='token-refresh'),
    path('reviews/', ReviewListView.as_view(), name='google_maps_reviews'),
    
]
