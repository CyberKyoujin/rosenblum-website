import pytest
from unittest.mock import patch, MagicMock
from datetime import timedelta
from django.utils import timezone
from base.services.email_verification import (
    generate_verification_code,
    send_verification_code,
    verify_email,
    VerificationResult
)
from base.models import CustomUser, EmailVerification


class TestGenerateVerificationCode:
    """Tests for generate_verification_code function"""

    def test_generates_6_digit_code_by_default(self):
        """Test default code is 6 digits"""
        code = generate_verification_code()

        assert len(code) == 6
        assert code.isdigit()

    def test_generates_custom_length_code(self):
        """Test custom length code generation"""
        code = generate_verification_code(length=8)

        assert len(code) == 8
        assert code.isdigit()

    def test_generates_unique_codes(self):
        """Test codes are random (not always the same)"""
        codes = [generate_verification_code() for _ in range(10)]
        unique_codes = set(codes)

        # With 6 digits, getting 10 identical codes is extremely unlikely
        assert len(unique_codes) > 1

    def test_code_contains_only_digits(self):
        """Test code contains only numeric characters"""
        for _ in range(100):
            code = generate_verification_code()
            assert code.isdigit(), f"Code '{code}' contains non-digit characters"


class TestSendVerificationCode:
    """Tests for send_verification_code function"""

    @patch('base.services.email_verification.send_simple_email')
    @patch('base.services.email_verification.generate_verification_code')
    def test_sends_email_with_code(self, mock_generate, mock_send_email):
        """Test verification email is sent with generated code"""
        mock_generate.return_value = '123456'

        result = send_verification_code(
            receiver_email='user@example.com',
            receiver_first_name='John',
            receiver_last_name='Doe'
        )

        assert result == '123456'
        mock_send_email.assert_called_once()

        call_args = mock_send_email.call_args
        assert call_args[0][0] == 'Ihr Verifizierungscode'  # subject
        assert '123456' in call_args[0][1]  # message contains code
        assert 'user@example.com' == call_args[0][2]  # recipient

    @patch('base.services.email_verification.send_simple_email')
    @patch('base.services.email_verification.generate_verification_code')
    def test_email_contains_user_name(self, mock_generate, mock_send_email):
        """Test email message contains user's name"""
        mock_generate.return_value = '654321'

        send_verification_code(
            receiver_email='user@example.com',
            receiver_first_name='Jane',
            receiver_last_name='Smith'
        )

        call_args = mock_send_email.call_args
        message = call_args[0][1]

        assert 'Jane' in message
        assert 'Smith' in message

    @patch('base.services.email_verification.send_simple_email')
    def test_returns_generated_code(self, mock_send_email):
        """Test function returns the generated code"""
        code = send_verification_code(
            receiver_email='user@example.com',
            receiver_first_name='Test',
            receiver_last_name='User'
        )

        assert len(code) == 6
        assert code.isdigit()


@pytest.mark.django_db
class TestVerifyEmail:
    """Tests for verify_email function"""

    @pytest.fixture
    def user_with_verification(self, create_user):
        """Create a user with an active verification code"""
        user = create_user(email='verify@example.com')
        verification = EmailVerification.objects.create(
            user=user,
            code='123456',
            used=False
        )
        return user, verification

    def test_successful_verification(self, user_with_verification):
        """Test successful email verification"""
        user, verification = user_with_verification

        result = verify_email('verify@example.com', '123456')

        assert result.ok is True
        assert result.error is None

        # User should be activated
        user.refresh_from_db()
        assert user.is_active is True

        # Verification should be marked as used
        verification.refresh_from_db()
        assert verification.used is True

    def test_user_not_found_error(self):
        """Test error when user doesn't exist"""
        result = verify_email('nonexistent@example.com', '123456')

        assert result.ok is False
        assert result.error == 'user_not_found'

    def test_no_active_verification_error(self, create_user):
        """Test error when no active verification exists"""
        user = create_user(email='nocode@example.com')
        # No EmailVerification created

        result = verify_email('nocode@example.com', '123456')

        assert result.ok is False
        assert result.error == 'no_active_verification'

    def test_already_used_verification_error(self, create_user):
        """Test error when verification already used"""
        user = create_user(email='used@example.com')
        EmailVerification.objects.create(
            user=user,
            code='123456',
            used=True  # Already used
        )

        result = verify_email('used@example.com', '123456')

        assert result.ok is False
        assert result.error == 'no_active_verification'

    def test_expired_verification_error(self, create_user):
        """Test error when verification is expired"""
        user = create_user(email='expired@example.com')
        verification = EmailVerification.objects.create(
            user=user,
            code='123456',
            used=False
        )
        # Manually set created_at to past (more than 15 minutes ago)
        EmailVerification.objects.filter(pk=verification.pk).update(
            created_at=timezone.now() - timedelta(minutes=20)
        )

        result = verify_email('expired@example.com', '123456')

        assert result.ok is False
        assert result.error == 'verification_code_expired'

    def test_invalid_code_decrements_attempts(self, user_with_verification):
        """Test invalid code decrements attempts"""
        user, verification = user_with_verification
        initial_attempts = verification.attempts

        result = verify_email('verify@example.com', 'wrong1')

        assert result.ok is False
        assert result.error == 'invalid_verification_code'
        assert result.attempts == initial_attempts - 1

        verification.refresh_from_db()
        assert verification.attempts == initial_attempts - 1

    def test_no_attempts_left_error(self, create_user):
        """Test error when no attempts remaining"""
        user = create_user(email='noattempts@example.com')
        EmailVerification.objects.create(
            user=user,
            code='123456',
            used=False,
            attempts=0  # No attempts left
        )

        result = verify_email('noattempts@example.com', '123456')

        assert result.ok is False
        assert result.error == 'no_verification_attempts'

    def test_multiple_wrong_attempts_exhaust_limit(self, create_user):
        """Test multiple wrong attempts exhaust the limit"""
        user = create_user(email='exhaust@example.com')
        EmailVerification.objects.create(
            user=user,
            code='123456',
            used=False,
            attempts=3
        )

        # First wrong attempt
        result1 = verify_email('exhaust@example.com', 'wrong1')
        assert result1.attempts == 2

        # Second wrong attempt
        result2 = verify_email('exhaust@example.com', 'wrong2')
        assert result2.attempts == 1

        # Third wrong attempt
        result3 = verify_email('exhaust@example.com', 'wrong3')
        assert result3.attempts == 0

        # Fourth attempt - should fail due to no attempts
        result4 = verify_email('exhaust@example.com', '123456')
        assert result4.error == 'no_verification_attempts'


@pytest.mark.django_db
class TestVerificationResultDataclass:
    """Tests for VerificationResult dataclass"""

    def test_success_result(self):
        """Test successful result structure"""
        result = VerificationResult(ok=True)

        assert result.ok is True
        assert result.error is None
        assert result.attempts is None

    def test_error_result(self):
        """Test error result structure"""
        result = VerificationResult(ok=False, error='some_error')

        assert result.ok is False
        assert result.error == 'some_error'

    def test_error_with_attempts(self):
        """Test error result with attempts"""
        result = VerificationResult(ok=False, error='invalid_code', attempts=2)

        assert result.ok is False
        assert result.error == 'invalid_code'
        assert result.attempts == 2
