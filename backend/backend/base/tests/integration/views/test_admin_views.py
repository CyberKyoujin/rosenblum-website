import pytest
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from rest_framework import status
from base.models import CustomUser, Message, Translation


@pytest.mark.django_db
class TestAdminLoginView:
    """Tests for AdminLoginView"""

    @pytest.fixture
    def admin_user(self, db):
        """Create an admin user"""
        user = CustomUser.objects.create_user(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.save()
        return user

    @pytest.fixture
    def regular_user(self, create_user):
        """Create a regular non-admin user"""
        user = create_user(email='regular@example.com', password='userpass123')
        user.is_active = True
        user.save()
        return user

    def test_admin_login_success(self, api_client, admin_user):
        """Test admin can login successfully"""
        response = api_client.post('/api/admin-user/login/', {
            'email': 'admin@example.com',
            'password': 'adminpass123'
        })

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_non_admin_login_forbidden(self, api_client, regular_user):
        """Test non-admin user gets 403"""
        response = api_client.post('/api/admin-user/login/', {
            'email': 'regular@example.com',
            'password': 'userpass123'
        })

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert 'admin' in response.data.get('details', '').lower()

    def test_invalid_credentials_unauthorized(self, api_client, admin_user):
        """Test invalid credentials return 401"""
        response = api_client.post('/api/admin-user/login/', {
            'email': 'admin@example.com',
            'password': 'wrongpassword'
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_nonexistent_user_unauthorized(self, api_client):
        """Test nonexistent user returns 401"""
        response = api_client.post('/api/admin-user/login/', {
            'email': 'nonexistent@example.com',
            'password': 'somepassword'
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_missing_credentials(self, api_client):
        """Test missing credentials return error"""
        response = api_client.post('/api/admin-user/login/', {})

        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED]


@pytest.mark.django_db
class TestGlobalMessagesView:
    """Tests for GlobalMessagesView"""

    @pytest.fixture
    def admin_client(self, api_client, db):
        """Create authenticated admin client"""
        admin = CustomUser.objects.create_user(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        admin.is_superuser = True
        admin.is_staff = True
        admin.is_active = True
        admin.save()

        response = api_client.post('/api/admin-user/login/', {
            'email': 'admin@example.com',
            'password': 'adminpass123'
        })
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        api_client.user = admin
        return api_client

    @pytest.fixture
    def setup_messages(self, db, create_user):
        """Create test messages between users"""
        admin = CustomUser.objects.get(email='admin@example.com')
        user1 = create_user(email='user1@example.com')
        user2 = create_user(email='user2@example.com')

        # Messages between admin and user1
        Message.objects.create(sender=user1, receiver=admin, message='Hello admin')
        Message.objects.create(sender=admin, receiver=user1, message='Hi user1')
        Message.objects.create(sender=user1, receiver=admin, message='Latest from user1')

        # Messages between admin and user2
        Message.objects.create(sender=user2, receiver=admin, message='Hello from user2')

        return {'admin': admin, 'user1': user1, 'user2': user2}

    def test_list_messages_requires_auth(self, api_client):
        """Test messages list requires authentication"""
        response = api_client.get('/api/admin-user/messages/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_messages_returns_latest_per_conversation(self, admin_client, setup_messages):
        """Test returns only latest message per conversation partner"""
        response = admin_client.get('/api/admin-user/messages/')

        assert response.status_code == status.HTTP_200_OK
        # Should return 2 conversations (one with user1, one with user2)
        messages = response.data if isinstance(response.data, list) else response.data.get('results', response.data)
        assert len(messages) == 2

    def test_messages_ordered_by_timestamp(self, admin_client, setup_messages):
        """Test messages are ordered by timestamp descending"""
        response = admin_client.get('/api/admin-user/messages/')

        assert response.status_code == status.HTTP_200_OK
        messages = response.data if isinstance(response.data, list) else response.data.get('results', response.data)

        if len(messages) > 1:
            # Check ordering (most recent first)
            for i in range(len(messages) - 1):
                assert messages[i]['timestamp'] >= messages[i + 1]['timestamp']

    def test_filter_by_viewed_status(self, admin_client, setup_messages):
        """Test filtering messages by viewed status"""
        response = admin_client.get('/api/admin-user/messages/', {'viewed': 'false'})

        assert response.status_code == status.HTTP_200_OK

    def test_search_messages(self, admin_client, setup_messages):
        """Test searching messages"""
        response = admin_client.get('/api/admin-user/messages/', {'search': 'user1'})

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestTranslationViewSet:
    """Tests for TranslationViewSet"""

    @pytest.fixture
    def admin_client(self, api_client, db):
        """Create authenticated admin client"""
        admin = CustomUser.objects.create_user(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        admin.is_superuser = True
        admin.is_staff = True
        admin.is_active = True
        admin.save()

        response = api_client.post('/api/admin-user/login/', {
            'email': 'admin@example.com',
            'password': 'adminpass123'
        })
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        return api_client

    @pytest.fixture
    def regular_client(self, api_client, create_user):
        """Create authenticated regular user client"""
        user = create_user(email='regular@example.com', password='userpass123')
        user.is_active = True
        user.save()

        response = api_client.post('/api/user/login/', {
            'email': 'regular@example.com',
            'password': 'userpass123'
        })
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        return api_client

    def test_list_translations_requires_admin(self, api_client):
        """Test translations list requires admin"""
        response = api_client.get('/api/admin-user/translations/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_regular_user_cannot_access_translations(self, regular_client):
        """Test regular user cannot access translations"""
        response = regular_client.get('/api/admin-user/translations/')

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_admin_can_list_translations(self, admin_client):
        """Test admin can list translations"""
        Translation.objects.create(
            name='Test Translation',
            initial_text='Hello',
            translated_text='Hallo'
        )

        response = admin_client.get('/api/admin-user/translations/')

        assert response.status_code == status.HTTP_200_OK

    def test_admin_can_create_translation(self, admin_client):
        """Test admin can create translation"""
        response = admin_client.post('/api/admin-user/translations/', {
            'name': 'New Translation',
            'initial_text': 'Good morning',
            'translated_text': 'Guten Morgen'
        })

        assert response.status_code == status.HTTP_201_CREATED
        assert Translation.objects.filter(name='New Translation').exists()

    def test_admin_can_retrieve_translation(self, admin_client):
        """Test admin can retrieve single translation"""
        translation = Translation.objects.create(
            name='Test',
            initial_text='Hello',
            translated_text='Hallo'
        )

        response = admin_client.get(f'/api/admin-user/translations/{translation.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Test'

    def test_admin_can_update_translation(self, admin_client):
        """Test admin can update translation"""
        translation = Translation.objects.create(
            name='Original',
            initial_text='Hello',
            translated_text='Hallo'
        )

        response = admin_client.patch(f'/api/admin-user/translations/{translation.id}/', {
            'name': 'Updated'
        })

        assert response.status_code == status.HTTP_200_OK
        translation.refresh_from_db()
        assert translation.name == 'Updated'

    def test_admin_can_delete_translation(self, admin_client):
        """Test admin can delete translation"""
        translation = Translation.objects.create(
            name='ToDelete',
            initial_text='Hello',
            translated_text='Hallo'
        )

        response = admin_client.delete(f'/api/admin-user/translations/{translation.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Translation.objects.filter(id=translation.id).exists()

    def test_search_translations(self, admin_client):
        """Test searching translations by name"""
        Translation.objects.create(name='Alpha', initial_text='A', translated_text='A')
        Translation.objects.create(name='Beta', initial_text='B', translated_text='B')

        response = admin_client.get('/api/admin-user/translations/', {'search': 'Alpha'})

        assert response.status_code == status.HTTP_200_OK

    def test_order_translations(self, admin_client):
        """Test ordering translations by timestamp"""
        Translation.objects.create(name='First', initial_text='A', translated_text='A')
        Translation.objects.create(name='Second', initial_text='B', translated_text='B')

        response = admin_client.get('/api/admin-user/translations/', {'ordering': '-timestamp'})

        assert response.status_code == status.HTTP_200_OK

    @patch('base.services.translations.stream_translate_text')
    def test_translate_endpoint_streams_response(self, mock_stream, admin_client):
        """Test translate endpoint returns streaming response"""
        mock_stream.return_value = iter(['Translated ', 'text'])

        response = admin_client.post('/api/admin-user/translations/translate/', {
            'text': 'Hello',
            'lan_to': 'German'
        })

        assert response.status_code == status.HTTP_200_OK
        assert response.get('Content-Type') == 'text/plain'

    def test_translate_endpoint_requires_text(self, admin_client):
        """Test translate endpoint requires text parameter"""
        response = admin_client.post('/api/admin-user/translations/translate/', {
            'lan_to': 'German'
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_translate_endpoint_requires_language(self, admin_client):
        """Test translate endpoint requires lan_to parameter"""
        response = admin_client.post('/api/admin-user/translations/translate/', {
            'text': 'Hello'
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
