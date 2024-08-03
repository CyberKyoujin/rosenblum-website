from django.urls import path
from base.views.admin_views import AdminLoginView
from base.views.admin_views import TokenView, UserListView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='login'),
    path('token/', TokenView.as_view(), name='token'),
    path('users/', UserListView.as_view(), name='users')
]
