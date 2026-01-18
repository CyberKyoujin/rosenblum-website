import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone as dt_timezone
from base.services.google_reviews import fetch_google_reviews, sync_google_reviews
from base.models import Review


class TestFetchGoogleReviews:
    """Tests for fetch_google_reviews function"""

    @patch('base.services.google_reviews.requests.get')
    @patch('base.services.google_reviews.GOOGLE_PLACES_API_KEY', 'test_api_key')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_fetches_reviews_from_api(self, mock_get):
        """Test Google Reviews API is called correctly"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'result': {
                'reviews': [
                    {
                        'author_name': 'John Doe',
                        'rating': 5,
                        'text': 'Great service!',
                        'time': 1704067200,
                        'language': 'en'
                    }
                ]
            }
        }
        mock_get.return_value = mock_response

        reviews = fetch_google_reviews()

        assert len(reviews) == 1
        assert reviews[0]['author_name'] == 'John Doe'
        assert reviews[0]['rating'] == 5

        # Verify API was called with correct parameters
        mock_get.assert_called_once()
        call_args = mock_get.call_args
        assert call_args[1]['params']['place_id'] == 'test_place_id'
        assert call_args[1]['params']['key'] == 'test_api_key'
        assert call_args[1]['params']['fields'] == 'reviews'

    @patch('base.services.google_reviews.requests.get')
    @patch('base.services.google_reviews.GOOGLE_PLACES_API_KEY', 'test_api_key')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_returns_empty_list_when_no_reviews(self, mock_get):
        """Test returns empty list when no reviews in response"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'result': {}
        }
        mock_get.return_value = mock_response

        reviews = fetch_google_reviews()

        assert reviews == []

    @patch('base.services.google_reviews.requests.get')
    @patch('base.services.google_reviews.GOOGLE_PLACES_API_KEY', 'test_api_key')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_returns_empty_list_when_reviews_is_none(self, mock_get):
        """Test returns empty list when reviews is None"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'result': {
                'reviews': None
            }
        }
        mock_get.return_value = mock_response

        reviews = fetch_google_reviews()

        assert reviews == []

    @patch('base.services.google_reviews.requests.get')
    @patch('base.services.google_reviews.GOOGLE_PLACES_API_KEY', 'test_api_key')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_returns_multiple_reviews(self, mock_get):
        """Test returns multiple reviews when available"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'result': {
                'reviews': [
                    {'author_name': 'User 1', 'rating': 5, 'text': 'Great!', 'time': 1704067200},
                    {'author_name': 'User 2', 'rating': 4, 'text': 'Good', 'time': 1704153600},
                    {'author_name': 'User 3', 'rating': 3, 'text': 'OK', 'time': 1704240000},
                ]
            }
        }
        mock_get.return_value = mock_response

        reviews = fetch_google_reviews()

        assert len(reviews) == 3

    @patch('base.services.google_reviews.requests.get')
    @patch('base.services.google_reviews.GOOGLE_PLACES_API_KEY', 'test_api_key')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_raises_on_api_error(self, mock_get):
        """Test raises exception on API error"""
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.raise_for_status.side_effect = Exception("API Error")
        mock_get.return_value = mock_response

        with pytest.raises(Exception):
            fetch_google_reviews()


@pytest.mark.django_db
class TestSyncGoogleReviews:
    """Tests for sync_google_reviews function"""

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_creates_new_reviews(self, mock_fetch, mock_translate):
        """Test creates new Review objects from API data"""
        mock_fetch.return_value = [
            {
                'author_name': 'John Doe',
                'rating': 5,
                'text': 'Excellent service!',
                'time': 1704067200,
                'language': 'en',
                'profile_photo_url': 'https://example.com/photo.jpg'
            }
        ]

        sync_google_reviews()

        assert Review.objects.count() == 1
        review = Review.objects.first()
        assert review.author_name == 'John Doe'
        assert review.rating == 5
        assert review.original_text == 'Excellent service!'
        assert review.original_language == 'en'
        assert review.google_review_id == '1704067200'

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_updates_existing_reviews(self, mock_fetch, mock_translate):
        """Test updates existing Review objects"""
        # Create existing review
        Review.objects.create(
            google_review_id='1704067200',
            place_id='test_place_id',
            author_name='Old Name',
            rating=3,
            original_text='Old text',
            original_language='en',
            review_timestamp=datetime.fromtimestamp(1704067200, tz=dt_timezone.utc)
        )

        mock_fetch.return_value = [
            {
                'author_name': 'Updated Name',
                'rating': 5,
                'text': 'Updated text',
                'time': 1704067200,
                'language': 'en'
            }
        ]

        sync_google_reviews()

        assert Review.objects.count() == 1
        review = Review.objects.first()
        assert review.author_name == 'Updated Name'
        assert review.rating == 5
        assert review.original_text == 'Updated text'

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_calls_translation_service(self, mock_fetch, mock_translate):
        """Test translation service is called for each review"""
        mock_fetch.return_value = [
            {'author_name': 'User 1', 'rating': 5, 'text': 'Text 1', 'time': 1704067200, 'language': 'en'},
            {'author_name': 'User 2', 'rating': 4, 'text': 'Text 2', 'time': 1704153600, 'language': 'de'},
        ]

        sync_google_reviews()

        assert mock_translate.call_count == 2

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_skips_reviews_without_time(self, mock_fetch, mock_translate):
        """Test skips reviews without time field"""
        mock_fetch.return_value = [
            {'author_name': 'User 1', 'rating': 5, 'text': 'Text 1', 'time': None},  # No time
            {'author_name': 'User 2', 'rating': 4, 'text': 'Text 2'},  # Missing time key
            {'author_name': 'User 3', 'rating': 3, 'text': 'Text 3', 'time': 1704067200, 'language': 'en'},  # Valid
        ]

        sync_google_reviews()

        # Only the valid review should be created
        assert Review.objects.count() == 1
        assert Review.objects.first().author_name == 'User 3'

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_handles_anonymous_author(self, mock_fetch, mock_translate):
        """Test handles missing author_name with default"""
        mock_fetch.return_value = [
            {'rating': 5, 'text': 'Anonymous review', 'time': 1704067200, 'language': 'en'}
        ]

        sync_google_reviews()

        review = Review.objects.first()
        assert review.author_name == 'Anonymous'

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_handles_missing_rating(self, mock_fetch, mock_translate):
        """Test handles missing rating with default 0"""
        mock_fetch.return_value = [
            {'author_name': 'User', 'text': 'No rating', 'time': 1704067200, 'language': 'en'}
        ]

        sync_google_reviews()

        review = Review.objects.first()
        assert review.rating == 0

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_handles_empty_text(self, mock_fetch, mock_translate):
        """Test handles empty review text"""
        mock_fetch.return_value = [
            {'author_name': 'User', 'rating': 5, 'time': 1704067200, 'language': 'en'}
        ]

        sync_google_reviews()

        review = Review.objects.first()
        assert review.original_text == ''

    @patch('base.services.google_reviews.translate_missing_translations_for_review')
    @patch('base.services.google_reviews.fetch_google_reviews')
    @patch('base.services.google_reviews.GOOGLE_PLACE_ID', 'test_place_id')
    def test_correct_timestamp_conversion(self, mock_fetch, mock_translate):
        """Test Unix timestamp is correctly converted to datetime"""
        # 1704067200 = Monday, January 1, 2024 12:00:00 AM UTC
        mock_fetch.return_value = [
            {'author_name': 'User', 'rating': 5, 'text': 'Test', 'time': 1704067200, 'language': 'en'}
        ]

        sync_google_reviews()

        review = Review.objects.first()
        assert review.review_timestamp.year == 2024
        assert review.review_timestamp.month == 1
        assert review.review_timestamp.day == 1
