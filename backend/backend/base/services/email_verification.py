from base.services.email_notifications import send_simple_email
from base.models import EmailVerification
import random
from base.models import CustomUser
from rest_framework.response import Response
from dataclasses import dataclass

@dataclass
class VerificationResult:
    ok: bool
    error: str | None = None
    attempts: int | None = None
    

def generate_verification_code(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


def send_verification_code(receiver_email: str, receiver_first_name: str, receiver_last_name: str):
    
    verification_code = generate_verification_code()
    
    subject = "Ihr Verifizierungscode"
    message = (
        f"Hallo, {receiver_first_name} {receiver_last_name}\n"
        "Hier ist ihr Virifizierungscode:\n\n"
        f"{verification_code}\n\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )
    
    send_simple_email(subject, message, receiver_email)
    
    return verification_code

def verify_email(user_email: str, verification_code: str) -> VerificationResult:
    
    try:
        user = CustomUser.objects.get(email=user_email)
    except CustomUser.DoesNotExist:
        return VerificationResult(ok=False, error="user_not_found")
    
    try:
        ev = EmailVerification.objects.get(user=user, used=False)
    except EmailVerification.DoesNotExist:
        return VerificationResult(ok=False, error="no_active_verification")
    
    if ev.is_expired():
        return VerificationResult(ok=False, error="verification_code_expired")
    
    if ev.has_no_attempts_left():
        return VerificationResult(ok=False, error="no_verification_attempts")
    
    if ev.code != verification_code:
        new_attempts_value = ev.attempts - 1
        ev.attempts = new_attempts_value
        ev.save()
        return VerificationResult(ok=False, error="invalid_verification_code", attempts=new_attempts_value)
    
    ev.used=True
    ev.save()
    user.is_active = True
    user.save()
    
    return VerificationResult(ok=True)
    
    
        