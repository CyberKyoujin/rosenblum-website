"""
Root conftest.py for Django pytest configuration
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
django.setup()


import pytest
from rest_framework.test import APIClient
from base.models import CustomUser, Order


@pytest.fixture
def api_client():
    """
    Provides a DRF API client for testing
    """
    return APIClient()


@pytest.fixture
def create_user(db):
    """
    Factory fixture for creating users
    Usage: user = create_user(email='test@test.com', password='pass123')
    """
    def _create_user(
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User',
        is_active=True,
        is_staff=False,
        is_superuser=False,
        **kwargs
    ):
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            **kwargs
        )
        user.is_active = is_active
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.save()
        return user

    return _create_user

@pytest.fixture
def create_order(db):
    """
    Factory fixture for creating order
    """
    def _create_order(
        user = None,
        name = "Test User",
        email= "test@example.com",
        phone_number="00000000",
        city="City",
        street="Test Street 123",
        zip="1234",
        message="Test Message",
        status="review",
        order_type="order",
        is_new=True,
    ):
        order = Order.objects.create(
            user=user,
            name=name,
            email=email,
            phone_number=phone_number,
            city=city,
            street=street,
            zip=zip,
            message=message,
            status=status,
            order_type=order_type,
            is_new=is_new,
        )
        return order
    return _create_order

@pytest.fixture
def authenticated_user(create_user):
    """
    Creates an authenticated active user
    """
    return create_user(
        email='auth@example.com',
        password='testpass123',
        is_active=True
    )


@pytest.fixture
def admin_user(create_user):
    """
    Creates an admin/staff user
    """
    return create_user(
        email='admin@example.com',
        password='adminpass123',
        is_active=True,
        is_staff=True,
        is_superuser=True
    )


@pytest.fixture
def authenticated_client(api_client, authenticated_user):
    """
    Provides an authenticated API client
    """
    api_client.force_authenticate(user=authenticated_user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """
    Provides an admin API client
    """
    api_client.force_authenticate(user=admin_user)
    return api_client
