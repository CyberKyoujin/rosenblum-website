from django.conf import settings
from django.core.mail import send_mail


def send_simple_email(subject: str, message: str, recipient_email: str):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[recipient_email],
        fail_silently=False
    )
    
def send_message_account_created(receiver_email: str, receiver_first_name: str, receiver_last_name: str):
    subject = "Willkommen bei Rosenblum Übersetzungsbüro!"
    message = (
        f"Hallo {receiver_first_name} {receiver_last_name}\n"
        "Ihr Konto wurde erfolgreich registriert.\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    send_simple_email(subject, message, receiver_email)
    
def send_new_message_email(receiver_email: str):
    subject = "Sie haben eine neue Nachricht!"
    message = (
        "Eine neue Nachricht wurde für Sie zugestellt.\n\n"
        "Sie können die Nachricht unter folgendem Link einsehen: "
        "localhost:3000/messages\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    send_simple_email(subject, message, receiver_email)
    
def send_order_ready_email(user_email: str, order_id: int):
    subject = "Ihre Übersetzung ist fertig!"
    message = (
        f"Ihre Bestellung Nr. {order_id} ist fertiggestellt.\n\n"
        "Sie können die Dokumente jetzt in Ihrem Profil einsehen oder abholen.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )
    
    send_simple_email(subject, message, user_email)