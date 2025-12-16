from django.urls import path
from base.views.admin_views import AdminLoginView, TranslationView, DeleteTranslationView, CustomerListView, RequestsView, GlobalMessagesView, TranslateText, TranslationsView, CreateTranslationView
from base.views.admin_views import  RequestView, FileURLView, UserDataView, ToggleOrder, UserOrdersView, UserMessagesView, ToggleViewed, SearchView, CreateRequestAnswerView, RequestAnswerView
from base.views.order_views import OrdersViewSet, OrderUpdateView, OrderDeleteView
from base.views.user_views import SendMessageView


urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='login'),
    path('customers/', CustomerListView.as_view(), name='customers'),
    path('orders/', OrdersViewSet.as_view(), name='orders'),
    path('requests/', RequestsView.as_view(), name='requests'),
    path('messages/', GlobalMessagesView.as_view(), name="global-messages"),
    path('translate/', TranslateText.as_view(), name="translate"), 
    path('translations/', TranslationsView.as_view(), name="translations"),
    path('translations/<int:pk>/', TranslationView.as_view(), name="translation"),
    path('translations/create/', CreateTranslationView.as_view(), name="create-translation"),
    path('translations/delete/<int:pk>/', DeleteTranslationView.as_view(), name="delete-translation"),
    path('file/', FileURLView.as_view(), name='file'),
    path('answer-request/', CreateRequestAnswerView.as_view(), name="answer_request"),
    path('request-answer/<int:pk>/', RequestAnswerView.as_view(), name="request-answers"),
    path('user/<int:pk>/', UserDataView.as_view(), name='user'),
    path('toggle-order/<int:pk>/', ToggleOrder.as_view(), name='toggle-order'),
    path('user/<int:pk>/orders', UserOrdersView.as_view(), name='user-orders'),
    path('user/request/<int:pk>/', RequestView.as_view(), name="request"),
    path('user/<int:pk>/messages', UserMessagesView.as_view(), name='user-messages'),
    path('user/toggle-messages/', ToggleViewed.as_view(), name='toggle-messages'),
    path('user/send-message/', SendMessageView.as_view(), name='send-message'),
    path('orders/<str:pk>/update/', OrderUpdateView.as_view(), name='order-update'),
    path('orders/<str:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),
    path('search/', SearchView.as_view(), name='search'),
]

