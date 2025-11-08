from django.conf import settings
from base.models import Review, ReviewTranslation
import deepl

SUPPORTED_LANGS = ["en", "de", "ru", "uk"]

DEEPL_LANG_MAP = {
    "en": "EN-GB", 
    "de": "DE",
    "ru": "RU",
    "uk": "UK",     
}

def normalize_target_lang(lang_code: str) -> str:
    return DEEPL_LANG_MAP.get(lang_code.lower(), lang_code.upper())

# Deepl translation service

def translate_text(text: str, target_lang: str) -> str:
    auth_key = settings.DEEPL_AUTH_KEY
    deepl_client = deepl.DeepLClient(auth_key)
    
    target_lang = normalize_target_lang(target_lang) 
    
    result = deepl_client.translate_text(text, target_lang=target_lang)
    return result.text

def translate_missing_translations_for_review(review: Review):
    for lang in SUPPORTED_LANGS:
        
        if lang== review.original_language:
            continue
        
        exists = ReviewTranslation.objects.filter(review=review, language=lang).exists()
        
        if exists:
            continue
        
        translated = translate_text(review.original_text, target_lang=lang)
        ReviewTranslation.objects.create(review=review, language=lang, translated_text=translated)
        
def translate_missing_for_all_reviews():
    for review in Review.objects.all():
        translate_missing_translations_for_review(review)
        