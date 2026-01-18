import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIRequestFactory
from base.serializers import MessageSerializer
from base.models import Message, File


@pytest.mark.django_db
class TestMessageSerializerValidation:
    """Tests for MessageSerializer validation"""

    def test_valid_message_data(self, create_user):
        """Test serializer accepts valid message data"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        data = {
            'sender': sender.id,
            'receiver': receiver.id,
            'message': 'Hello, this is a test message!'
        }
        serializer = MessageSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_empty_message_allowed(self, create_user):
        """Test serializer accepts empty message (based on model: blank=True, null=True)"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        data = {
            'sender': sender.id,
            'receiver': receiver.id,
            'message': ''
        }
        serializer = MessageSerializer(data=data)
        # Empty message is allowed per model definition
        assert serializer.is_valid(), serializer.errors

    def test_sender_not_required_for_create(self, create_user):
        """Test sender field is not required (extra_kwargs)"""
        receiver = create_user(email='receiver@example.com')

        data = {
            'receiver': receiver.id,
            'message': 'Message without sender in data'
        }
        serializer = MessageSerializer(data=data)
        # sender is not required per serializer definition
        assert serializer.is_valid(), serializer.errors


@pytest.mark.django_db
class TestMessageSerializerCreate:
    """Tests for MessageSerializer create method"""

    def test_create_message(self, create_user):
        """Test creating message via serializer"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        data = {
            'sender': sender.id,
            'receiver': receiver.id,
            'message': 'Test message content'
        }
        serializer = MessageSerializer(data=data)
        assert serializer.is_valid()

        message = serializer.save()

        assert message.sender == sender
        assert message.receiver == receiver
        assert message.message == 'Test message content'
        assert message.viewed is False  # Default

    def test_create_message_with_uploaded_files(self, create_user):
        """Test creating message with file attachments"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        file1 = SimpleUploadedFile("doc.pdf", b"content", content_type="application/pdf")

        data = {
            'sender': sender.id,
            'receiver': receiver.id,
            'message': 'Message with attachment',
            'uploaded_files': [file1]
        }
        serializer = MessageSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        message = serializer.save()

        assert message.files.count() == 1

    def test_create_message_default_viewed_false(self, create_user):
        """Test message is created with viewed=False by default"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        data = {
            'sender': sender.id,
            'receiver': receiver.id,
            'message': 'Unread message'
        }
        serializer = MessageSerializer(data=data)
        assert serializer.is_valid()

        message = serializer.save()

        assert message.viewed is False


@pytest.mark.django_db
class TestMessageSerializerOutput:
    """Tests for MessageSerializer output fields"""

    def test_formatted_timestamp_field(self, create_user):
        """Test formatted_timestamp returns correct format"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        serializer = MessageSerializer(message)

        # Should be in format DD.MM.YYYY HH:MM
        formatted = serializer.data['formatted_timestamp']
        assert formatted is not None
        assert '.' in formatted
        assert ':' in formatted

    def test_files_included_in_output(self, create_user):
        """Test files are included in serialized output"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Message with file'
        )

        uploaded_file = SimpleUploadedFile("attachment.pdf", b"content", content_type="application/pdf")
        File.objects.create(message=message, file=uploaded_file)

        serializer = MessageSerializer(message)

        assert 'files' in serializer.data
        assert len(serializer.data['files']) == 1

    def test_sender_data_included(self, create_user):
        """Test sender_data is included in output"""
        sender = create_user(email='sender@example.com', first_name='Sender', last_name='User')
        receiver = create_user(email='receiver@example.com')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        serializer = MessageSerializer(message)

        assert 'sender_data' in serializer.data
        assert serializer.data['sender_data']['email'] == 'sender@example.com'

    def test_receiver_data_included(self, create_user):
        """Test receiver_data is included in output"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com', first_name='Receiver', last_name='User')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        serializer = MessageSerializer(message)

        assert 'receiver_data' in serializer.data
        assert serializer.data['receiver_data']['email'] == 'receiver@example.com'

    def test_uploaded_files_not_in_output(self, create_user):
        """Test uploaded_files (write_only) is not in output"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        serializer = MessageSerializer(message)

        assert 'uploaded_files' not in serializer.data


@pytest.mark.django_db
class TestMessageSerializerPartnerData:
    """Tests for partner_data field based on request context"""

    def test_partner_data_returns_receiver_for_sender(self, create_user):
        """Test partner_data returns receiver when current user is sender"""
        sender = create_user(email='sender@example.com', first_name='Sender')
        receiver = create_user(email='receiver@example.com', first_name='Receiver')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        # Create mock request with sender as current user
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = sender

        serializer = MessageSerializer(message, context={'request': request})

        assert serializer.data['partner_data']['email'] == 'receiver@example.com'

    def test_partner_data_returns_sender_for_receiver(self, create_user):
        """Test partner_data returns sender when current user is receiver"""
        sender = create_user(email='sender@example.com', first_name='Sender')
        receiver = create_user(email='receiver@example.com', first_name='Receiver')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        # Create mock request with receiver as current user
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = receiver

        serializer = MessageSerializer(message, context={'request': request})

        assert serializer.data['partner_data']['email'] == 'sender@example.com'

    def test_partner_data_none_without_request(self, create_user):
        """Test partner_data is None when no request in context"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Test message'
        )

        serializer = MessageSerializer(message)

        assert serializer.data['partner_data'] is None
