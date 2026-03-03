import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from decouple import config
import stripe
from django.db import IntegrityError, transaction
from base.models import Order
from django_q.tasks import async_task
from base.services.tasks import create_lex_office_invoice
from base.services.email_notifications import send_admin_dispute_notification
import sentry_sdk
from decimal import Decimal

stripe.api_key = config('STRIPE_SECRET_KEY')

logger = logging.getLogger(__name__)

class CreatePaymentIntent(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id') 
        
        if not order_id:
            logger.warning("[Stripe PaymentIntent]: Invalid or missing order_id=%s in request.", order_id)
            return Response({'error': 'order_id is required'}, status=400)
        
        logger.info("[Stripe PaymentIntent]: Payment intent triggered, order_id=%s", order_id)

        try:

            order = Order.objects.get(pk=order_id)

            # IDOR check: authenticated users can only pay for their own orders
            if request.user.is_authenticated and not request.user.is_staff:
                if order.user_id and order.user_id != request.user.id:
                    logger.warning("[Stripe PaymentIntent]: IDOR attempt by user_id=%s for order_id=%s", request.user.id, order_id)
                    return Response({'error': 'Not found'}, status=404)

            # Guest check: guest_uuid must match if order is anonymous
            if not request.user.is_authenticated and order.guest_uuid:
                guest_uuid = request.data.get('guest_uuid')
                if str(order.guest_uuid) != str(guest_uuid):
                    logger.warning("[Stripe PaymentIntent]: Invalid guest_uuid for order_id=%s", order_id)
                    return Response({'error': 'Not found'}, status=404)

            if order.payment_status == Order.PaymentStatus.PAID:
                logger.warning("[Stripe PaymentIntent]: Attempt to create payment intent for already paid order_id=%s", order_id)
                return Response({'error': 'Order already paid'}, status=400)

            total_price = order.total_price

            if total_price <= 0:
                logger.warning("[Stripe PaymentIntent]: Total price is zero or None for order_id=%s. Cannot create payment intent.", order_id)
                return Response({'error': 'No documents found for this order'}, status=400)

            amount = int(total_price * Decimal('100'))

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='eur',
                automatic_payment_methods={
                    'enabled': True,
                },
                metadata={'order_id': str(order_id) if order_id else ''}
            )

            logger.info("[Stripe PaymentIntent]: Payment intent created successfully for order_id=%s, amount=%s", order_id, amount)

            return Response({
                'clientSecret': intent['client_secret']
            }, status=200)

        except Order.DoesNotExist:
            logger.warning("[Stripe PaymentIntent]: Order not found order_id=%s", order_id)
            return Response({'error': 'Not found'}, status=404)
        except Exception as e:
            logger.exception("[Stripe PaymentIntent]: Unexpected error creating payment intent for order_id=%s: %s", order_id, e)
            return Response({'error': 'Internal server error'}, status=500)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = config('STRIPE_WEBHOOK_SECRET', default='')


    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        logger.error("[Stripe Webhook] ValueError: %s", e)
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error("[Stripe Webhook] SignatureVerificationError: %s", e)
        return HttpResponse(status=400)

    logger.info("[Stripe Webhook] Stripe Event Received: %s", event['type'])
    
    # 1. Extract event type (succeeded)

    if event['type'] == 'payment_intent.succeeded':
        
        payment_intent = event['data']['object']
        order_id = payment_intent['metadata'].get('order_id')
        
        # Assigning sentry tag for better error tracking
        sentry_sdk.set_tag("order_id", order_id)
        
        logger.info("[Stripe Webhook] PaymentIntent succeeded for order_id: %s", order_id)
        
        try:
            
            with transaction.atomic():
            
                order = Order.objects.select_for_update().get(pk=order_id)
                
                if order.payment_status != 'paid':
                        
                    order.payment_status = 'paid'
                    order.stripe_payment_intent_id = payment_intent['id']
                    
                    order.save(update_fields=['payment_status', 'stripe_payment_intent_id'])
                    
                    # Async lex office task only on successfull DB commit
                    transaction.on_commit(lambda: async_task(create_lex_office_invoice, order_id))
                    
                    logger.info("[Stripe Webhook]: Order %s successfully processed via webhook.", order_id)
                    return HttpResponse(status=200)
                else:
                    logger.info("[Stripe Webhook]: Order %s already marked as paid, skipping.", order_id)
                    return HttpResponse(status=200)
            
        except Order.DoesNotExist:
            logger.error("[Stripe Webhook]: Order with id %s does not exist or not found.", order_id)
            sentry_sdk.capture_message(f"[Stripe Webhook] Error: Order with id {order_id} not found", level='error')
            return HttpResponse(status=200)
            
        except Exception as e:
            logger.exception("[Stripe Webhook]: Unexpected error in webhook for order %s: %s", order_id, e)
            return HttpResponse(status=500)
    elif event['type'] == 'charge.dispute.created':
        dispute = event['data']['object']
        dispute_id = dispute.get('id', '')
        amount_cents = dispute.get('amount', 0)
        reason = dispute.get('reason', 'unbekannt')
        payment_intent_id = dispute.get('payment_intent', '')

        # Resolve order_id from our DB via the stored payment intent ID
        order_id = payment_intent_id  # fallback
        try:
            order = Order.objects.filter(stripe_payment_intent_id=payment_intent_id).first()
            if order:
                order_id = str(order.pk)
        except Exception as e:
            logger.error("[Stripe Webhook] Error resolving order for dispute %s: %s", dispute_id, e)

        logger.warning("[Stripe Webhook] Dispute created — order_id=%s, dispute_id=%s, reason=%s, amount=%s cents",
                       order_id, dispute_id, reason, amount_cents)
        sentry_sdk.capture_message(f"[Stripe Webhook] Dispute created for order {order_id}", level='warning')
        send_admin_dispute_notification(order_id, amount_cents, reason, dispute_id)

    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        order_id = payment_intent['metadata'].get('order_id')
        error = payment_intent.get('last_payment_error', {}) or {}
        logger.warning("[Stripe Webhook] PaymentIntent failed — order_id=%s, error=%s",
                       order_id, error.get('message', 'unknown'))

    else:
        logger.debug("[Stripe Webhook] Unhandled event type: %s", event['type'])

    return HttpResponse(status=200)
