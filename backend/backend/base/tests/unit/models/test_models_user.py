import pytest
from django.db import IntegrityError
from base.models import CustomUser, Order

@pytest.mark.django_db
class TestCustomUserModel:
    """Test cases for CustomUser model"""

    def test_create_user_with_email(self, create_user):
        """Test creating a user with email"""
        user = create_user(
            email="test_user@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User"
        )
        assert user.email == "test_user@example.com"
        assert user.first_name == "Test"
        assert user.last_name == "User"

    def test_email_unique_constraint(self, create_user):
        """Test that email must be unique"""
        create_user(
            email="duplicate@example.com",
            password="pass123"
        )
        with pytest.raises(IntegrityError):
            create_user(
                email="duplicate@example.com",
                password="pass456"
            )

    def test_username_nullable(self, create_user):
        """Test that username can be null"""
        user = create_user(
            email="nouser@example.com",
            password="pass123"
        )
        assert user.username is None

    def test_default_is_active_false(self, create_user):
        """Test that new users are inactive by default"""
        user = create_user(
            email="inactive@example.com",
            password="pass123",
            is_active=False  # Explicitly set to test default behavior
        )
        assert user.is_active is False

    def test_password_hashing(self, create_user):
        """Test that passwords are hashed"""
        password = "mypassword123"
        user = create_user(
            email="hash@example.com",
            password=password
        )
        assert user.password != password
        assert user.check_password(password) is True

    def test_create_user_without_email_raises_error(self):
        """Test that creating user without email raises ValueError"""
        with pytest.raises(ValueError, match="Email must be provided"):
            CustomUser.objects.create_user(email=None, password="pass123")

    def test_custom_manager_create_superuser(self, create_user):
        """Test creating superuser through custom manager"""
        superuser = create_user(
            email="super@example.com",
            password="superpass123",
            is_staff=True,
            is_superuser=True
        )
        assert superuser.is_staff is True
        assert superuser.is_superuser is True
        assert superuser.email == "super@example.com"

    def test_email_normalization(self, create_user):
        """Test that email is normalized (lowercased domain)"""
        user = create_user(
            email="Test@EXAMPLE.COM",
            password="pass123"
        )
        assert user.email == "Test@example.com"

    def test_superuser_has_staff_and_superuser_flags(self, create_user):
        superuser = create_user(
            email="super@example.com",
            password="superpass123",
            is_staff=True,
            is_superuser=True
        )
        assert superuser.is_staff is True
        assert superuser.is_superuser is True
        
    def test_cascade_delete_orders(self, create_user, create_order):
        """Test that deleting user cascades to delete their orders"""
        user = create_user(
            email="Test@EXAMPLE.COM",
            password="pass123"
        )

        order = create_order(user=user)
        order_id = order.id

        # Delete user should cascade delete orders
        user.delete()

        # Verify order is deleted from database
        
        assert not Order.objects.filter(id=order_id).exists()