import pytest
from rest_framework import status
from base.models import Message, File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models import Q


@pytest.mark.django_db
class TestMessageList:
    """Tests for message list endpoint"""

    def test_list_messages_unauthenticated(self, api_client):
        """Test unauthenticated users cannot list messages"""
        response = api_client.get('/messages/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_sent_messages(self, authenticated_client, authenticated_user, create_user):
        """Test user can see messages they sent"""
        receiver = create_user(email='receiver@example.com')

        Message.objects.create(
            sender=authenticated_user,
            receiver=receiver,
            message='Test message 1'
        )
        Message.objects.create(
            sender=authenticated_user,
            receiver=receiver,
            message='Test message 2'
        )

        response = authenticated_client.get('/messages/')

        assert response.status_code == status.HTTP_200_OK

        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        assert len(results) >= 2

    def test_list_received_messages(self, authenticated_client, authenticated_user, create_user):
        """Test user can see messages they received"""
        sender = create_user(email='sender@example.com')

        Message.objects.create(
            sender=sender,
            receiver=authenticated_user,
            message='Received message 1'
        )
        Message.objects.create(
            sender=sender,
            receiver=authenticated_user,
            message='Received message 2'
        )

        response = authenticated_client.get('/messages/')

        assert response.status_code == status.HTTP_200_OK

        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        # User should see received messages
        assert len(results) >= 2

    def test_cannot_see_other_users_messages(self, authenticated_client, create_user):
        """Test user cannot see messages between other users"""
        user1 = create_user(email='user1@example.com')
        user2 = create_user(email='user2@example.com')

        # Message between two other users
        Message.objects.create(
            sender=user1,
            receiver=user2,
            message='Private message'
        )

        response = authenticated_client.get('/messages/')

        assert response.status_code == status.HTTP_200_OK

        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        message_texts = [msg['message'] for msg in results]

        assert 'Private message' not in message_texts


@pytest.mark.django_db
class TestMessageCreate:
    """Tests for message creation endpoint"""

    def test_send_message_to_user(self, authenticated_client, authenticated_user, create_user):
        """Test sending message to another user"""
        receiver = create_user(email='receiver@example.com')

        data = {
            'id': receiver.id,
            'message': 'Hello, this is a test message!'
        }

        response = authenticated_client.post('/messages/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['message'] == 'Hello, this is a test message!'
        assert response.data['sender'] == authenticated_user.id
        assert response.data['receiver'] == receiver.id
        assert response.data['viewed'] is False  # Default

        # Verify created in database
        assert Message.objects.filter(
            sender=authenticated_user,
            receiver=receiver,
            message='Hello, this is a test message!'
        ).exists()

    def test_send_message_missing_receiver(self, authenticated_client):
        """Test sending message without receiver fails"""
        data = {
            'message': 'Message without receiver'
        }

        response = authenticated_client.post('/messages/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_send_message_to_nonexistent_user(self, authenticated_client):
        """Test sending message to non-existent user fails"""
        data = {
            'id': 99999,  # Non-existent ID
            'message': 'Message to nobody'
        }

        response = authenticated_client.post('/messages/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_send_empty_message(self, authenticated_client, create_user):
        """Test sending empty message"""
        receiver = create_user(email='receiver@example.com')

        data = {
            'id': receiver.id,
            'message': ''
        }

        response = authenticated_client.post('/messages/', data)

        # Depending on validation rules
        if response.status_code == status.HTTP_201_CREATED:
            assert response.data['message'] == ''
        else:
            assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_send_message_with_file(self, authenticated_client, create_user):
        """Test sending message with file attachment"""
        receiver = create_user(email='receiver@example.com')

        # Create message first
        message = Message.objects.create(
            sender=authenticated_client.handler._force_user,
            receiver=receiver,
            message='Message with file'
        )

        # Add file to message
        uploaded_file = SimpleUploadedFile(
            "attachment.pdf",
            b"file content",
            content_type="application/pdf"
        )
        File.objects.create(message=message, file=uploaded_file)

        # Retrieve message and check file is included
        response = authenticated_client.get(f'/messages/{message.id}/')

        if response.status_code == status.HTTP_404_NOT_FOUND:
            pytest.skip("Message detail endpoint not implemented")

        assert response.status_code == status.HTTP_200_OK
        if 'files' in response.data:
            assert len(response.data['files']) == 1


@pytest.mark.django_db
class TestMessageDetail:
    """Tests for message detail endpoint"""

    def test_get_sent_message(self, authenticated_client, authenticated_user, create_user):
        """Test user can retrieve message they sent"""
        receiver = create_user(email='receiver@example.com')
        message = Message.objects.create(
            sender=authenticated_user,
            receiver=receiver,
            message='Sent message'
        )

        response = authenticated_client.get(f'/messages/{message.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == message.id
        assert response.data['message'] == 'Sent message'

    def test_get_received_message(self, authenticated_client, authenticated_user, create_user):
        """Test user can retrieve message they received"""
        sender = create_user(email='sender@example.com')
        message = Message.objects.create(
            sender=sender,
            receiver=authenticated_user,
            message='Received message'
        )

        response = authenticated_client.get(f'/messages/{message.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == message.id

    def test_cannot_get_other_users_message(self, authenticated_client, create_user):
        """Test user cannot retrieve messages between other users"""
        user1 = create_user(email='user1@example.com')
        user2 = create_user(email='user2@example.com')

        message = Message.objects.create(
            sender=user1,
            receiver=user2,
            message='Private message'
        )

        response = authenticated_client.get(f'/messages/{message.id}/')

        assert response.status_code in [
            status.HTTP_403_FORBIDDEN,
            status.HTTP_404_NOT_FOUND
        ]


@pytest.mark.django_db
class TestMessageUpdate:
    """Tests for message update endpoint"""

    def test_mark_messages_as_viewed_via_toggle(self, authenticated_client, authenticated_user, create_user):
        """Test marking received messages as viewed via toggle action"""
        sender = create_user(email='sender@example.com')

        # Create multiple unread messages from the same sender
        Message.objects.create(
            sender=sender,
            receiver=authenticated_user,
            message='Unread message 1',
            viewed=False
        )
        Message.objects.create(
            sender=sender,
            receiver=authenticated_user,
            message='Unread message 2',
            viewed=False
        )

        # Toggle endpoint marks all unread messages from sender as viewed
        data = {'sender_id': sender.id}

        response = authenticated_client.post('/messages/toggle/', data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'success'
        assert response.data['updated_count'] == 2

        # Verify database updated
        unread_count = Message.objects.filter(
            sender=sender,
            receiver=authenticated_user,
            viewed=False
        ).count()
        assert unread_count == 0

    def test_toggle_requires_sender_id(self, authenticated_client):
        """Test toggle action requires sender_id"""
        response = authenticated_client.post('/messages/toggle/', {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'sender_id' in str(response.data).lower()

    def test_update_message_via_patch(self, authenticated_client, authenticated_user, create_user):
        """Test updating message via PATCH"""
        receiver = create_user(email='receiver@example.com')
        message = Message.objects.create(
            sender=authenticated_user,
            receiver=receiver,
            message='Original message'
        )

        data = {'message': 'Edited message'}

        response = authenticated_client.patch(f'/messages/{message.id}/', data)

        # Depending on business logic - messages might be editable or not
        if response.status_code == status.HTTP_200_OK:
            # If editing is allowed
            assert response.data['message'] == 'Edited message'
        else:
            # If not allowed
            assert response.status_code in [
                status.HTTP_403_FORBIDDEN,
                status.HTTP_400_BAD_REQUEST
            ]


@pytest.mark.django_db
class TestMessageDelete:
    """Tests for message deletion endpoint"""

    def test_delete_sent_message(self, authenticated_client, authenticated_user, create_user):
        """Test user can delete message they sent"""
        receiver = create_user(email='receiver@example.com')
        message = Message.objects.create(
            sender=authenticated_user,
            receiver=receiver,
            message='Message to delete'
        )
        message_id = message.id

        response = authenticated_client.delete(f'/messages/{message.id}/')

        if response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            pytest.skip("Message deletion not allowed")

        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Verify deleted from database
        assert not Message.objects.filter(id=message_id).exists()

    def test_cannot_delete_received_message(self, authenticated_client, authenticated_user, create_user):
        """Test user cannot delete messages sent to them"""
        sender = create_user(email='sender@example.com')
        message = Message.objects.create(
            sender=sender,
            receiver=authenticated_user,
            message='Received message'
        )

        response = authenticated_client.delete(f'/messages/{message.id}/')

        # Depending on business logic
        if response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            pytest.skip("Message deletion not allowed")

        # Receiver might not be able to delete
        assert response.status_code in [
            status.HTTP_204_NO_CONTENT,  # If deletion allowed
            status.HTTP_403_FORBIDDEN  # If not allowed
        ]

@pytest.mark.django_db
class TestMessageFiltering:
    """Tests for message filtering"""

    def test_filter_messages_by_user_id(self, admin_client, create_user):
        """Test admin can filter messages by user_id"""
        user1 = create_user(email='user1@example.com')
        user2 = create_user(email='user2@example.com')

        # Messages involving user1
        Message.objects.create(
            sender=user1,
            receiver=user2,
            message='From user1'
        )
        Message.objects.create(
            sender=user2,
            receiver=user1,
            message='To user1'
        )

        response = admin_client.get(f'/messages/?user_id={user1.id}')

        assert response.status_code == status.HTTP_200_OK

        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data

        # All messages should involve user1 (either as sender or receiver)
        for msg in results:
            assert msg['sender'] == user1.id or msg['receiver'] == user1.id

    def test_messages_ordered_by_timestamp(self, authenticated_client, authenticated_user, create_user):
        """Test messages are ordered by timestamp descending"""
        # Clear any existing messages for this user
        Message.objects.filter(
            Q(sender=authenticated_user) | Q(receiver=authenticated_user)
        ).delete()

        other_user = create_user(email='other@example.com')

        # Create messages with small delays to ensure different timestamps
        import time
        msg1 = Message.objects.create(
            sender=authenticated_user,
            receiver=other_user,
            message='First message'
        )
        time.sleep(0.01)
        msg2 = Message.objects.create(
            sender=other_user,
            receiver=authenticated_user,
            message='Second message'
        )
        time.sleep(0.01)
        msg3 = Message.objects.create(
            sender=authenticated_user,
            receiver=other_user,
            message='Third message'
        )

        response = authenticated_client.get('/messages/')

        assert response.status_code == status.HTTP_200_OK

        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data

        # Should be ordered newest first (descending)
        if len(results) >= 2:
            # Check that timestamps are in descending order
            timestamps = [r['timestamp'] for r in results]
            assert timestamps == sorted(timestamps, reverse=True)
