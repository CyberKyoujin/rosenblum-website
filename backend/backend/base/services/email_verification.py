from base.services.email_notifications import _send_html_email
from base.models import EmailVerification
import random
from base.models import CustomUser
from dataclasses import dataclass
import logging


logger = logging.getLogger(__name__)


@dataclass
class VerificationResult:
    ok: bool
    error: str | None = None
    attempts: int | None = None


def generate_verification_code(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

def send_verification_code(receiver_email: str, receiver_first_name: str, receiver_last_name: str, verification_code: str):

    subject = "Ihr Verifizierungscode"
    plain = (
        f"Hallo, {receiver_first_name} {receiver_last_name}\n"
        f"Hier ist Ihr Verifizierungscode: {verification_code}\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=receiver_email,
        context={
            'title': 'E-Mail-Verifizierung',
            'greeting': f'Hallo, {receiver_first_name} {receiver_last_name}',
            'body_lines': [
                'Bitte verwenden Sie den folgenden Code, um Ihre E-Mail-Adresse zu verifizieren:',
            ],
            'highlight_label': 'Ihr Code',
            'highlight_text': verification_code,
            'body_lines_after': [
                'Der Code ist 15 Minuten gültig.',
            ],
        },
    )

    return verification_code

def verify_email(user_email: str, verification_code: str) -> VerificationResult:
    
    try:
        user = CustomUser.objects.get(email=user_email)
    except CustomUser.DoesNotExist:
        logger.warning(f"[Email Verification]: Email verification failed: user with email {user_email} not found.")
        return VerificationResult(ok=False, error="user_not_found")
    
    try:
        ev = EmailVerification.objects.get(user=user, used=False)
    except EmailVerification.DoesNotExist:
        logger.warning(f"[Email Verification]: Email verification failed: no active verification found for user with email {user_email}.")
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
    
    
        