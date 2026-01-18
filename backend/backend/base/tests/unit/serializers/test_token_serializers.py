import pytest
from unittest.mock import patch, MagicMock
from rest_framework import exceptions
from base.serializers import UserTokenObtainPairSerializer, CustomTokenRefreshSerializer
from base.models import CustomUser


@pytest.mark.django_db
class TestUserTokenObtainPairSerializerValidation:
    """Tests for UserTokenObtainPairSerializer validation"""

    def test_valid_credentials_returns_tokens(self, create_user):
        """Test valid credentials return access and refresh tokens"""
        user = create_user(email='test@example.com', password='testpass123')
        user.is_active = True
        user.save()

        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        serializer = UserTokenObtainPairSerializer(data=data)
        result = serializer.validate(data)

        assert 'access' in result
        assert 'refresh' in result
        assert 'message' in result
        assert result['message'] == 'Login successful'

    def test_invalid_email_raises_error(self, create_user):
        """Test invalid email raises AuthenticationFailed"""
        create_user(email='test@example.com', password='testpass123')

        data = {
            'email': 'wrong@example.com',
            'password': 'testpass123'
        }
        serializer = UserTokenObtainPairSerializer(data=data)

        with pytest.raises(exceptions.AuthenticationFailed) as exc_info:
            serializer.validate(data)

        assert exc_info.value.detail['code'] == 'authentication_failed'

    def test_invalid_password_raises_error(self, create_user):
        """Test invalid password raises AuthenticationFailed"""
        create_user(email='test@example.com', password='testpass123')

        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        serializer = UserTokenObtainPairSerializer(data=data)

        with pytest.raises(exceptions.AuthenticationFailed) as exc_info:
            serializer.validate(data)

        assert exc_info.value.detail['code'] == 'authentication_failed'

    def test_inactive_user_raises_error(self, create_user):
        """Test inactive user raises AuthenticationFailed"""
        user = create_user(email='inactive@example.com', password='testpass123')
        user.is_active = False
        user.save()

        data = {
            'email': 'inactive@example.com',
            'password': 'testpass123'
        }
        serializer = UserTokenObtainPairSerializer(data=data)

        with pytest.raises(exceptions.AuthenticationFailed) as exc_info:
            serializer.validate(data)

        assert exc_info.value.detail['code'] == 'account_disabled'


@pytest.mark.django_db
class TestUserTokenObtainPairSerializerTokenClaims:
    """Tests for custom token claims in UserTokenObtainPairSerializer"""

    def test_token_contains_custom_claims(self, create_user):
        """Test generated token contains custom user claims"""
        user = create_user(
            email='claims@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )

        token = UserTokenObtainPairSerializer.get_token(user)

        assert token['id'] == user.id
        assert token['email'] == 'claims@example.com'
        assert token['first_name'] == 'John'
        assert token['last_name'] == 'Doe'

    def test_token_contains_profile_img_url(self, create_user):
        """Test token contains profile_img_url claim"""
        user = create_user(email='profile@example.com')
        user.profile_img_url = 'https://example.com/profile.jpg'
        user.save()

        token = UserTokenObtainPairSerializer.get_token(user)

        assert token['profile_img_url'] == 'https://example.com/profile.jpg'

    def test_token_profile_img_url_none(self, create_user):
        """Test token handles None profile_img_url"""
        user = create_user(email='noprofile@example.com')
        user.profile_img_url = None
        user.save()

        token = UserTokenObtainPairSerializer.get_token(user)

        assert token['profile_img_url'] is None


@pytest.mark.django_db
class TestCustomTokenRefreshSerializer:
    """Tests for CustomTokenRefreshSerializer"""

    def test_refresh_returns_new_access_token(self, create_user):
        """Test refresh token returns new access token with custom claims"""
        user = create_user(
            email='refresh@example.com',
            password='testpass123',
            first_name='Jane',
            last_name='Smith'
        )
        user.is_active = True
        user.save()

        # First get tokens via login
        login_data = {
            'email': 'refresh@example.com',
            'password': 'testpass123'
        }
        login_serializer = UserTokenObtainPairSerializer(data=login_data)
        tokens = login_serializer.validate(login_data)

        # Now refresh
        refresh_data = {'refresh': tokens['refresh']}
        refresh_serializer = CustomTokenRefreshSerializer(data=refresh_data)
        result = refresh_serializer.validate(refresh_data)

        assert 'access' in result
        # The new access token should be a valid JWT string
        assert isinstance(result['access'], str)
        assert len(result['access']) > 0
