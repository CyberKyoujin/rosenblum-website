from django.urls import path
from base.views.payment_views import CreatePaymentIntent, stripe_webhook

urlpatterns = [
    path('payment-intent/', CreatePaymentIntent.as_view(), name="payment-intent"),
    path('webhook/', stripe_webhook, name="stripe-webhook"),
]