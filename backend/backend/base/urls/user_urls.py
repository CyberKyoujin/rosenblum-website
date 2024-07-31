from django.urls import path
from base.views.user_views import UserTokenRefreshView, UserRegisterView, UserTokenObtainPairView, GoogleLogin, UserView, UserUpdateView, UserMesagesView, ToggleViewed, SendMessageView, RequestView, GoogleMapsReviewsView

from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserTokenObtainPairView.as_view(), name='login'),
    path("update/", UserUpdateView.as_view(), name=""),
    path('token-refresh/', UserTokenRefreshView.as_view(), name='token-refresh'),
    path('login/google/', GoogleLogin.as_view(), name='google_login'),
    path('user-data/', UserView.as_view(), name='user_data'),
    path('messages/', UserMesagesView.as_view(), name='messages'),
    path('toggle-messages/', ToggleViewed.as_view(), name='toggle-messages'),
    path('send-message/', SendMessageView.as_view(), name='send-message'),
    path('new-request/', RequestView.as_view(), name='request'),
    path('reviews/', GoogleMapsReviewsView.as_view(), name='google_maps_reviews'),
    
]
