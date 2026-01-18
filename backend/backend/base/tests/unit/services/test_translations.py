import pytest
from unittest.mock import patch, MagicMock
from base.services.translations import stream_translate_text


class TestStreamTranslateText:
    """Tests for stream_translate_text function"""

    @patch('base.services.translations.api_key', '')
    def test_yields_error_when_no_api_key(self):
        """Test yields error message when GEMINI_API_KEY not configured"""
        result = list(stream_translate_text('Hello', 'German'))

        assert len(result) == 1
        assert 'Error' in result[0]
        assert 'GEMINI_API_KEY not configured' in result[0]

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_calls_gemini_with_correct_prompt(self, mock_genai):
        """Test Gemini API is called with correct prompt"""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_chunk = MagicMock()
        mock_chunk.text = 'Hallo'
        mock_response.__iter__ = lambda self: iter([mock_chunk])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        list(stream_translate_text('Hello', 'German'))

        mock_genai.GenerativeModel.assert_called_once_with('gemini-pro')
        call_args = mock_model.generate_content.call_args

        # Check prompt contains text and target language
        prompt = call_args[0][0]
        assert 'Hello' in prompt
        assert 'German' in prompt
        assert 'Translate' in prompt

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_streams_translation_chunks(self, mock_genai):
        """Test yields translation chunks from API"""
        mock_model = MagicMock()

        # Create mock chunks
        chunk1 = MagicMock()
        chunk1.text = 'Hallo '
        chunk2 = MagicMock()
        chunk2.text = 'Welt'
        chunk3 = MagicMock()
        chunk3.text = '!'

        mock_response = MagicMock()
        mock_response.__iter__ = lambda self: iter([chunk1, chunk2, chunk3])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        result = list(stream_translate_text('Hello World!', 'German'))

        assert result == ['Hallo ', 'Welt', '!']

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_skips_empty_chunks(self, mock_genai):
        """Test skips chunks with empty text"""
        mock_model = MagicMock()

        chunk1 = MagicMock()
        chunk1.text = 'Hello'
        chunk2 = MagicMock()
        chunk2.text = ''  # Empty chunk
        chunk3 = MagicMock()
        chunk3.text = None  # None chunk
        chunk4 = MagicMock()
        chunk4.text = 'World'

        mock_response = MagicMock()
        mock_response.__iter__ = lambda self: iter([chunk1, chunk2, chunk3, chunk4])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        result = list(stream_translate_text('Test', 'German'))

        assert result == ['Hello', 'World']

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_handles_api_exception(self, mock_genai):
        """Test handles API exceptions gracefully"""
        mock_model = MagicMock()
        mock_model.generate_content.side_effect = Exception('API Error')
        mock_genai.GenerativeModel.return_value = mock_model

        result = list(stream_translate_text('Hello', 'German'))

        assert len(result) == 1
        assert 'Error' in result[0]
        assert 'API Error' in result[0]

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_uses_correct_temperature(self, mock_genai):
        """Test uses low temperature for consistent translations"""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.__iter__ = lambda self: iter([])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        list(stream_translate_text('Hello', 'German'))

        # Verify GenerationConfig was called with temperature=0.3
        mock_genai.types.GenerationConfig.assert_called_once_with(temperature=0.3)

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_enables_streaming(self, mock_genai):
        """Test streaming is enabled in API call"""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.__iter__ = lambda self: iter([])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        list(stream_translate_text('Hello', 'German'))

        call_args = mock_model.generate_content.call_args
        assert call_args[1]['stream'] is True

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_prompt_requests_only_translation(self, mock_genai):
        """Test prompt asks for only translation without extra text"""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.__iter__ = lambda self: iter([])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        list(stream_translate_text('Hello', 'German'))

        call_args = mock_model.generate_content.call_args
        prompt = call_args[0][0]

        assert 'ONLY the translation' in prompt
        assert 'without any additional text' in prompt

    @patch('base.services.translations.genai')
    @patch('base.services.translations.api_key', 'test_api_key')
    def test_handles_different_languages(self, mock_genai):
        """Test handles different target languages"""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.__iter__ = lambda self: iter([])
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        languages = ['German', 'Russian', 'Ukrainian', 'French', 'Spanish']

        for lang in languages:
            list(stream_translate_text('Hello', lang))

            call_args = mock_model.generate_content.call_args
            prompt = call_args[0][0]
            assert lang in prompt
