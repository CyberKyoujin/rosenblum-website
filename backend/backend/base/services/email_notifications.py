import logging
from django.conf import settings

logger = logging.getLogger(__name__)
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from base.models import CostEstimate, Order

ADMIN_EMAIL = 'rosenblum.uebersetzungsbuero@gmail.com'


def _send_html_email(subject: str, plain_text: str, recipient_email: str, context: dict, file_content=None, file_name=None):
    html_body = render_to_string('emails/base_email.html', context)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=plain_text,
        from_email=settings.EMAIL_HOST_USER,
        to=[recipient_email],
    )
    
    msg.attach_alternative(html_body, 'text/html')
    
    if file_content:
        attachment_name = f'{file_name}.pdf' if file_name else 'Dokument.pdf'
        msg.attach(attachment_name, file_content, 'application/pdf')
        
    try:
        msg.send(fail_silently=False)
    except Exception as e:
        logger.error("[EMAIL] Failed to send email to %s: %s", recipient_email, e)


def send_simple_email(subject: str, message: str, recipient_email: str):
    _send_html_email(
        subject=subject,
        plain_text=message,
        recipient_email=recipient_email,
        context={
            'body_lines': [message],
        },
    )


def send_reset_link_email(receiver_email: str, receiver_first_name: str, receiver_last_name: str, reset_link: str):
    subject = "Passwort-Reset Link"
    plain = (
        f"Hallo, {receiver_first_name} {receiver_last_name}\n"
        f"Hier ist Ihr Link zum Passwort-Reset: {reset_link}\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=receiver_email,
        context={
            'title': 'Passwort zurücksetzen',
            'greeting': f'Hallo, {receiver_first_name} {receiver_last_name}',
            'body_lines': [
                'Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.',
                'Klicken Sie auf den Button unten, um ein neues Passwort festzulegen.',
            ],
            'button_url': reset_link,
            'button_text': 'Passwort zurücksetzen',
        },
    )


def send_message_account_created(receiver_email: str, receiver_first_name: str, receiver_last_name: str):
    subject = "Willkommen bei Rosenblum Übersetzungsbüro!"
    plain = (
        f"Hallo, {receiver_first_name} {receiver_last_name}\n"
        "Ihr Konto wurde erfolgreich registriert.\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=receiver_email,
        context={
            'title': 'Willkommen!',
            'greeting': f'Hallo, {receiver_first_name} {receiver_last_name}',
            'body_lines': [
                'Ihr Konto wurde erfolgreich registriert.',
                'Sie können sich jetzt anmelden und unsere Dienstleistungen nutzen.',
            ],
        },
    )


def send_new_message_email(receiver_email: str):
    subject = "Sie haben eine neue Nachricht!"
    plain = (
        "Eine neue Nachricht wurde für Sie zugestellt.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=receiver_email,
        context={
            'title': 'Neue Nachricht',
            'body_lines': [
                'Eine neue Nachricht wurde für Sie zugestellt.',
                'Melden Sie sich in Ihrem Konto an, um die Nachricht einzusehen.',
            ],
        },
    )


def send_order_ready_email(user_email: str, order_id: int):
    subject = "Ihre Übersetzung ist fertig!"
    plain = (
        f"Ihre Bestellung Nr. {order_id} ist fertiggestellt.\n\n"
        "Sie können die Dokumente jetzt in Ihrem Profil einsehen oder abholen.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': 'Ihre Übersetzung ist fertig!',
            'body_lines': [
                'Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Übersetzung abgeschlossen ist.',
                'Sie können die Dokumente jetzt in Ihrem Profil einsehen oder abholen.',
            ],
            'info_box_lines': [
                f'Bestellnr.: #ro-{order_id}',
            ],
        },
    )


def send_order_received_email(user_email: str, order_id: int, customer_name: str):
    subject = "Ihre Bestellung ist eingegangen!"
    plain = (
        f"Hallo, {customer_name}\n\n"
        f"Ihre Bestellung #{order_id} wurde erfolgreich bei uns aufgenommen.\n"
        "Wir werden Ihnen schnellstmöglich einen Kostenvoranschlag zusenden.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': 'Bestellung eingegangen',
            'greeting': f'Hallo, {customer_name}',
            'body_lines': [
                f'Ihre Bestellung wurde erfolgreich bei uns aufgenommen.',
                'Wir prüfen Ihre Unterlagen und werden Ihnen schnellstmöglich einen Kostenvoranschlag zusenden.',
            ],
            'info_box_lines': [
                f'Bestellnr.: #ro-{order_id}',
            ],
        },
    )


def send_request_created(user_email: str, request_id: int, requester_name: str):
    subject = "Ihre Anfrage ist erfolgreich versandt!"
    plain = (
        f"Hallo, {requester_name}\n\n"
        f"Ihre Anfrage #{request_id} ist erfolgreich bei uns eingegangen, "
        "wir bearbeiten die schnellstmöglich.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': 'Anfrage eingegangen',
            'greeting': f'Hallo, {requester_name}',
            'body_lines': [
                f'Ihre Anfrage #{request_id} ist erfolgreich bei uns eingegangen.',
                'Wir bearbeiten Ihre Anfrage schnellstmöglich und melden uns bei Ihnen.',
            ],
        },
    )

def send_request_answered_email(user_email: str, request_id: int, answer_text: str, requester_name: str):
    subject = "Antwort zu Ihrer Anfrage!"
    plain = (
        f"Hallo, {requester_name}\n\n"
        f"Antwort zur Anfrage #{request_id}:\n\n"
        f"{answer_text}\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': f'Antwort zu Anfrage #{request_id}',
            'greeting': f'Hallo, {requester_name}',
            'body_lines': [
                'Wir haben auf Ihre Anfrage geantwortet:',
            ],
            'info_box_lines': [answer_text],
        },
    )
    
def _send_invoice_email(order, pdf_bytes):
    subject = "Ihre Rechnung — Übersetzungsbüro Rosenblum"
    is_rechnung = order.payment_type == 'rechnung'

    if is_rechnung:
        plain = (
            f"Hallo {order.name},\n\n"
            f"anbei erhalten Sie die Rechnung zu Ihrer Bestellung #{order.pk}.\n\n"
            "Bitte überweisen Sie den Rechnungsbetrag innerhalb von 10 Tagen auf folgendes Konto:\n\n"
            "Kontoinhaber: Oleg Rosenblum\n"
            "Bank: Deutsche Bank\n"
            "IBAN: DE11 2657 0024 0033 4060 00\n"
            "BIC: DEUTDEDB265\n\n"
            "Bei Fragen stehen wir Ihnen gerne zur Verfügung.\n\n"
            "Mit freundlichen Grüßen,\n"
            "Ihr Übersetzungsbüro Rosenblum"
        )
        context = {
            'title': 'Ihre Rechnung',
            'greeting': f'Hallo {order.name}',
            'body_lines': [
                f'Anbei erhalten Sie die Rechnung zu Ihrer Bestellung #ro-{order.pk}.',
                'Bitte überweisen Sie den Rechnungsbetrag innerhalb von 10 Tagen auf folgendes Konto:',
            ],
            'info_box_lines': [
                f'Bestellnr.: #ro-{order.pk}',
                'Kontoinhaber: Oleg Rosenblum',
                'Bank: Deutsche Bank',
                'IBAN: DE11 2657 0024 0033 4060 00',
                'BIC: DEUTDEDB265',
            ],
            'footer_note': 'Bei Fragen stehen wir Ihnen gerne zur Verfügung.',
        }
    else:
        plain = (
            f"Hallo {order.name},\n\n"
            f"anbei erhalten Sie die Rechnung zu Ihrer Bestellung #{order.pk}.\n\n"
            "Die Zahlung ist bereits erfolgt.\n\n"
            "Bei Fragen stehen wir Ihnen gerne zur Verfügung.\n\n"
            "Mit freundlichen Grüßen,\n"
            "Ihr Übersetzungsbüro Rosenblum"
        )
        context = {
            'title': 'Ihre Rechnung',
            'greeting': f'Hallo {order.name}',
            'body_lines': [
                f'Anbei erhalten Sie die Rechnung zu Ihrer Bestellung #ro-{order.pk}.',
                'Die Zahlung ist bereits erfolgt.',
            ],
            'info_box_lines': [
                f'Bestellnr.: #ro-{order.pk}',
            ],
            'footer_note': 'Bei Fragen stehen wir Ihnen gerne zur Verfügung.',
        }

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=order.email,
        file_name=f'Rechnung_{order.pk}',
        context=context,
        file_content=pdf_bytes,
    )

    logger.info("[EMAIL] Invoice email sent to %s for order %s", order.email, order.pk)
    
def send_order_sent_email(user_email: str, order_id: int):
    """Sent when admin marks order as 'sent' (Versendet)."""
    subject = "Ihre Übersetzung ist unterwegs!"
    plain = (
        f"Hallo,\n\n"
        f"Ihre Bestellung #{order_id} wurde versendet und ist auf dem Weg zu Ihnen.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )
    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': 'Ihre Übersetzung ist unterwegs!',
            'body_lines': [
                'Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Übersetzung versendet wurde.',
                'Die Dokumente sind auf dem Weg zu Ihnen.',
            ],
            'info_box_lines': [f'Bestellnr.: #ro-{order_id}'],
        },
    )


def send_order_pickup_ready_email(user_email: str, order_id: int):
    """Sent when admin marks order as 'ready_pick_up' (Abholbereit)."""
    subject = "Ihre Übersetzung liegt zur Abholung bereit!"
    plain = (
        f"Hallo,\n\n"
        f"Ihre Bestellung #{order_id} liegt in unserem Büro zur Abholung bereit.\n\n"
        "Bitte holen Sie die Dokumente zu unseren Öffnungszeiten ab:\n\n"
        "Montag: 09:00–12:00 Uhr\n"
        "Dienstag: 15:00–18:00 Uhr\n"
        "Mittwoch: 15:00–18:00 Uhr\n"
        "Donnerstag: 09:00–12:00 Uhr\n"
        "Freitag: 09:00–12:00 Uhr\n\n"
        "Termine nach Vereinbarung auch außerhalb der Öffnungszeiten möglich.\n\n"
        "Adresse:\n"
        "Übersetzungsbüro Rosenblum\n"
        "Alte Poststraße 25\n"
        "49074 Osnabrück\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )
    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': 'Abholung bereit!',
            'body_lines': [
                'Ihre Übersetzung ist fertiggestellt und liegt in unserem Büro zur Abholung bereit.',
                'Bitte holen Sie die Dokumente zu unseren Öffnungszeiten ab:',
            ],
            'info_box_lines': [
                f'Bestellnr.: #ro-{order_id}',
                'Montag: 09:00–12:00 | Dienstag: 15:00–18:00 | Mittwoch: 15:00–18:00',
                'Donnerstag: 09:00–12:00 | Freitag: 09:00–12:00',
                'Termine nach Vereinbarung auch außerhalb der Öffnungszeiten möglich.',
                'Adresse: Alte Poststraße 25, 49074 Osnabrück',
            ],
        },
    )


def send_order_canceled_email(user_email: str, order_id: int):
    """Sent when admin marks order as 'canceled' (Storniert)."""
    subject = "Ihre Bestellung wurde storniert"
    plain = (
        f"Hallo,\n\n"
        f"Ihre Bestellung #{order_id} wurde storniert.\n"
        "Bei Fragen wenden Sie sich bitte an uns.\n\n"
        "Mit freundlichen Grüßen,\n"
        "Ihr Übersetzungsbüro Rosenblum"
    )
    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        context={
            'title': 'Bestellung storniert',
            'body_lines': [
                f'Ihre Bestellung #ro-{order_id} wurde leider storniert.',
                'Falls Sie Fragen haben, kontaktieren Sie uns bitte — wir helfen Ihnen gerne weiter.',
            ],
            'info_box_lines': [f'Bestellnr.: #ro-{order_id}'],
        },
    )


def send_admin_new_order_notification(order_id: int, customer_name: str, customer_email: str, order_type: str, total: float):
    """Internal notification to admin when a new order is placed."""
    type_label = 'Kostenvoranschlag' if order_type == 'kostenvoranschlag' else 'Bestellung'
    subject = f"[Rosenblum] Neue {type_label} #{order_id} von {customer_name}"
    plain = (
        f"Neue {type_label} eingegangen.\n\n"
        f"Bestellnr.: #ro-{order_id}\n"
        f"Kunde: {customer_name}\n"
        f"E-Mail: {customer_email}\n"
        f"Typ: {type_label}\n"
        f"Gesamtbetrag: {total:.2f} €\n"
    )
    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=ADMIN_EMAIL,
        context={
            'title': f'Neue {type_label} #{order_id}',
            'body_lines': [f'Eine neue {type_label} ist eingegangen.'],
            'info_box_lines': [
                f'Bestellnr.: #ro-{order_id}',
                f'Kunde: {customer_name}',
                f'E-Mail: {customer_email}',
                f'Typ: {type_label}',
                f'Gesamtbetrag: {total:.2f} €',
            ],
        },
    )


def send_admin_dispute_notification(order_id: str, amount_cents: int, reason: str, dispute_id: str):
    """Internal notification to admin when a Stripe dispute (chargeback) is filed."""
    amount_eur = amount_cents / 100
    subject = f"[DRINGEND] Stripe Dispute für Bestellung #{order_id}"
    plain = (
        f"Ein Kunde hat einen Stripe-Dispute (Rückbuchung) eingereicht.\n\n"
        f"Dispute-ID: {dispute_id}\n"
        f"Bestellnr.: {order_id}\n"
        f"Betrag: {amount_eur:.2f} €\n"
        f"Grund: {reason}\n\n"
        "Bitte im Stripe-Dashboard überprüfen und reagieren."
    )
    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=ADMIN_EMAIL,
        context={
            'title': '⚠ Stripe Dispute eingegangen',
            'body_lines': [
                'Ein Kunde hat einen Stripe-Dispute (Rückbuchung) eingereicht.',
                'Bitte sofort im Stripe-Dashboard überprüfen und innerhalb der Frist reagieren.',
            ],
            'info_box_lines': [
                f'Dispute-ID: {dispute_id}',
                f'Bestellnr.: #ro-{order_id}',
                f'Betrag: {amount_eur:.2f} €',
                f'Grund: {reason}',
            ],
        },
    )


def send_cost_estimate_email(user_email: str, order_id: int):
    try:
        order = Order.objects.get(pk=order_id)
    except Order.DoesNotExist:
        logger.error("[EMAIL] Order %s not found, cannot send cost estimate.", order_id)
        return

    subject = "Ihr Kostenvoranschlag ist bereit!"
    
    # TODO: Вынести URL фронтенда в настройки и брать оттуда, с фоллбеком на localhost для разработки
    
    # Берем URL из настроек или фоллбэк на локалхост для разработки
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')

    if order.guest_uuid:
        payment_link = f"https://rosenblum-uebersetzungen.de/guest/{order_id}/{order.guest_uuid}"
        plain = (
            f"Hallo, {order.name}\n\n"
            f"Ihr Kostenvoranschlag für die Bestellung #{order_id} ist jetzt verfügbar.\n"
            f"Sie können ihre Bestellung unter folgendem Link bezahlen: {payment_link}\n\n"
            "Mit freundlichen Grüßen,\n"
            "Ihr Übersetzungsbüro Rosenblum"
        )
        context = {
            'title': f'Kostenvoranschlag für Bestellung #{order_id}',
            'body_lines': [
                f'Hallo, {order.name}\n\n'
                'Ihr Kostenvoranschlag ist jetzt verfügbar.',
                'Sie können ihre Bestellung unter folgendem Link bezahlen und den Status Ihrer Bestellung verfolgen:',
            ],
            'button_url': payment_link,
            'button_text': 'Auftrag bezahlen und verfolgen',
        }
    else:
        payment_link = f"{frontend_url}/order/{order_id}"
        plain = (
            f"Hallo, {order.name}\n\n"
            f"Ihr Kostenvoranschlag für die Bestellung #{order_id} ist jetzt verfügbar.\n"
            f"Sie können ihn im Anhang oder in Ihrem Profil einsehen und unter folgendem Link bezahlen: {payment_link}\n\n"
            "Mit freundlichen Grüßen,\n"
            "Ihr Übersetzungsbüro Rosenblum"
        )
        context = {
            'title': f'Kostenvoranschlag für Bestellung #{order_id}',
            'body_lines': [
                f"Hallo, {order.name}\n\n",
                'Ihr Kostenvoranschlag ist jetzt verfügbar.',
                'Sie können ihn im Anhang oder in Ihrem Profil einsehen.',
            ],
            'button_url': payment_link,
            'button_text': 'Zum Auftrag',
            'info_box_lines': [f'Bestellnr.: #ro-{order_id}'],
        }

    file_content = None
    cost_estimate = CostEstimate.objects.filter(order=order).first()
    
    logger.info(f"[EMAIL]: Payment link for order {order_id} to user {user_email}: {payment_link}, Anonymous: {order.guest_uuid}")

    if cost_estimate and cost_estimate.file:
        try:
            with cost_estimate.file.open(mode='rb') as f:
                file_content = f.read()
        except Exception as e:
            logger.error(f"[EMAIL] Error reading cost estimate file for order {order_id}: {e}")
    else:
        logger.warning(f"[EMAIL] No CostEstimate found for order {order_id}, sending email without attachment.")

    _send_html_email(
        subject=subject,
        plain_text=plain,
        recipient_email=user_email,
        file_content=file_content,
        file_name=f'Kostenvoranschlag_{order_id}',
        context=context
    )
    
    logger.info("[EMAIL] Cost estimate email sent to %s for order %s", user_email, order_id)
