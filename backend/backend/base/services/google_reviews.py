import requests
from datetime import datetime, timezone
from django.conf import settings
from base.models import Review
from .translation import translate_missing_translations_for_review

GOOGLE_PLACES_API_KEY = settings.GOOGLE_PLACES_API_KEY
GOOGLE_PLACE_ID = settings.GOOGLE_PLACE_ID

def fetch_google_reviews():
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    
    params = {
        "place_id": GOOGLE_PLACE_ID,
        "fields": "reviews",
        "key": GOOGLE_PLACES_API_KEY,
        "reviews_sort": "newest"
    }
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    reviews = data.get("result", {}).get("reviews", []) or []
    return reviews

def sync_google_reviews():
    
    google_reviews = fetch_google_reviews()

    for r in google_reviews:
        google_review_id = r.get("time") 
        if google_review_id is None:
            continue

        review_time = datetime.fromtimestamp(r["time"], tz=timezone.utc)

        review_obj, created = Review.objects.update_or_create(
            google_review_id=str(google_review_id),
            defaults={
                "place_id": GOOGLE_PLACE_ID,
                "author_name": r.get("author_name", "Anonymous"),
                "profile_photo_url": r.get("profile_photo_url"),
                "rating": r.get("rating", 0),
                "original_language": r.get("language", "en"),
                "original_text": r.get("text", ""),
                "review_timestamp": review_time,
            }
        )
        
        translate_missing_translations_for_review(review_obj)