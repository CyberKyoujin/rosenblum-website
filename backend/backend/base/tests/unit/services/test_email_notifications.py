import pytest
from unittest.mock import patch, MagicMock
from base.services.email_notifications import (
    send_simple_email,
    send_reset_link_email,
    send_message_account_created,
    send_new_message_email,
    send_order_ready_email,
    send_request_created,
    send_request_answered_email
)


class TestSendSimpleEmail:
    """Tests for send_simple_email function"""

    @patch('base.services.email_notifications.send_mail')
    @patch('base.services.email_notifications.settings')
    def test_sends_email_with_correct_parameters(self, mock_settings, mock_send_mail):
        """Test email is sent with correct parameters"""
        mock_settings.EMAIL_HOST_USER = 'sender@example.com'

        send_simple_email(
            subject='Test Subject',
            message='Test message content',
            recipient_email='recipient@example.com'
        )

        mock_send_mail.assert_called_once_with(
            subject='Test Subject',
            message='Test message content',
            from_email='sender@example.com',
            recipient_list=['recipient@example.com'],
            fail_silently=False
        )

    @patch('base.services.email_notifications.send_mail')
    @patch('base.services.email_notifications.settings')
    def test_uses_settings_email_host_user(self, mock_settings, mock_send_mail):
        """Test from_email comes from settings"""
        mock_settings.EMAIL_HOST_USER = 'custom@sender.com'

        send_simple_email('Subject', 'Message', 'to@example.com')

        call_kwargs = mock_send_mail.call_args[1]
        assert call_kwargs['from_email'] == 'custom@sender.com'


class TestSendResetLinkEmail:
    """Tests for send_reset_link_email function"""

    @patch('base.services.email_notifications.send_simple_email')
    def test_sends_reset_email_with_link(self, mock_send_simple):
        """Test password reset email contains reset link"""
        send_reset_link_email(
            receiver_email='user@example.com',
            receiver_first_name='John',
            receiver_last_name='Doe',
            reset_link='https://example.com/reset/abc123'
        )

        mock_send_simple.assert_called_once()
        call_args = mock_send_simple.call_args[0]

        assert call_args[0] == 'Passwort-Reset Link'  # subject
        assert 'John' in call_args[1]  # message contains name
        assert 'Doe' in call_args[1]
        assert 'https://example.com/reset/abc123' in call_args[1]  # contains link
        assert call_args[2] == 'user@example.com'  # recipient

    @patch('base.services.email_notifications.send_simple_email')
    def test_reset_email_is_in_german(self, mock_send_simple):
        """Test reset email is in German"""
        send_reset_link_email(
            receiver_email='user@example.com',
            receiver_first_name='Test',
            receiver_last_name='User',
            reset_link='https://example.com/reset/xyz'
        )

        call_args = mock_send_simple.call_args[0]
        message = call_args[1]

        assert 'Hallo' in message
        assert 'Rosenblum' in message


class TestSendMessageAccountCreated:
    """Tests for send_message_account_created function"""

    @patch('base.services.email_notifications.send_simple_email')
    def test_sends_welcome_email(self, mock_send_simple):
        """Test welcome email is sent"""
        send_message_account_created(
            receiver_email='newuser@example.com',
            receiver_first_name='Jane',
            receiver_last_name='Smith'
        )

        mock_send_simple.assert_called_once()
        call_args = mock_send_simple.call_args[0]

        assert 'Willkommen' in call_args[0]  # subject
        assert 'Jane' in call_args[1]  # message contains name
        assert 'Smith' in call_args[1]
        assert call_args[2] == 'newuser@example.com'

    @patch('base.services.email_notifications.send_simple_email')
    def test_welcome_email_mentions_registration(self, mock_send_simple):
        """Test welcome email mentions successful registration"""
        send_message_account_created(
            receiver_email='user@example.com',
            receiver_first_name='Test',
            receiver_last_name='User'
        )

        call_args = mock_send_simple.call_args[0]
        message = call_args[1]

        assert 'registriert' in message or 'Konto' in message


class TestSendNewMessageEmail:
    """Tests for send_new_message_email function"""

    @patch('base.services.email_notifications.send_simple_email')
    def test_sends_new_message_notification(self, mock_send_simple):
        """Test new message notification is sent"""
        send_new_message_email(receiver_email='user@example.com')

        mock_send_simple.assert_called_once()
        call_args = mock_send_simple.call_args[0]

        assert 'Nachricht' in call_args[0]  # subject contains "message" in German
        assert call_args[2] == 'user@example.com'

    @patch('base.services.email_notifications.send_simple_email')
    def test_new_message_email_contains_link(self, mock_send_simple):
        """Test new message email contains link to messages"""
        send_new_message_email(receiver_email='user@example.com')

        call_args = mock_send_simple.call_args[0]
        message = call_args[1]

        assert 'messages' in message or 'Nachricht' in message


class TestSendOrderReadyEmail:
    """Tests for send_order_ready_email function"""

    @patch('base.services.email_notifications.send_simple_email')
    def test_sends_order_ready_notification(self, mock_send_simple):
        """Test order ready notification is sent"""
        send_order_ready_email(
            user_email='customer@example.com',
            order_id=12345
        )

        mock_send_simple.assert_called_once()
        call_args = mock_send_simple.call_args[0]

        assert 'fertig' in call_args[0]  # subject contains "ready" in German
        assert '12345' in call_args[1]  # message contains order ID
        assert call_args[2] == 'customer@example.com'

    @patch('base.services.email_notifications.send_simple_email')
    def test_order_ready_email_contains_order_number(self, mock_send_simple):
        """Test order ready email mentions order number"""
        send_order_ready_email(
            user_email='customer@example.com',
            order_id=99999
        )

        call_args = mock_send_simple.call_args[0]
        message = call_args[1]

        assert '99999' in message


class TestSendRequestCreated:
    """Tests for send_request_created function"""

    @patch('base.services.email_notifications.send_simple_email')
    def test_sends_request_confirmation(self, mock_send_simple):
        """Test request creation confirmation is sent"""
        send_request_created(
            user_email='requester@example.com',
            request_id=100,
            requester_name='John Doe'
        )

        mock_send_simple.assert_called_once()
        call_args = mock_send_simple.call_args[0]

        assert 'Anfrage' in call_args[0]  # subject contains "request" in German
        assert '100' in call_args[1] or '#100' in call_args[1]  # message contains request ID
        assert 'John Doe' in call_args[1]  # message contains requester name
        assert call_args[2] == 'requester@example.com'

    @patch('base.services.email_notifications.send_simple_email')
    def test_request_created_email_confirms_receipt(self, mock_send_simple):
        """Test request created email confirms receipt"""
        send_request_created(
            user_email='user@example.com',
            request_id=1,
            requester_name='Test User'
        )

        call_args = mock_send_simple.call_args[0]
        message = call_args[1]

        assert 'eingegangen' in message or 'erfolgreich' in message


class TestSendRequestAnsweredEmail:
    """Tests for send_request_answered_email function"""

    @patch('base.services.email_notifications.send_simple_email')
    def test_sends_request_answer_notification(self, mock_send_simple):
        """Test request answer notification is sent"""
        send_request_answered_email(
            user_email='requester@example.com',
            request_id=200,
            answer_text='This is the answer to your request.',
            requester_name='Jane Smith'
        )

        mock_send_simple.assert_called_once()
        call_args = mock_send_simple.call_args[0]

        assert 'Antwort' in call_args[0]  # subject contains "answer" in German
        assert '200' in call_args[1] or '#200' in call_args[1]  # contains request ID
        assert 'This is the answer to your request.' in call_args[1]  # contains answer text
        assert 'Jane Smith' in call_args[1]  # contains requester name
        assert call_args[2] == 'requester@example.com'

    @patch('base.services.email_notifications.send_simple_email')
    def test_request_answer_includes_full_answer_text(self, mock_send_simple):
        """Test answer email includes the full answer text"""
        long_answer = 'This is a longer answer that explains everything in detail. ' * 5

        send_request_answered_email(
            user_email='user@example.com',
            request_id=1,
            answer_text=long_answer,
            requester_name='User'
        )

        call_args = mock_send_simple.call_args[0]
        message = call_args[1]

        assert long_answer in message
