import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

ORDER_TYPE_LABELS = {
    'kostenvoranschlag': 'Kostenvoranschlag',
    'order': 'Übersetzungsauftrag',
}

PAYMENT_TYPE_LABELS = {
    'rechnung': 'Rechnung',
    'stripe': 'Stripe',
}

def _send(text: str) -> None:
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        return

    try:
        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                'chat_id': chat_id,
                'text': text,
                'parse_mode': 'Markdown',
                'disable_web_page_preview': True,
            },
            timeout=5
        )

    except Exception as e:
        logger.warning(f"Telegram notification failed: {e}")


def notify_new_order(order) -> None:
    order_type = ORDER_TYPE_LABELS.get(order.order_type, order.order_type)
    docs = order.documents.all()
    docs_lines = '\n'.join(f"  • {d.type} ({d.language.upper()}) — {d.price} €" for d in docs)

    _send(
        f"📥 *Новый заказ \\#{order.id}*\n"
        f"📋 Тип: {order_type}\n"
        f"👤 {order.name}\n"
        f"✉️ {order.email}\n"
        f"📞 {order.phone_number}\n"
        f"🏙 {order.city}, {order.street}, {order.zip}\n"
        f"📄 Документы:\n{docs_lines}\n"
        f"💶 Итого: {order.total_price} €"
    )


def notify_new_request(req) -> None:
    _send(
        f"📨 *Новая заявка \\#{req.id}*\n"
        f"👤 {req.name}\n"
        f"✉️ {req.email}\n"
        f"📞 {req.phone_number}\n"
        f"💬 {req.message}"
    )


def notify_payment_received(order) -> None:
    payment_type = PAYMENT_TYPE_LABELS.get(order.payment_type, order.payment_type or '—')
    _send(
        f"💰 *Оплата получена*\n"
        f"Заказ \\#{order.id} — {order.total_price} €\n"
        f"👤 {order.name}\n"
        f"✉️ {order.email}\n"
        f"💳 Способ: {payment_type}"
    )


def notify_dispute(order_id: str, amount_cents: int, reason: str, dispute_id: str) -> None:
    amount = amount_cents / 100
    _send(
        f"⚠️ *ДИСПУТ \\(Chargeback\\)*\n"
        f"Заказ \\#{order_id}\n"
        f"💶 Сумма: {amount:.2f} €\n"
        f"📋 Причина: {reason}\n"
        f"🆔 Dispute ID: `{dispute_id}`\n"
        f"⏰ Ответить в течение 7 дней\\!"
    )


def notify_payment_failed(order_id: str, error_message: str) -> None:
    _send(
        f"❌ *Платёж не прошёл*\n"
        f"Заказ \\#{order_id}\n"
        f"💬 {error_message}"
    )


STATUS_LABELS = {
    'review': '🔍 На рассмотрении',
    'in_progress': '⚙️ В работе',
    'ready_pick_up': '📦 Готов к выдаче',
    'sent': '📬 Отправлен',
    'canceled': '🚫 Отменён',
    'waiting_for_payment': '💳 Ожидает оплаты',
}


def notify_cost_estimate_created(order) -> None:
    _send(
        f"📊 *Kostenvoranschlag создан*\n"
        f"Заказ \\#{order.id}\n"
        f"👤 {order.name}\n"
        f"✉️ {order.email}\n"
        f"💶 Сумма: {order.total_price} €"
    )


def notify_order_status_changed(order, new_status: str) -> None:
    label = STATUS_LABELS.get(new_status, new_status)
    _send(
        f"🔄 *Статус заказа изменён*\n"
        f"Заказ \\#{order.id}\n"
        f"👤 {order.name}\n"
        f"📋 Новый статус: {label}"
    )
