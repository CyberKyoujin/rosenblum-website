import pytest
from base.backends import EmailBackend
from base.models import CustomUser


@pytest.mark.django_db
class TestEmailBackend:
    """Tests for EmailBackend authentication"""

    @pytest.fixture
    def backend(self):
        """Create EmailBackend instance"""
        return EmailBackend()

    @pytest.fixture
    def user(self, db):
        """Create a test user"""
        return CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_authenticate_with_valid_credentials(self, backend, user):
        """Test authentication with valid email and password"""
        authenticated_user = backend.authenticate(
            request=None,
            username='test@example.com',
            password='testpass123'
        )

        assert authenticated_user is not None
        assert authenticated_user.email == 'test@example.com'
        assert authenticated_user.id == user.id

    def test_authenticate_with_invalid_password(self, backend, user):
        """Test authentication fails with wrong password"""
        authenticated_user = backend.authenticate(
            request=None,
            username='test@example.com',
            password='wrongpassword'
        )

        assert authenticated_user is None

    def test_authenticate_with_nonexistent_user(self, backend):
        """Test authentication fails for nonexistent user"""
        authenticated_user = backend.authenticate(
            request=None,
            username='nonexistent@example.com',
            password='somepassword'
        )

        assert authenticated_user is None

    def test_authenticate_case_insensitive_email(self, backend, user):
        """Test email matching is case-insensitive"""
        # Test uppercase
        authenticated_user = backend.authenticate(
            request=None,
            username='TEST@EXAMPLE.COM',
            password='testpass123'
        )
        assert authenticated_user is not None
        assert authenticated_user.id == user.id

        # Test mixed case
        authenticated_user = backend.authenticate(
            request=None,
            username='Test@Example.Com',
            password='testpass123'
        )
        assert authenticated_user is not None
        assert authenticated_user.id == user.id

    def test_authenticate_with_empty_username(self, backend, user):
        """Test authentication fails with empty username"""
        authenticated_user = backend.authenticate(
            request=None,
            username='',
            password='testpass123'
        )

        assert authenticated_user is None

    def test_authenticate_with_none_username(self, backend, user):
        """Test authentication fails with None username"""
        authenticated_user = backend.authenticate(
            request=None,
            username=None,
            password='testpass123'
        )

        assert authenticated_user is None

    def test_authenticate_with_empty_password(self, backend, user):
        """Test authentication fails with empty password"""
        authenticated_user = backend.authenticate(
            request=None,
            username='test@example.com',
            password=''
        )

        assert authenticated_user is None

    def test_authenticate_with_none_password(self, backend, user):
        """Test authentication fails with None password"""
        authenticated_user = backend.authenticate(
            request=None,
            username='test@example.com',
            password=None
        )

        assert authenticated_user is None

    def test_authenticate_multiple_users_same_domain(self, backend, db):
        """Test correctly identifies user among multiple users"""
        user1 = CustomUser.objects.create_user(
            email='user1@example.com',
            password='pass1',
            first_name='User1',
            last_name='Test'
        )
        user2 = CustomUser.objects.create_user(
            email='user2@example.com',
            password='pass2',
            first_name='User2',
            last_name='Test'
        )

        # Authenticate user1
        authenticated = backend.authenticate(
            request=None,
            username='user1@example.com',
            password='pass1'
        )
        assert authenticated.id == user1.id

        # Authenticate user2
        authenticated = backend.authenticate(
            request=None,
            username='user2@example.com',
            password='pass2'
        )
        assert authenticated.id == user2.id

        # Cross-password should fail
        authenticated = backend.authenticate(
            request=None,
            username='user1@example.com',
            password='pass2'
        )
        assert authenticated is None
