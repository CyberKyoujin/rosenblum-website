from django.urls import path
from base.views.admin_views import AdminLoginView
from base.views.admin_views import UserListView, FileURLView, UserDataView, ToggleOrder, UserOrdersView, UserMessagesView, ToggleViewed, SendMessageView
from base.views.order_views import OrdersListView
urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='users'),
    path('file/', FileURLView.as_view(), name='file'),
    path('orders/', OrdersListView.as_view(), name='orders'),
    path('user/<int:pk>/', UserDataView.as_view(), name='user'),
    path('toggle-order/<int:pk>/', ToggleOrder.as_view(), name='toggle-order'),
    path('user/<int:pk>/orders', UserOrdersView.as_view(), name='user-orders'),
    path('user/<int:pk>/messages', UserMessagesView.as_view(), name='user-messages'),
    path('user/<int:pk>/toggle-messages', ToggleViewed.as_view(), name='toggle-messages'),
    path('user/<int:pk>/send-message', SendMessageView.as_view(), name='send-message')
]
