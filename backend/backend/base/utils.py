from decimal import Decimal


def get_doc_price(doc_type):
    doc_prices = {
        "Geburtsurkunde": Decimal('35.30'),
        "Sterbeurkunde": Decimal('35.30'),
        "Heiratsurkunde": Decimal('35.30'),
        "Scheidungsurkunde": Decimal('35.30'),
        "Führerschein": Decimal('35.30'),
    }
    return doc_prices.get(doc_type, Decimal('0.00'))