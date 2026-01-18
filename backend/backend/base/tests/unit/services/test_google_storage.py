import pytest
from unittest.mock import patch, MagicMock
from datetime import timedelta
from base.services.google_storage import get_gcs_client, get_gcs_bucket, get_file_url


class TestGetGcsClient:
    """Tests for get_gcs_client function"""

    @patch('base.services.google_storage.storage.Client')
    @patch('base.services.google_storage.settings')
    def test_creates_client_with_credentials(self, mock_settings, mock_client_class):
        """Test creates storage client with correct credentials"""
        mock_credentials = MagicMock()
        mock_credentials.project_id = 'test-project'
        mock_settings.GS_CREDENTIALS = mock_credentials

        mock_client = MagicMock()
        mock_client_class.return_value = mock_client

        result = get_gcs_client()

        mock_client_class.assert_called_once_with(
            credentials=mock_credentials,
            project='test-project'
        )
        assert result == mock_client

    @patch('base.services.google_storage.storage.Client')
    @patch('base.services.google_storage.settings')
    def test_returns_client_instance(self, mock_settings, mock_client_class):
        """Test returns the created client instance"""
        mock_credentials = MagicMock()
        mock_credentials.project_id = 'my-project'
        mock_settings.GS_CREDENTIALS = mock_credentials

        mock_client = MagicMock()
        mock_client_class.return_value = mock_client

        result = get_gcs_client()

        assert result is mock_client


class TestGetGcsBucket:
    """Tests for get_gcs_bucket function"""

    @patch('base.services.google_storage.get_gcs_client')
    @patch('base.services.google_storage.settings')
    def test_gets_bucket_by_name(self, mock_settings, mock_get_client):
        """Test retrieves bucket by configured name"""
        mock_settings.GS_BUCKET_NAME = 'my-test-bucket'

        mock_client = MagicMock()
        mock_bucket = MagicMock()
        mock_client.bucket.return_value = mock_bucket
        mock_get_client.return_value = mock_client

        result = get_gcs_bucket()

        mock_client.bucket.assert_called_once_with('my-test-bucket')
        assert result == mock_bucket

    @patch('base.services.google_storage.get_gcs_client')
    @patch('base.services.google_storage.settings')
    def test_uses_settings_bucket_name(self, mock_settings, mock_get_client):
        """Test uses GS_BUCKET_NAME from settings"""
        mock_settings.GS_BUCKET_NAME = 'production-bucket'

        mock_client = MagicMock()
        mock_get_client.return_value = mock_client

        get_gcs_bucket()

        mock_client.bucket.assert_called_with('production-bucket')


class TestGetFileUrl:
    """Tests for get_file_url function"""

    @patch('base.services.google_storage.get_gcs_bucket')
    def test_generates_signed_url(self, mock_get_bucket):
        """Test generates signed URL for file"""
        mock_bucket = MagicMock()
        mock_blob = MagicMock()
        mock_blob.generate_signed_url.return_value = 'https://storage.googleapis.com/signed-url'
        mock_bucket.blob.return_value = mock_blob
        mock_get_bucket.return_value = mock_bucket

        result = get_file_url('path/to/file.pdf')

        mock_bucket.blob.assert_called_once_with('path/to/file.pdf')
        assert result == 'https://storage.googleapis.com/signed-url'

    @patch('base.services.google_storage.get_gcs_bucket')
    def test_signed_url_expires_in_one_hour(self, mock_get_bucket):
        """Test signed URL has 1 hour expiration"""
        mock_bucket = MagicMock()
        mock_blob = MagicMock()
        mock_bucket.blob.return_value = mock_blob
        mock_get_bucket.return_value = mock_bucket

        get_file_url('file.pdf')

        call_kwargs = mock_blob.generate_signed_url.call_args[1]
        assert call_kwargs['expiration'] == timedelta(hours=1)

    @patch('base.services.google_storage.get_gcs_bucket')
    def test_uses_v4_signing(self, mock_get_bucket):
        """Test uses v4 signature version"""
        mock_bucket = MagicMock()
        mock_blob = MagicMock()
        mock_bucket.blob.return_value = mock_blob
        mock_get_bucket.return_value = mock_bucket

        get_file_url('file.pdf')

        call_kwargs = mock_blob.generate_signed_url.call_args[1]
        assert call_kwargs['version'] == 'v4'

    @patch('base.services.google_storage.get_gcs_bucket')
    def test_uses_get_method(self, mock_get_bucket):
        """Test uses GET method for signed URL"""
        mock_bucket = MagicMock()
        mock_blob = MagicMock()
        mock_bucket.blob.return_value = mock_blob
        mock_get_bucket.return_value = mock_bucket

        get_file_url('file.pdf')

        call_kwargs = mock_blob.generate_signed_url.call_args[1]
        assert call_kwargs['method'] == 'GET'

    @patch('base.services.google_storage.get_gcs_bucket')
    def test_handles_nested_file_paths(self, mock_get_bucket):
        """Test handles nested file paths correctly"""
        mock_bucket = MagicMock()
        mock_blob = MagicMock()
        mock_blob.generate_signed_url.return_value = 'https://example.com/url'
        mock_bucket.blob.return_value = mock_blob
        mock_get_bucket.return_value = mock_bucket

        get_file_url('orders/12345/documents/contract.pdf')

        mock_bucket.blob.assert_called_once_with('orders/12345/documents/contract.pdf')

    @patch('base.services.google_storage.get_gcs_bucket')
    def test_handles_special_characters(self, mock_get_bucket):
        """Test handles file names with special characters"""
        mock_bucket = MagicMock()
        mock_blob = MagicMock()
        mock_blob.generate_signed_url.return_value = 'https://example.com/url'
        mock_bucket.blob.return_value = mock_blob
        mock_get_bucket.return_value = mock_bucket

        get_file_url('files/document (1).pdf')

        mock_bucket.blob.assert_called_once_with('files/document (1).pdf')
