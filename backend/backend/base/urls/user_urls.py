from django.urls import path
from base.views.user_views import UserRegisterView, UserTokenObtainPairView, GoogleLogin
from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserTokenObtainPairView.as_view(), name='login'),
    path('token-refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
]
