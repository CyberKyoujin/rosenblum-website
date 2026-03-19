from decimal import Decimal


def get_doc_price(doc_type):
    doc_prices = {
        "Geburtsurkunde": Decimal('35.30'),
        "Geburtssurkunde": Decimal('2.50'),
        "Heiratsurkunde": Decimal('35.30'),
        "Sterbeurkunde": Decimal('35.30'),
        "Scheidungsurkunde": Decimal('35.30'),
        "Führerschein": Decimal('30.30'),
        "Übersetzung der Appostile": Decimal('10.50'),
        "Apostille auf unsere Übersetzung": Decimal('35.00'),
        "Namensänderungsurkunde": Decimal('35.30'),
        "Melde-/Negativbescheinigung": Decimal('35.30'),
        "Sonstige Zertifikat/Zeugnis/Bescheinigung (1 Seite)": Decimal('35.30'),
        "Führungszeugnis": Decimal('35.30'),
        "Pass, Ausweis": Decimal('35.30'),
        "Aufenthaltserlaubnis": Decimal('35.30'),
        "Reifezeugnis (ohne Notenanlage)": Decimal('35.30'),
        "Diplom (ohne Notenanlage)": Decimal('35.30'),
        "Reifezeugnis mit Notenanlage": Decimal('70.60'),
        "Sonstiges Dokument mit komplexem Inhalt (Diplom, Arbeitsbuch, Gerichtsurteil, Erklärung)": Decimal('0.00'),
    }
    return doc_prices.get(doc_type, Decimal('0.00'))