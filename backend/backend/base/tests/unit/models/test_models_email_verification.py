import pytest
from django.utils import timezone
from datetime import timedelta
from base.models import EmailVerification, CustomUser


@pytest.mark.django_db
class TestEmailVerificationModel:
    """Test cases for EmailVerification model"""

    def test_create_email_verification(self, create_user):
        """Test creating email verification for a user"""
        user = create_user(email="verify@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        assert verification.user == user
        assert verification.code == "123456"
        assert verification.used is False
        assert verification.attempts == 3

    def test_expiration_date_calculation(self, create_user):
        """Test that expiration_date is 15 minutes after creation"""
        user = create_user(email="expire@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        expected_expiration = verification.created_at + timedelta(minutes=15)
        assert verification.expiration_date == expected_expiration

    def test_is_expired_returns_true_after_15_minutes(self, create_user):
        """Test that is_expired returns True after 15 minutes"""
        user = create_user(email="expired@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        # Manually set created_at to 16 minutes ago
        verification.created_at = timezone.now() - timedelta(minutes=16)
        verification.save()
        assert verification.is_expired() is True

    def test_is_expired_returns_false_before_15_minutes(self, create_user):
        """Test that is_expired returns False before 15 minutes"""
        user = create_user(email="notexpired@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        assert verification.is_expired() is False

    def test_has_no_attempts_left_with_zero_attempts(self, create_user):
        """Test has_no_attempts_left returns True when attempts is 0"""
        user = create_user(email="noattempts@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456",
            attempts=0
        )
        assert verification.has_no_attempts_left() is True

    def test_has_no_attempts_left_with_positive_attempts(self, create_user):
        """Test has_no_attempts_left returns False when attempts > 0"""
        user = create_user(email="hasattempts@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456",
            attempts=2
        )
        assert verification.has_no_attempts_left() is False

    def test_default_attempts_is_3(self, create_user):
        """Test that default attempts value is 3"""
        user = create_user(email="default@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        assert verification.attempts == 3

    def test_default_used_is_false(self, create_user):
        """Test that default used value is False"""
        user = create_user(email="unused@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        assert verification.used is False

    def test_one_to_one_relationship_with_user(self, create_user):
        """Test that EmailVerification has one-to-one relationship with CustomUser"""
        user = create_user(email="onetoone@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )

        # Try to create another verification for same user
        with pytest.raises(Exception):  # Will raise IntegrityError
            EmailVerification.objects.create(
                user=user,
                code="654321"
            )

    def test_cascade_delete_on_user_deletion(self, create_user):
        """Test that deleting user cascades to delete email verification"""
        user = create_user(email="cascade@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        verification_id = verification.id

        # Delete user should cascade delete verification
        user.delete()

        # Verify verification is deleted
        assert not EmailVerification.objects.filter(id=verification_id).exists()

    def test_string_representation(self, create_user):
        """Test __str__ method"""
        user = create_user(email="string@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )
        expected = f"Email verification for {user.email}"
        assert str(verification) == expected

    def test_decrement_attempts(self, create_user):
        """Test decrementing attempts"""
        user = create_user(email="decrement@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456",
            attempts=3
        )

        verification.attempts -= 1
        verification.save()

        assert verification.attempts == 2

    def test_mark_as_used(self, create_user):
        """Test marking verification as used"""
        user = create_user(email="used@example.com")
        verification = EmailVerification.objects.create(
            user=user,
            code="123456"
        )

        verification.used = True
        verification.save()

        assert verification.used is True
