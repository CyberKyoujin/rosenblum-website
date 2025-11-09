from django.urls import path
from base.views.admin_views import AdminLoginView, CustomerListView, RequestView
from base.views.admin_views import UserListView, FileURLView, UserDataView, ToggleOrder, UserOrdersView, UserMessagesView, ToggleViewed, SendMessageView, SearchView
from base.views.order_views import OrdersListView, OrderUpdateView, OrderDeleteView
urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='users'),
    path('customers/', CustomerListView.as_view(), name='customers'),
    path('file/', FileURLView.as_view(), name='file'),
    path('orders/', OrdersListView.as_view(), name='orders'),
    path('requests/', RequestView.as_view(), name='requests'),
    path('user/<int:pk>/', UserDataView.as_view(), name='user'),
    path('toggle-order/<int:pk>/', ToggleOrder.as_view(), name='toggle-order'),
    path('user/<int:pk>/orders', UserOrdersView.as_view(), name='user-orders'),
    path('user/<int:pk>/messages', UserMessagesView.as_view(), name='user-messages'),
    path('user/<int:pk>/toggle-messages', ToggleViewed.as_view(), name='toggle-messages'),
    path('user/<int:pk>/send-message', SendMessageView.as_view(), name='send-message'),
    path('orders/<str:pk>/update/', OrderUpdateView.as_view(), name='order-update'),
    path('orders/<str:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),
    path('search/', SearchView.as_view(), name='search'),
]

