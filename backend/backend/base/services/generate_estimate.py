import base64
from io import BytesIO
from pathlib import Path

from django.template.loader import render_to_string
from xhtml2pdf import pisa

from base.models import Order

# Generate cost estimate PDF for an order

TEMPLATES_DIR = Path(__file__).parent.parent / 'templates' / 'quotes'

def generate_quote_pdf(order_id: int) -> bytes:

    order = Order.objects.prefetch_related('documents').get(id=order_id)

    documents = order.documents.all()
    docs_total = sum(
        d.price for d in documents if not d.individual_price
    )
    has_individual_docs = any(d.individual_price for d in documents)

    logo_file = TEMPLATES_DIR / 'logo.png'
    logo_b64 = base64.b64encode(logo_file.read_bytes()).decode('utf-8')
    logo_url = f'data:image/png;base64,{logo_b64}'

    html_string = render_to_string('quotes/pdf_template.html', {
        'order': order,
        'docs_total': f'{docs_total:.2f}',
        'has_individual_docs': has_individual_docs,
        'logo_url': logo_url,
    })

    buffer = BytesIO()
    pisa.CreatePDF(html_string, dest=buffer)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    return pdf_bytes
