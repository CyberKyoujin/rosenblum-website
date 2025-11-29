from django.urls import path
from base.views.user_views import (UserTokenRefreshView, 
                                   UserRegisterView, 
                                   UserTokenObtainPairView, 
                                   GoogleLogin, UserView, 
                                   UserUpdateView, UserMesagesView, 
                                   ToggleViewed, SendMessageView, 
                                   RequestView, 
                                   ReviewListView, 
                                   EmailVerificationView, ResendVerificationCode, SendPasswordResetLink, ResetPassword)

from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('email-verification/', EmailVerificationView.as_view(), name='email_verification'),
    path('resend-verification/', ResendVerificationCode.as_view(), name='email_verification'),
    path('login/', UserTokenObtainPairView.as_view(), name='login'),
    path('password-reset-link/', SendPasswordResetLink.as_view(), name='send-reset-link'),
    path('password-reset-confirm/', ResetPassword.as_view(), name='password-reset'),
    path("update/", UserUpdateView.as_view(), name=""),
    path('token-refresh/', UserTokenRefreshView.as_view(), name='token-refresh'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('user-data/', UserView.as_view(), name='user_data'),
    path('messages/', UserMesagesView.as_view(), name='messages'),
    path('toggle-messages/', ToggleViewed.as_view(), name='toggle-messages'),
    path('send-message/', SendMessageView.as_view(), name='send-message'),
    path('new-request/', RequestView.as_view(), name='request'),
    path('reviews/', ReviewListView.as_view(), name='google_maps_reviews'),
    
]
