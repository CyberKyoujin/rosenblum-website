from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from base.models import CustomUser

@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    if created:
        send_mail(
            subject='Herzlich Willkommen bei der Rosenblum Übersetzungsbüro!',
            message=f"""Sehr geehrte/r {instance.first_name + ' ' + instance.last_name},
            
            herzlich willkommen bei Rosenblum Übersetzungsbüro! Wir freuen uns sehr, dass Sie sich entschieden haben, Teil unserer Gemeinschaft zu werden.
            
            Als Ihr Partner für sprachliche Dienstleistungen möchten wir sicherstellen, dass Sie die bestmögliche Erfahrung bei uns haben. 
            
            Link zu ihrem Profil: http://localhost:5173/profile
            
            Mit freundlichen Grüßen, Ihr Rosenblum Übersetzungsbüro-Team""",
            
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=False,
        )