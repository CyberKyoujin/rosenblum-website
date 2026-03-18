import base64
import logging
from io import BytesIO
from pathlib import Path

from django.template.loader import render_to_string
from xhtml2pdf import pisa

from base.models import Order

logger = logging.getLogger(__name__)

# Generate cost estimate PDF for an order

TEMPLATES_DIR = Path(__file__).parent.parent / 'templates' / 'quotes'

def generate_quote_pdf(order_id: int) -> bytes:
    logger.info("[PDF]: Starting PDF generation for order_id=%s", order_id)

    order = Order.objects.prefetch_related('documents').get(id=order_id)
    logger.info("[PDF]: Order fetched: %s, documents count=%s", order_id, order.documents.count())

    documents = order.documents.all()
    docs_total = sum(
        d.price for d in documents if not d.individual_price
    )
    
    has_individual_docs = any(d.individual_price for d in documents)
    logger.info("[PDF]: docs_total=%s, has_individual_docs=%s", docs_total, has_individual_docs)

    logo_file = TEMPLATES_DIR / 'logo.png'
    if not logo_file.exists():
        logger.error("[PDF]: Logo file not found at %s", logo_file)
        raise FileNotFoundError(f"Logo not found: {logo_file}")

    logo_b64 = base64.b64encode(logo_file.read_bytes()).decode('utf-8')
    logo_url = f'data:image/png;base64,{logo_b64}'
    logger.info("[PDF]: Logo loaded successfully")

    html_string = render_to_string('quotes/pdf_template.html', {
        'order': order,
        'docs_total': f'{docs_total:.2f}',
        'has_individual_docs': has_individual_docs,
        'logo_url': logo_url,
    })
    logger.info("[PDF]: HTML template rendered, length=%s chars", len(html_string))

    buffer = BytesIO()
    result = pisa.CreatePDF(html_string, dest=buffer)
    if result.err:
        logger.error("[PDF]: xhtml2pdf error for order_id=%s: %s", order_id, result.err)
        raise RuntimeError(f"PDF generation failed with error code: {result.err}")

    pdf_bytes = buffer.getvalue()
    buffer.close()
    logger.info("[PDF]: PDF generated successfully, size=%s bytes", len(pdf_bytes))

    return pdf_bytes
