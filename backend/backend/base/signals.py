from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from base.models import CustomUser, Order

from base.models import Message
from base.services.email_notifications import send_new_message_email, send_order_ready_email, send_message_account_created


@receiver(post_save, sender=CustomUser)
def user_created_handler(sender, instance: CustomUser, created: bool, **kwargs):
    if not created:
        return
    
    send_message_account_created(instance.email, instance.first_name, instance.last_name)



        

@receiver(post_save, sender=Message)
def message_created_handler(sender, instance: Message, created: bool, **kwargs):
    
    if not created:
        return 

    if not instance.receiver or not instance.receiver.email:
        return
    
    send_new_message_email(instance.receiver.email)
    
    
@receiver(pre_save, sender=Order)
def order_status_changed_handler(sender, instance: Order, **kwargs):
    if instance.pk is None:
        return

    try:
        old = Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return

    old_status = old.status
    new_status = instance.status

    print(
        "ORDER STATUS SIGNAL:",
        "id=", instance.pk,
        "old=", old_status,
        "new=", new_status,
    )

    if old_status != "ready" and new_status == "ready":
        email = None
        if instance.user and instance.user.email:
            email = instance.user.email
        elif instance.email:
            email = instance.email

        if email:
            send_order_ready_email(email, instance.pk)
            
    
