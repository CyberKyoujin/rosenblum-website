from base.services.email_notifications import send_mail
import quantumrandom
from base.models import EmailVerification
import random

def generate_verification_code(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


def send_verification_code(receiver_email: str, receiver_first_name: str, receiver_last_name: str):
    
    verification_code = generate_verification_code()
    
    subject = "Ihr Verifizierungscode"
    message = (
        f"Hallo {receiver_first_name} {receiver_last_name}\n"
        "Hier ist ihr Virifizierungscode.\n"
        f"{verification_code}\n\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )
    
    send_mail(subject, receiver_email, message)
    
    return verification_code
    
        