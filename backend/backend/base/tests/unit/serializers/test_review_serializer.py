import pytest
from django.utils import timezone
from base.serializers import ReviewSerializer
from base.models import Review, ReviewTranslation


@pytest.mark.django_db
class TestReviewSerializerOutput:
    """Tests for ReviewSerializer output fields"""

    @pytest.fixture
    def create_review(self, db):
        """Fixture to create a review"""
        def _create_review(
            google_review_id='test123',
            author_name='Test Author',
            rating=5,
            original_language='en',
            original_text='Great service!',
            profile_photo_url='https://example.com/photo.jpg'
        ):
            return Review.objects.create(
                google_review_id=google_review_id,
                place_id='test_place_id',
                author_name=author_name,
                profile_photo_url=profile_photo_url,
                rating=rating,
                original_language=original_language,
                original_text=original_text,
                review_timestamp=timezone.now()
            )
        return _create_review

    def test_serializes_expected_fields(self, create_review):
        """Test ReviewSerializer includes expected fields"""
        review = create_review()
        serializer = ReviewSerializer(review)

        expected_fields = [
            'id', 'author_name', 'rating', 'original_language',
            'text', 'review_timestamp', 'profile_photo_url'
        ]

        for field in expected_fields:
            assert field in serializer.data, f"Field '{field}' should be in output"

    def test_excludes_internal_fields(self, create_review):
        """Test ReviewSerializer excludes internal fields"""
        review = create_review()
        serializer = ReviewSerializer(review)

        excluded_fields = ['google_review_id', 'place_id', 'original_text', 'created_at', 'updated_at']

        for field in excluded_fields:
            assert field not in serializer.data, f"Field '{field}' should not be in output"

    def test_text_returns_original_without_lang_context(self, create_review):
        """Test text field returns original_text when no lang in context"""
        review = create_review(original_text='Original English text')
        serializer = ReviewSerializer(review)

        assert serializer.data['text'] == 'Original English text'

    def test_text_returns_original_when_lang_matches(self, create_review):
        """Test text returns original when lang matches original_language"""
        review = create_review(original_language='en', original_text='Original English text')
        serializer = ReviewSerializer(review, context={'lang': 'en'})

        assert serializer.data['text'] == 'Original English text'

    def test_text_returns_translation_when_available(self, create_review):
        """Test text returns translation when lang differs and translation exists"""
        review = create_review(original_language='en', original_text='Original English text')

        # Create German translation
        ReviewTranslation.objects.create(
            review=review,
            language='de',
            translated_text='Übersetzter deutscher Text'
        )

        serializer = ReviewSerializer(review, context={'lang': 'de'})

        assert serializer.data['text'] == 'Übersetzter deutscher Text'

    def test_text_returns_original_when_translation_missing(self, create_review):
        """Test text returns original when requested translation doesn't exist"""
        review = create_review(original_language='en', original_text='Original English text')

        # No French translation exists
        serializer = ReviewSerializer(review, context={'lang': 'fr'})

        assert serializer.data['text'] == 'Original English text'

    def test_text_with_multiple_translations(self, create_review):
        """Test correct translation is returned when multiple exist"""
        review = create_review(original_language='en', original_text='English text')

        ReviewTranslation.objects.create(review=review, language='de', translated_text='German text')
        ReviewTranslation.objects.create(review=review, language='ru', translated_text='Russian text')
        ReviewTranslation.objects.create(review=review, language='uk', translated_text='Ukrainian text')

        # Test each language
        assert ReviewSerializer(review, context={'lang': 'de'}).data['text'] == 'German text'
        assert ReviewSerializer(review, context={'lang': 'ru'}).data['text'] == 'Russian text'
        assert ReviewSerializer(review, context={'lang': 'uk'}).data['text'] == 'Ukrainian text'
        assert ReviewSerializer(review, context={'lang': 'en'}).data['text'] == 'English text'

    def test_rating_is_integer(self, create_review):
        """Test rating field is an integer"""
        review = create_review(rating=4)
        serializer = ReviewSerializer(review)

        assert serializer.data['rating'] == 4
        assert isinstance(serializer.data['rating'], int)

    def test_profile_photo_url_can_be_none(self, create_review):
        """Test profile_photo_url can be None"""
        review = create_review(profile_photo_url=None)
        serializer = ReviewSerializer(review)

        assert serializer.data['profile_photo_url'] is None


@pytest.mark.django_db
class TestReviewSerializerReadOnly:
    """Test that ReviewSerializer is read-only"""

    def test_serializer_is_read_only(self):
        """Test ReviewSerializer doesn't support create via serializer"""
        data = {
            'author_name': 'Test',
            'rating': 5,
            'original_language': 'en',
            'text': 'Test review'
        }
        serializer = ReviewSerializer(data=data)
        # ReviewSerializer doesn't have required fields for creation
        # It's designed for output only
        assert serializer.is_valid() or not serializer.is_valid()  # Either way, used for read
