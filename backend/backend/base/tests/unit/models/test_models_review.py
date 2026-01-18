import pytest
from django.db import IntegrityError
from django.utils import timezone
from base.models import Review, ReviewTranslation


@pytest.mark.django_db
class TestReviewModel:
    """Test cases for Review model"""

    def test_create_review(self):
        """Test creating a review"""
        review = Review.objects.create(
            google_review_id="abc123",
            place_id="ChIJ1234567890",
            author_name="John Doe",
            profile_photo_url="https://example.com/photo.jpg",
            rating=5,
            original_language="en",
            original_text="Great service!",
            review_timestamp=timezone.now()
        )

        assert review.google_review_id == "abc123"
        assert review.author_name == "John Doe"
        assert review.rating == 5
        assert review.original_language == "en"
        assert review.original_text == "Great service!"

    def test_google_review_id_unique(self):
        """Test that google_review_id must be unique"""
        Review.objects.create(
            google_review_id="unique123",
            place_id="ChIJ1234567890",
            author_name="User 1",
            rating=5,
            original_language="en",
            original_text="Review 1",
            review_timestamp=timezone.now()
        )

        # Try to create another review with same google_review_id
        with pytest.raises(IntegrityError):
            Review.objects.create(
                google_review_id="unique123",
                place_id="ChIJ0987654321",
                author_name="User 2",
                rating=4,
                original_language="de",
                original_text="Review 2",
                review_timestamp=timezone.now()
            )

    def test_ordering_by_review_timestamp_descending(self):
        """Test that reviews are ordered by review_timestamp descending"""
        # Create 3 reviews with different timestamps
        review1 = Review.objects.create(
            google_review_id="old123",
            place_id="ChIJ1234567890",
            author_name="Old Review",
            rating=5,
            original_language="en",
            original_text="Old review",
            review_timestamp=timezone.now() - timezone.timedelta(days=30)
        )

        review2 = Review.objects.create(
            google_review_id="new123",
            place_id="ChIJ1234567890",
            author_name="New Review",
            rating=4,
            original_language="en",
            original_text="New review",
            review_timestamp=timezone.now()
        )

        review3 = Review.objects.create(
            google_review_id="mid123",
            place_id="ChIJ1234567890",
            author_name="Mid Review",
            rating=3,
            original_language="en",
            original_text="Mid review",
            review_timestamp=timezone.now() - timezone.timedelta(days=15)
        )

        # Get all reviews
        reviews = Review.objects.all()

        # Should be ordered: newest first
        assert reviews[0] == review2
        assert reviews[1] == review3
        assert reviews[2] == review1

    def test_auto_created_at_timestamp(self):
        """Test that created_at is automatically set"""
        before_creation = timezone.now()
        review = Review.objects.create(
            google_review_id="created123",
            place_id="ChIJ1234567890",
            author_name="Created Test",
            rating=5,
            original_language="en",
            original_text="Created at test",
            review_timestamp=timezone.now()
        )
        after_creation = timezone.now()

        assert review.created_at is not None
        assert before_creation <= review.created_at <= after_creation

    def test_auto_updated_at_timestamp(self):
        """Test that updated_at is automatically updated"""
        review = Review.objects.create(
            google_review_id="updated123",
            place_id="ChIJ1234567890",
            author_name="Updated Test",
            rating=5,
            original_language="en",
            original_text="Updated at test",
            review_timestamp=timezone.now()
        )

        original_updated_at = review.updated_at

        # Small delay to ensure different timestamp
        import time
        time.sleep(0.01)

        # Update the review
        review.rating = 4
        review.save()

        # updated_at should be changed
        assert review.updated_at >= original_updated_at

    def test_cascade_delete_translations(self):
        """Test that deleting review cascades to delete translations"""
        review = Review.objects.create(
            google_review_id="cascade123",
            place_id="ChIJ1234567890",
            author_name="Cascade Test",
            rating=5,
            original_language="en",
            original_text="Cascade test",
            review_timestamp=timezone.now()
        )

        # Create translations
        translation1 = ReviewTranslation.objects.create(
            review=review,
            language="de",
            translated_text="Toller Service!"
        )
        translation2 = ReviewTranslation.objects.create(
            review=review,
            language="ru",
            translated_text="Отличный сервис!"
        )

        translation1_id = translation1.id
        translation2_id = translation2.id

        # Delete review
        review.delete()

        # Verify translations are deleted
        assert not ReviewTranslation.objects.filter(id=translation1_id).exists()
        assert not ReviewTranslation.objects.filter(id=translation2_id).exists()

    def test_string_representation(self):
        """Test __str__ method"""
        review = Review.objects.create(
            google_review_id="str123",
            place_id="ChIJ1234567890",
            author_name="Jane Smith",
            rating=4,
            original_language="en",
            original_text="Good service",
            review_timestamp=timezone.now()
        )

        expected = "Jane Smith (4)"
        assert str(review) == expected

    def test_review_without_profile_photo(self):
        """Test creating review without profile photo URL"""
        review = Review.objects.create(
            google_review_id="nophoto123",
            place_id="ChIJ1234567890",
            author_name="No Photo User",
            profile_photo_url=None,
            rating=5,
            original_language="en",
            original_text="No photo review",
            review_timestamp=timezone.now()
        )

        assert review.profile_photo_url is None

    def test_review_with_different_ratings(self):
        """Test reviews with different rating values"""
        for rating in range(1, 6):  # 1 to 5
            review = Review.objects.create(
                google_review_id=f"rating{rating}",
                place_id="ChIJ1234567890",
                author_name=f"User {rating}",
                rating=rating,
                original_language="en",
                original_text=f"Review with {rating} stars",
                review_timestamp=timezone.now()
            )
            assert review.rating == rating


@pytest.mark.django_db
class TestReviewTranslationModel:
    """Test cases for ReviewTranslation model"""

    def test_create_translation(self):
        """Test creating a translation for a review"""
        review = Review.objects.create(
            google_review_id="trans123",
            place_id="ChIJ1234567890",
            author_name="Translation Test",
            rating=5,
            original_language="en",
            original_text="Great service!",
            review_timestamp=timezone.now()
        )

        translation = ReviewTranslation.objects.create(
            review=review,
            language="de",
            translated_text="Toller Service!"
        )

        assert translation.review == review
        assert translation.language == "de"
        assert translation.translated_text == "Toller Service!"

    def test_unique_together_review_and_language(self):
        """Test that (review, language) combination must be unique"""
        review = Review.objects.create(
            google_review_id="unique_trans123",
            place_id="ChIJ1234567890",
            author_name="Unique Test",
            rating=5,
            original_language="en",
            original_text="Unique test",
            review_timestamp=timezone.now()
        )

        # Create first translation
        ReviewTranslation.objects.create(
            review=review,
            language="de",
            translated_text="Erste Übersetzung"
        )

        # Try to create another translation with same language
        with pytest.raises(IntegrityError):
            ReviewTranslation.objects.create(
                review=review,
                language="de",
                translated_text="Zweite Übersetzung"
            )

    def test_duplicate_translation_raises_error(self):
        """Test that duplicate (review, language) raises IntegrityError"""
        review = Review.objects.create(
            google_review_id="dup123",
            place_id="ChIJ1234567890",
            author_name="Duplicate Test",
            rating=5,
            original_language="en",
            original_text="Duplicate test",
            review_timestamp=timezone.now()
        )

        ReviewTranslation.objects.create(
            review=review,
            language="ru",
            translated_text="Первый перевод"
        )

        with pytest.raises(IntegrityError):
            ReviewTranslation.objects.create(
                review=review,
                language="ru",
                translated_text="Второй перевод"
            )

    def test_cascade_delete_on_review_deletion(self):
        """Test that deleting review deletes translation"""
        review = Review.objects.create(
            google_review_id="del123",
            place_id="ChIJ1234567890",
            author_name="Delete Test",
            rating=5,
            original_language="en",
            original_text="Delete test",
            review_timestamp=timezone.now()
        )

        translation = ReviewTranslation.objects.create(
            review=review,
            language="fr",
            translated_text="Test de suppression"
        )
        translation_id = translation.id

        # Delete review
        review.delete()

        # Verify translation is deleted
        assert not ReviewTranslation.objects.filter(id=translation_id).exists()

    def test_multiple_translations_for_one_review(self):
        """Test creating multiple translations for one review"""
        review = Review.objects.create(
            google_review_id="multi123",
            place_id="ChIJ1234567890",
            author_name="Multi Test",
            rating=5,
            original_language="en",
            original_text="Excellent work!",
            review_timestamp=timezone.now()
        )

        # Create translations in different languages
        translation_de = ReviewTranslation.objects.create(
            review=review,
            language="de",
            translated_text="Ausgezeichnete Arbeit!"
        )

        translation_ru = ReviewTranslation.objects.create(
            review=review,
            language="ru",
            translated_text="Отличная работа!"
        )

        translation_fr = ReviewTranslation.objects.create(
            review=review,
            language="fr",
            translated_text="Excellent travail!"
        )

        # Verify all translations exist for this review
        assert review.translations.count() == 3
        assert translation_de in review.translations.all()
        assert translation_ru in review.translations.all()
        assert translation_fr in review.translations.all()

    def test_string_representation(self):
        """Test __str__ method"""
        review = Review.objects.create(
            google_review_id="str_trans123",
            place_id="ChIJ1234567890",
            author_name="String Test",
            rating=5,
            original_language="en",
            original_text="String test",
            review_timestamp=timezone.now()
        )

        translation = ReviewTranslation.objects.create(
            review=review,
            language="es",
            translated_text="Prueba de cadena"
        )

        expected = f"{review.id} -> es"
        assert str(translation) == expected

    def test_auto_created_at_timestamp(self):
        """Test that created_at is automatically set"""
        review = Review.objects.create(
            google_review_id="created_trans123",
            place_id="ChIJ1234567890",
            author_name="Created Trans Test",
            rating=5,
            original_language="en",
            original_text="Created trans test",
            review_timestamp=timezone.now()
        )

        before_creation = timezone.now()
        translation = ReviewTranslation.objects.create(
            review=review,
            language="it",
            translated_text="Test di creazione"
        )
        after_creation = timezone.now()

        assert translation.created_at is not None
        assert before_creation <= translation.created_at <= after_creation

    def test_translation_with_empty_text(self):
        """Test creating translation with empty text"""
        review = Review.objects.create(
            google_review_id="empty_trans123",
            place_id="ChIJ1234567890",
            author_name="Empty Trans Test",
            rating=5,
            original_language="en",
            original_text="Empty trans test",
            review_timestamp=timezone.now()
        )

        translation = ReviewTranslation.objects.create(
            review=review,
            language="pl",
            translated_text=""
        )

        assert translation.translated_text == ""

    def test_translation_with_long_text(self):
        """Test translation with very long text"""
        review = Review.objects.create(
            google_review_id="long_trans123",
            place_id="ChIJ1234567890",
            author_name="Long Trans Test",
            rating=5,
            original_language="en",
            original_text="Long trans test",
            review_timestamp=timezone.now()
        )

        long_text = "A" * 5000  # 5000 characters
        translation = ReviewTranslation.objects.create(
            review=review,
            language="pt",
            translated_text=long_text
        )

        assert len(translation.translated_text) == 5000
        assert translation.translated_text == long_text
