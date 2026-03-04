from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from base.models import CustomUser, RequestAnswer, RequestObject, CostEstimate, Order
from django.db import transaction
from base.models import Message
from base.services.email_notifications import (
    send_cost_estimate_email,
    send_request_created,
    send_request_answered_email,
    send_new_message_email,
    send_message_account_created,
    send_order_ready_email,
    send_order_sent_email,
    send_order_pickup_ready_email,
)

_ORDER_READY_STATUSES = {'completed', 'ready_pick_up', 'sent'}


@receiver(post_save, sender=CustomUser)
def user_created_handler(sender, instance: CustomUser, created: bool, **kwargs):
    if not created:
        return
    
    transaction.on_commit(lambda: send_message_account_created(instance.email, instance.first_name, instance.last_name))


@receiver(post_save, sender=Message)
def message_created_handler(sender, instance: Message, created: bool, **kwargs):
    
    if not created:
        return 

    if not instance.receiver or not instance.receiver.email:
        return
    
    transaction.on_commit(lambda: send_new_message_email(instance.receiver.email))
    
    

@receiver(post_save, sender=RequestObject)
def request_created_handler(sender, instance: RequestObject, created: bool, **kwargs):
    
    if not created: 
        return
    
    if not instance.email or not instance.name:
        return
    
    transaction.on_commit(lambda: send_request_created(instance.email, instance.pk, instance.name))
            
    
@receiver(post_save, sender=RequestAnswer)
def request_answer_created_handler(sender, instance: RequestAnswer, created: bool, **kwargs):
    
    if not created: 
        return
    
    if not instance.request.email or not instance.request.name:
        return
    
    transaction.on_commit(lambda: send_request_answered_email(instance.request.email, instance.request.pk, instance.answer_text, instance.request.name))
    
@receiver(post_save, sender=CostEstimate)
def cost_estimate_created_handler(sender, instance: CostEstimate, created: bool, **kwargs):
    
    if not created: 
        return
    
    if not instance.order.email or not instance.order.name:
        return
    
    order = instance.order
    email = None
    if order.user and order.user.email:
        email = order.user.email
    elif order.email:
        email = order.email

    if email:
        transaction.on_commit(lambda: send_cost_estimate_email(email, order.pk))


@receiver(pre_save, sender=Order)
def order_pre_save(sender, instance: Order, **kwargs):
    """Cache the current status before saving so post_save can detect changes."""
    if instance.pk:
        try:
            instance._old_status = Order.objects.get(pk=instance.pk).status
        except Order.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Order)
def order_status_changed_handler(sender, instance: Order, created: bool, **kwargs):
    if created:
        return

    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status

    if old_status == new_status:
        return

    # Only notify on first transition INTO a ready status
    if old_status in _ORDER_READY_STATUSES or new_status not in _ORDER_READY_STATUSES:
        return

    email = instance.user.email if (instance.user and instance.user.email) else instance.email
    order_pk = instance.pk

    if new_status == 'sent':
        transaction.on_commit(lambda: send_order_sent_email(email, order_pk))
    elif new_status == 'ready_pick_up':
        transaction.on_commit(lambda: send_order_pickup_ready_email(email, order_pk))
    else:
        transaction.on_commit(lambda: send_order_ready_email(email, order_pk))