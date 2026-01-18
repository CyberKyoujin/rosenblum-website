import pytest
from django.utils import timezone
from base.models import Message, File


@pytest.mark.django_db
class TestMessageModel:
    """Test cases for Message model"""

    def test_create_message_between_users(self, create_user):
        """Test creating a message between two users"""
        sender = create_user(email="sender@example.com")
        receiver = create_user(email="receiver@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Hello, this is a test message"
        )

        assert message.sender == sender
        assert message.receiver == receiver
        assert message.message == "Hello, this is a test message"
        assert message.viewed is False

    def test_default_viewed_false(self, create_user):
        """Test that default viewed value is False"""
        sender = create_user(email="sender2@example.com")
        receiver = create_user(email="receiver2@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Test message"
        )

        assert message.viewed is False

    def test_formatted_timestamp(self, create_user):
        """Test formatted_timestamp returns localized timestamp"""
        sender = create_user(email="sender3@example.com")
        receiver = create_user(email="receiver3@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Timestamp test"
        )

        formatted = message.formatted_timestamp()
        # Format is 'DD.MM.YYYY HH:MM'
        assert len(formatted) == 16
        assert formatted[2] == '.'
        assert formatted[5] == '.'
        assert formatted[10] == ' '
        assert formatted[13] == ':'

    def test_sender_receiver_relationships(self, create_user):
        """Test sender and receiver foreign key relationships"""
        user1 = create_user(email="user1@example.com")
        user2 = create_user(email="user2@example.com")

        message = Message.objects.create(
            sender=user1,
            receiver=user2,
            message="Relationship test"
        )

        # Check related_name 'sent_messages' for sender
        assert message in user1.sent_messages.all()

        # Check related_name 'received_messages' for receiver
        assert message in user2.received_messages.all()

    def test_cascade_delete_on_sender_deletion(self, create_user):
        """Test that deleting sender cascades to delete messages"""
        sender = create_user(email="sender4@example.com")
        receiver = create_user(email="receiver4@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Cascade sender test"
        )
        message_id = message.id

        # Delete sender
        sender.delete()

        # Verify message is deleted
        assert not Message.objects.filter(id=message_id).exists()

    def test_cascade_delete_on_receiver_deletion(self, create_user):
        """Test that deleting receiver cascades to delete messages"""
        sender = create_user(email="sender5@example.com")
        receiver = create_user(email="receiver5@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Cascade receiver test"
        )
        message_id = message.id

        # Delete receiver
        receiver.delete()

        # Verify message is deleted
        assert not Message.objects.filter(id=message_id).exists()

    def test_cascade_delete_files(self, create_user):
        """Test that deleting message cascades to delete associated files"""
        from unittest.mock import Mock
        from django.core.files.uploadedfile import SimpleUploadedFile

        sender = create_user(email="sender6@example.com")
        receiver = create_user(email="receiver6@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Files test"
        )

        # Create a simple uploaded file
        uploaded_file = SimpleUploadedFile(
            "attachment.pdf",
            b"file content",
            content_type="application/pdf"
        )

        # Create file associated with message
        file = File.objects.create(
            message=message,
            file=uploaded_file
        )
        file_id = file.id

        # Delete message
        message.delete()

        # Verify file is deleted
        assert not File.objects.filter(id=file_id).exists()

    def test_bidirectional_messaging(self, create_user):
        """Test that users can send messages to each other"""
        user1 = create_user(email="bidirectional1@example.com")
        user2 = create_user(email="bidirectional2@example.com")

        # User1 sends to User2
        message1 = Message.objects.create(
            sender=user1,
            receiver=user2,
            message="Message from user1 to user2"
        )

        # User2 sends to User1
        message2 = Message.objects.create(
            sender=user2,
            receiver=user1,
            message="Reply from user2 to user1"
        )

        # Verify user1 sent 1 and received 1
        assert user1.sent_messages.count() == 1
        assert user1.received_messages.count() == 1

        # Verify user2 sent 1 and received 1
        assert user2.sent_messages.count() == 1
        assert user2.received_messages.count() == 1

    def test_auto_timestamp_on_creation(self, create_user):
        """Test that timestamp is automatically set on creation"""
        sender = create_user(email="auto1@example.com")
        receiver = create_user(email="auto2@example.com")

        before_creation = timezone.now()
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Auto timestamp test"
        )
        after_creation = timezone.now()

        assert message.timestamp is not None
        assert before_creation <= message.timestamp <= after_creation

    def test_mark_message_as_viewed(self, create_user):
        """Test marking a message as viewed"""
        sender = create_user(email="viewed1@example.com")
        receiver = create_user(email="viewed2@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Viewed test"
        )

        assert message.viewed is False

        message.viewed = True
        message.save()

        assert message.viewed is True

    def test_message_with_empty_text(self, create_user):
        """Test creating message with empty text"""
        sender = create_user(email="empty1@example.com")
        receiver = create_user(email="empty2@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message=""
        )

        assert message.message == ""

    def test_message_with_null_text(self, create_user):
        """Test creating message with null text"""
        sender = create_user(email="null1@example.com")
        receiver = create_user(email="null2@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message=None
        )

        assert message.message is None

    def test_message_with_long_text(self, create_user):
        """Test creating message with long text (TextField has no limit)"""
        sender = create_user(email="long1@example.com")
        receiver = create_user(email="long2@example.com")

        long_text = "A" * 10000  # 10,000 characters
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message=long_text
        )

        assert len(message.message) == 10000
        assert message.message == long_text

    def test_multiple_messages_between_users(self, create_user):
        """Test creating multiple messages between same users"""
        sender = create_user(email="multi1@example.com")
        receiver = create_user(email="multi2@example.com")

        # Create 5 messages
        for i in range(5):
            Message.objects.create(
                sender=sender,
                receiver=receiver,
                message=f"Message number {i+1}"
            )

        assert sender.sent_messages.count() == 5
        assert receiver.received_messages.count() == 5

    def test_message_without_sender(self, create_user):
        """Test creating message without sender (system message)"""
        receiver = create_user(email="nosender@example.com")

        message = Message.objects.create(
            sender=None,
            receiver=receiver,
            message="System message"
        )

        assert message.sender is None
        assert message.receiver == receiver

    def test_message_without_receiver(self, create_user):
        """Test creating message without receiver (broadcast)"""
        sender = create_user(email="noreceiver@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=None,
            message="Broadcast message"
        )

        assert message.sender == sender
        assert message.receiver is None
