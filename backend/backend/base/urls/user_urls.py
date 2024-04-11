from django.urls import path
from base.views.user_views import UserRegisterView, UserTokenObtainPairView, GoogleLogin, UserView, UserUpdateView
from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserTokenObtainPairView.as_view(), name='login'),
    path("update/", UserUpdateView.as_view(), name=""),
    path('token-refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('user-data/', UserView.as_view(), name='user_data'),
]
