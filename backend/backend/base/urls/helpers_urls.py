from django.urls import path
from base.views.helper_views import UserVerificationCode


urlpatterns = [
    path('user-verification-code/', UserVerificationCode.as_view(), name="user-verification-code"),
]