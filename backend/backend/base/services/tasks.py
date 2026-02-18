import logging
import requests
from django.core.files.base import ContentFile
from decouple import config
from base.models import Order, Invoice
from base.services.email_notifications import _send_invoice_email
from django.db import transaction
from decimal import Decimal, ROUND_HALF_UP

logger = logging.getLogger(__name__)

AUTH_TOKEN = config('LEX_OFFICE_AUTH_TOKEN')
LEXOFFICE_BASE = "https://api.lexoffice.io/v1"
HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json",
}

def create_lex_office_invoice(order_id):

        try:
            order = Order.objects.prefetch_related('documents').get(id=order_id)
        except Order.DoesNotExist:
            logger.error("[LexOffice]: Order with ID %s not found in database.", order_id)
            return None

        line_items = []
        
        for doc in order.documents.all():
            gross_price = doc.price
            net_amount = (gross_price / Decimal('1.19')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

            line_items.append({
                "type": "custom",
                "name": f"{doc.type} ({doc.language.upper()})",
                "description": f"Übersetzung — {doc.type} ({doc.language.upper()})",
                "quantity": 1,
                "unitName": "Stück",
                "unitPrice": {
                    "currency": "EUR",
                    "netAmount": float(net_amount),
                    "taxRatePercentage": 19,
                },
                "discountPercentage": 0,
            })

        # --- Payment conditions based on payment type ---
        if order.payment_type == 'rechnung':
            payment_conditions = {
                "paymentTermLabel": "Zahlbar innerhalb von 14 Tagen",
                "paymentTermDuration": 14,
            }
        else:
            payment_conditions = {
                "paymentTermLabel": "Zahlung bereits erhalten",
                "paymentTermDuration": 0,
            }

        payload = {
            "voucherDate": order.date.strftime('%Y-%m-%dT00:00:00.000+01:00'),
            "address": {
                "name": order.name,
                "street": order.street,
                "city": order.city,
                "zip": order.zip,
                "countryCode": "DE",
            },
            "lineItems": line_items,
            "totalPrice": {
                "currency": "EUR",
            },
            "taxConditions": {
                "taxType": "net",
            },
            "paymentConditions": payment_conditions,
            "shippingConditions": {
                "shippingDate": order.date.strftime('%Y-%m-%dT00:00:00.000+01:00'),
                "shippingType": "delivery",
            },
            "title": "Rechnung",
            "introduction": "Ihre bestellten Positionen stellen wir Ihnen hiermit in Rechnung.",
            "remark": "Vielen Dank für Ihren Auftrag!\nÜbersetzungsbüro Rosenblum",
        }
        
        try:
            logger.info("[LexOffice]: Trigger Lexofice invoice for %s: sum=%s", order.name, net_amount)
            # --- Create invoice (finalized) ---
            response = requests.post(
                f"{LEXOFFICE_BASE}/invoices",
                headers=HEADERS,
                params={"finalize": "true"},
                json=payload,
                timeout=15
            )
            response.raise_for_status()  # Will raise an HTTPError if the response was an error
        except Exception as e:
            logger.error("[LexOffice]: API Request failed for order %s: %s", order_id, str(e))
            return None

        invoice_data = response.json()
        invoice_id = invoice_data.get("id")
        
        # --- Download Invoice PDF ---
        pdf_bytes = _download_invoice_pdf(invoice_id)
        
        with transaction.atomic():
            order.refresh_from_db()  # Ensure we have the latest data before updating      

            # --- Save lexoffice ID to order ---
            order.lexoffice_id = invoice_id
            order.save(update_fields=["lexoffice_id"])
            
            if pdf_bytes:
                invoice_obj, _ = Invoice.objects.get_or_create(order=order)
                invoice_obj.file.save(
                    f"Rechnung_{order.pk}.pdf",
                    ContentFile(pdf_bytes),
                    save=True
                )
            
            logger.info("[LexOffice]: Invoice created for order %s with LexOffice ID %s", order_id, invoice_id)

        # --- Send Invoice to client ---
        if pdf_bytes:
            _send_invoice_email(order, pdf_bytes)
            logger.info("[Email Notification]: Invoice email sent for order %s", order_id)
        
        return invoice_data


def _download_invoice_pdf(invoice_id):
    response = requests.get(
        f"{LEXOFFICE_BASE}/invoices/{invoice_id}/document",
        headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
        timeout=15
    )

    if response.status_code != 200:
        logger.error(
            "[LexOffice]: lexoffice PDF download failed for invoice %s: %s %s",
            invoice_id, response.status_code, response.text,
        )
        return None

    document_url = response.json().get("documentFileId")
    if not document_url:
        logger.error("[LexOffice]: No documentFileId in response for invoice %s", invoice_id)
        return None

    pdf_response = requests.get(
        f"{LEXOFFICE_BASE}/files/{document_url}",
        headers={"Authorization": f"Bearer {AUTH_TOKEN}"},
        timeout=15
    )

    if pdf_response.status_code != 200:
        logger.error(
            "[LexOffice]: lexoffice PDF download failed for %s: %s",
            document_url, pdf_response.status_code,
        )
        return None

    return pdf_response.content


