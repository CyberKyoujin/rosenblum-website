from django.urls import path, include
from base.views.user_views import (LoginView, 
                                   CookieTokenRefreshView, 
                                   GoogleLogin,
                                   LogoutView,
                                   ReviewListView, 
                                   )

from rest_framework.routers import DefaultRouter
from base.views.user_views import UserViewSet

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('token-refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('reviews/', ReviewListView.as_view(), name='google_maps_reviews'),
    
]
