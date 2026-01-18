import pytest
from unittest.mock import patch, MagicMock
from base.serializers import CustomUserSerializer, UserDataSerializer
from base.models import CustomUser, Order


@pytest.mark.django_db
class TestCustomUserSerializerValidation:
    """Tests for CustomUserSerializer validation"""

    def test_valid_user_data(self):
        """Test serializer accepts valid user data"""
        data = {
            'email': 'test@example.com',
            'password': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        serializer = CustomUserSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_invalid_email_rejected(self):
        """Test serializer rejects invalid email"""
        data = {
            'email': 'not-an-email',
            'password': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        serializer = CustomUserSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_missing_email_rejected(self):
        """Test serializer rejects missing email"""
        data = {
            'password': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        serializer = CustomUserSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_duplicate_email_rejected(self, create_user):
        """Test serializer rejects duplicate email"""
        create_user(email='existing@example.com')

        data = {
            'email': 'existing@example.com',
            'password': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        serializer = CustomUserSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors


@pytest.mark.django_db
class TestCustomUserSerializerCreate:
    """Tests for CustomUserSerializer create method"""

    @patch('base.serializers.send_verification_code')
    def test_create_user_sends_verification_email(self, mock_send_verification):
        """Test create() sends verification email"""
        mock_send_verification.return_value = '123456'

        data = {
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        serializer = CustomUserSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        # Verify user created
        assert user.email == 'newuser@example.com'
        assert user.first_name == 'John'
        assert user.last_name == 'Doe'

        # Verify verification email was sent
        mock_send_verification.assert_called_once_with(
            'newuser@example.com', 'John', 'Doe'
        )

    @patch('base.serializers.send_verification_code')
    def test_create_user_creates_email_verification_record(self, mock_send_verification):
        """Test create() creates EmailVerification record"""
        from base.models import EmailVerification

        mock_send_verification.return_value = '654321'

        data = {
            'email': 'verify@example.com',
            'password': 'SecurePass123!',
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
        serializer = CustomUserSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        # Verify EmailVerification record created
        verification = EmailVerification.objects.get(user=user)
        assert verification.code == '654321'
        assert verification.used is False

    @patch('base.serializers.send_verification_code')
    def test_create_user_password_is_hashed(self, mock_send_verification):
        """Test create() hashes the password"""
        mock_send_verification.return_value = '123456'

        data = {
            'email': 'hash@example.com',
            'password': 'PlainPassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = CustomUserSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        # Password should be hashed, not plain text
        assert user.password != 'PlainPassword123!'
        assert user.check_password('PlainPassword123!')

    @patch('base.serializers.send_verification_code')
    def test_create_user_is_inactive_by_default(self, mock_send_verification):
        """Test created user is inactive by default"""
        mock_send_verification.return_value = '123456'

        data = {
            'email': 'inactive@example.com',
            'password': 'SecurePass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = CustomUserSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        # User should be inactive until email verified
        assert user.is_active is False


@pytest.mark.django_db
class TestCustomUserSerializerOutput:
    """Tests for CustomUserSerializer output fields"""

    def test_password_not_in_output(self, create_user):
        """Test password is excluded from serialized output"""
        user = create_user(email='test@example.com', password='secret123')
        serializer = CustomUserSerializer(user)

        assert 'password' not in serializer.data

    def test_orders_count_field(self, create_user, create_order):
        """Test orders count is included in output"""
        user = create_user(email='orders@example.com')
        create_order(user=user, name='Order 1')
        create_order(user=user, name='Order 2')
        create_order(user=user, name='Order 3')

        serializer = CustomUserSerializer(user)

        assert serializer.data['orders'] == 3

    def test_orders_count_zero_for_new_user(self, create_user):
        """Test orders count is 0 for user with no orders"""
        user = create_user(email='noorders@example.com')

        serializer = CustomUserSerializer(user)

        assert serializer.data['orders'] == 0

    def test_image_url_with_profile_image(self, create_user):
        """Test image_url field with profile image"""
        from django.core.files.uploadedfile import SimpleUploadedFile

        user = create_user(email='image@example.com')
        user.profile_img = SimpleUploadedFile(
            "test.jpg",
            b"file_content",
            content_type="image/jpeg"
        )
        user.save()

        serializer = CustomUserSerializer(user)

        # Should have image_url when profile_img exists
        assert serializer.data['image_url'] is not None

    def test_image_url_none_without_profile_image(self, create_user):
        """Test image_url is None when no profile image"""
        user = create_user(email='noimage@example.com')

        serializer = CustomUserSerializer(user)

        assert serializer.data['image_url'] is None


@pytest.mark.django_db
class TestCustomUserSerializerUpdate:
    """Tests for CustomUserSerializer update method"""

    def test_update_user_fields(self, create_user):
        """Test updating user fields"""
        user = create_user(
            email='update@example.com',
            first_name='Original',
            last_name='Name'
        )

        data = {
            'first_name': 'Updated',
            'last_name': 'User'
        }

        serializer = CustomUserSerializer(user, data=data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()

        assert updated_user.first_name == 'Updated'
        assert updated_user.last_name == 'User'

    def test_update_phone_number(self, create_user):
        """Test updating phone number"""
        user = create_user(email='phone@example.com')

        data = {'phone_number': '1234567890'}

        serializer = CustomUserSerializer(user, data=data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()

        assert updated_user.phone_number == '1234567890'


@pytest.mark.django_db
class TestUserDataSerializer:
    """Tests for UserDataSerializer"""

    def test_serializes_basic_fields(self, create_user):
        """Test UserDataSerializer includes expected fields"""
        user = create_user(
            email='data@example.com',
            first_name='John',
            last_name='Doe'
        )

        serializer = UserDataSerializer(user)

        assert serializer.data['email'] == 'data@example.com'
        assert serializer.data['first_name'] == 'John'
        assert serializer.data['last_name'] == 'Doe'
        assert 'id' in serializer.data

    def test_excludes_sensitive_fields(self, create_user):
        """Test UserDataSerializer excludes sensitive data"""
        user = create_user(email='sensitive@example.com', password='secret')

        serializer = UserDataSerializer(user)

        assert 'password' not in serializer.data
        assert 'is_superuser' not in serializer.data
