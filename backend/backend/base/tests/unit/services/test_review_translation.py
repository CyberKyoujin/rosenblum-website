import pytest
from unittest.mock import patch, MagicMock
from django.utils import timezone
from base.services.review_translation import (
    translate_text,
    translate_missing_translations_for_review,
    translate_missing_for_all_reviews,
    normalize_target_lang,
    SUPPORTED_LANGS,
    DEEPL_LANG_MAP
)
from base.models import Review, ReviewTranslation


class TestNormalizeTargetLang:
    """Tests for normalize_target_lang function"""

    def test_normalizes_english(self):
        """Test normalizes 'en' to 'EN-GB'"""
        assert normalize_target_lang('en') == 'EN-GB'

    def test_normalizes_german(self):
        """Test normalizes 'de' to 'DE'"""
        assert normalize_target_lang('de') == 'DE'

    def test_normalizes_russian(self):
        """Test normalizes 'ru' to 'RU'"""
        assert normalize_target_lang('ru') == 'RU'

    def test_normalizes_ukrainian(self):
        """Test normalizes 'uk' to 'UK'"""
        assert normalize_target_lang('uk') == 'UK'

    def test_normalizes_uppercase_input(self):
        """Test handles uppercase input"""
        assert normalize_target_lang('EN') == 'EN-GB'
        assert normalize_target_lang('DE') == 'DE'

    def test_returns_uppercase_for_unknown_lang(self):
        """Test returns uppercase for unknown language codes"""
        assert normalize_target_lang('fr') == 'FR'
        assert normalize_target_lang('es') == 'ES'


class TestTranslateText:
    """Tests for translate_text function"""

    @patch('base.services.review_translation.settings')
    def test_returns_original_when_no_api_key(self, mock_settings):
        """Test returns original text when DEEPL_AUTH_KEY is empty"""
        mock_settings.DEEPL_AUTH_KEY = ''

        result = translate_text('Hello World', 'de')

        assert result == 'Hello World'

    @patch('base.services.review_translation.settings')
    def test_returns_original_when_api_key_none(self, mock_settings):
        """Test returns original text when DEEPL_AUTH_KEY is None"""
        mock_settings.DEEPL_AUTH_KEY = None

        result = translate_text('Hello World', 'de')

        assert result == 'Hello World'

    @patch('base.services.review_translation.settings')
    def test_returns_original_for_empty_text(self, mock_settings):
        """Test returns original text when text is empty"""
        mock_settings.DEEPL_AUTH_KEY = 'test_key'

        result = translate_text('', 'de')

        assert result == ''

    @patch('base.services.review_translation.settings')
    def test_returns_original_for_whitespace_text(self, mock_settings):
        """Test returns original text when text is only whitespace"""
        mock_settings.DEEPL_AUTH_KEY = 'test_key'

        result = translate_text('   ', 'de')

        assert result == '   '

    @patch('base.services.review_translation.deepl.Translator')
    @patch('base.services.review_translation.settings')
    def test_calls_deepl_with_correct_params(self, mock_settings, mock_translator_class):
        """Test DeepL API is called with correct parameters"""
        mock_settings.DEEPL_AUTH_KEY = 'test_api_key'

        mock_translator = MagicMock()
        mock_result = MagicMock()
        mock_result.text = 'Hallo Welt'
        mock_translator.translate_text.return_value = mock_result
        mock_translator_class.return_value = mock_translator

        result = translate_text('Hello World', 'de')

        mock_translator_class.assert_called_once_with('test_api_key')
        mock_translator.translate_text.assert_called_once_with(
            'Hello World',
            target_lang='DE'
        )
        assert result == 'Hallo Welt'

    @patch('base.services.review_translation.deepl.Translator')
    @patch('base.services.review_translation.settings')
    def test_translates_to_english(self, mock_settings, mock_translator_class):
        """Test translation to English uses EN-GB"""
        mock_settings.DEEPL_AUTH_KEY = 'test_api_key'

        mock_translator = MagicMock()
        mock_result = MagicMock()
        mock_result.text = 'Hello World'
        mock_translator.translate_text.return_value = mock_result
        mock_translator_class.return_value = mock_translator

        translate_text('Hallo Welt', 'en')

        mock_translator.translate_text.assert_called_once_with(
            'Hallo Welt',
            target_lang='EN-GB'
        )


@pytest.mark.django_db
class TestTranslateMissingTranslationsForReview:
    """Tests for translate_missing_translations_for_review function"""

    @pytest.fixture
    def review(self):
        """Create a test review"""
        return Review.objects.create(
            google_review_id='test123',
            place_id='place123',
            author_name='Test Author',
            rating=5,
            original_language='en',
            original_text='Great service!',
            review_timestamp=timezone.now()
        )

    @patch('base.services.review_translation.translate_text')
    def test_creates_translations_for_supported_langs(self, mock_translate, review):
        """Test creates translations for all supported languages"""
        mock_translate.return_value = 'Translated text'

        translate_missing_translations_for_review(review)

        # Should create translations for de, ru, uk (not en since it's the original)
        translations = ReviewTranslation.objects.filter(review=review)
        assert translations.count() == 3

        languages = set(t.language for t in translations)
        assert languages == {'de', 'ru', 'uk'}

    @patch('base.services.review_translation.translate_text')
    def test_skips_original_language(self, mock_translate, review):
        """Test does not create translation for original language"""
        mock_translate.return_value = 'Translated'

        translate_missing_translations_for_review(review)

        # Should not have English translation
        assert not ReviewTranslation.objects.filter(
            review=review,
            language='en'
        ).exists()

    @patch('base.services.review_translation.translate_text')
    def test_skips_existing_translations(self, mock_translate, review):
        """Test does not overwrite existing translations"""
        # Create existing German translation
        ReviewTranslation.objects.create(
            review=review,
            language='de',
            translated_text='Existing German translation'
        )

        mock_translate.return_value = 'New translation'

        translate_missing_translations_for_review(review)

        # German translation should remain unchanged
        german = ReviewTranslation.objects.get(review=review, language='de')
        assert german.translated_text == 'Existing German translation'

        # Only ru and uk should be created
        assert mock_translate.call_count == 2

    @patch('base.services.review_translation.translate_text')
    def test_stores_translated_text(self, mock_translate, review):
        """Test stores the translated text from API"""
        mock_translate.side_effect = [
            'German translation',
            'Russian translation',
            'Ukrainian translation'
        ]

        translate_missing_translations_for_review(review)

        de_trans = ReviewTranslation.objects.get(review=review, language='de')
        assert de_trans.translated_text == 'German translation'

    @patch('base.services.review_translation.translate_text')
    def test_calls_translate_with_original_text(self, mock_translate, review):
        """Test translate_text is called with original review text"""
        mock_translate.return_value = 'Translated'

        translate_missing_translations_for_review(review)

        for call in mock_translate.call_args_list:
            assert call[0][0] == 'Great service!'


@pytest.mark.django_db
class TestTranslateMissingForAllReviews:
    """Tests for translate_missing_for_all_reviews function"""

    @patch('base.services.review_translation.translate_missing_translations_for_review')
    def test_processes_all_reviews(self, mock_translate_review):
        """Test processes all Review objects"""
        # Create multiple reviews
        for i in range(5):
            Review.objects.create(
                google_review_id=f'review{i}',
                place_id='place123',
                author_name=f'Author {i}',
                rating=5,
                original_language='en',
                original_text=f'Review text {i}',
                review_timestamp=timezone.now()
            )

        translate_missing_for_all_reviews()

        assert mock_translate_review.call_count == 5

    @patch('base.services.review_translation.translate_missing_translations_for_review')
    def test_handles_empty_database(self, mock_translate_review):
        """Test handles case with no reviews"""
        translate_missing_for_all_reviews()

        mock_translate_review.assert_not_called()


class TestSupportedLangs:
    """Tests for supported languages configuration"""

    def test_supported_langs_contains_expected(self):
        """Test SUPPORTED_LANGS contains expected languages"""
        expected = ['en', 'de', 'ru', 'uk']

        for lang in expected:
            assert lang in SUPPORTED_LANGS

    def test_deepl_lang_map_has_all_supported(self):
        """Test DEEPL_LANG_MAP has mapping for all supported languages"""
        for lang in SUPPORTED_LANGS:
            assert lang in DEEPL_LANG_MAP
