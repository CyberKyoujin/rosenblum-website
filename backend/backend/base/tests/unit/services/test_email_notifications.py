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

PATCH_TARGET = 'base.services.email_notifications._send_html_email'


class TestSendSimpleEmail:
    """Tests for send_simple_email function"""

    @patch(PATCH_TARGET)
    def test_sends_email_with_correct_parameters(self, mock_send):
        """Test email is sent with correct parameters"""
        send_simple_email(
            subject='Test Subject',
            message='Test message content',
            recipient_email='recipient@example.com'
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs
        assert kwargs['subject'] == 'Test Subject'
        assert kwargs['plain_text'] == 'Test message content'
        assert kwargs['recipient_email'] == 'recipient@example.com'

    @patch(PATCH_TARGET)
    def test_message_is_in_body_lines(self, mock_send):
        """Test message text is passed in context body_lines"""
        send_simple_email('Subject', 'My message', 'to@example.com')

        kwargs = mock_send.call_args.kwargs
        assert 'My message' in kwargs['context']['body_lines']


class TestSendResetLinkEmail:
    """Tests for send_reset_link_email function"""

    @patch(PATCH_TARGET)
    def test_sends_reset_email_with_link(self, mock_send):
        """Test password reset email contains reset link"""
        send_reset_link_email(
            receiver_email='user@example.com',
            receiver_first_name='John',
            receiver_last_name='Doe',
            reset_link='https://example.com/reset/abc123'
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs

        assert kwargs['subject'] == 'Passwort-Reset Link'
        assert 'John' in kwargs['plain_text']
        assert 'Doe' in kwargs['plain_text']
        assert 'https://example.com/reset/abc123' in kwargs['plain_text']
        assert kwargs['recipient_email'] == 'user@example.com'

    @patch(PATCH_TARGET)
    def test_reset_email_has_button_url(self, mock_send):
        """Test reset email has CTA button with reset link"""
        send_reset_link_email(
            receiver_email='user@example.com',
            receiver_first_name='Test',
            receiver_last_name='User',
            reset_link='https://example.com/reset/xyz'
        )

        kwargs = mock_send.call_args.kwargs
        assert kwargs['context']['button_url'] == 'https://example.com/reset/xyz'
        assert 'Hallo' in kwargs['plain_text']
        assert 'Rosenblum' in kwargs['plain_text']


class TestSendMessageAccountCreated:
    """Tests for send_message_account_created function"""

    @patch(PATCH_TARGET)
    def test_sends_welcome_email(self, mock_send):
        """Test welcome email is sent"""
        send_message_account_created(
            receiver_email='newuser@example.com',
            receiver_first_name='Jane',
            receiver_last_name='Smith'
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs

        assert 'Willkommen' in kwargs['subject']
        assert 'Jane' in kwargs['plain_text']
        assert 'Smith' in kwargs['plain_text']
        assert kwargs['recipient_email'] == 'newuser@example.com'

    @patch(PATCH_TARGET)
    def test_welcome_email_mentions_registration(self, mock_send):
        """Test welcome email mentions successful registration"""
        send_message_account_created(
            receiver_email='user@example.com',
            receiver_first_name='Test',
            receiver_last_name='User'
        )

        kwargs = mock_send.call_args.kwargs
        assert 'registriert' in kwargs['plain_text'] or 'Konto' in kwargs['plain_text']


class TestSendNewMessageEmail:
    """Tests for send_new_message_email function"""

    @patch(PATCH_TARGET)
    def test_sends_new_message_notification(self, mock_send):
        """Test new message notification is sent"""
        send_new_message_email(receiver_email='user@example.com')

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs

        assert 'Nachricht' in kwargs['subject']
        assert kwargs['recipient_email'] == 'user@example.com'

    @patch(PATCH_TARGET)
    def test_new_message_email_mentions_nachricht(self, mock_send):
        """Test new message email mentions message"""
        send_new_message_email(receiver_email='user@example.com')

        kwargs = mock_send.call_args.kwargs
        assert 'Nachricht' in kwargs['plain_text']


class TestSendOrderReadyEmail:
    """Tests for send_order_ready_email function"""

    @patch(PATCH_TARGET)
    def test_sends_order_ready_notification(self, mock_send):
        """Test order ready notification is sent"""
        send_order_ready_email(
            user_email='customer@example.com',
            order_id=12345
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs

        assert 'fertig' in kwargs['subject']
        assert '12345' in kwargs['plain_text']
        assert kwargs['recipient_email'] == 'customer@example.com'

    @patch(PATCH_TARGET)
    def test_order_ready_email_contains_order_number(self, mock_send):
        """Test order ready email mentions order number"""
        send_order_ready_email(
            user_email='customer@example.com',
            order_id=99999
        )

        kwargs = mock_send.call_args.kwargs
        assert '99999' in kwargs['plain_text']


class TestSendRequestCreated:
    """Tests for send_request_created function"""

    @patch(PATCH_TARGET)
    def test_sends_request_confirmation(self, mock_send):
        """Test request creation confirmation is sent"""
        send_request_created(
            user_email='requester@example.com',
            request_id=100,
            requester_name='John Doe'
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs

        assert 'Anfrage' in kwargs['subject']
        assert '100' in kwargs['plain_text'] or '#100' in kwargs['plain_text']
        assert 'John Doe' in kwargs['plain_text']
        assert kwargs['recipient_email'] == 'requester@example.com'

    @patch(PATCH_TARGET)
    def test_request_created_email_confirms_receipt(self, mock_send):
        """Test request created email confirms receipt"""
        send_request_created(
            user_email='user@example.com',
            request_id=1,
            requester_name='Test User'
        )

        kwargs = mock_send.call_args.kwargs
        assert 'eingegangen' in kwargs['plain_text'] or 'erfolgreich' in kwargs['plain_text']


class TestSendRequestAnsweredEmail:
    """Tests for send_request_answered_email function"""

    @patch(PATCH_TARGET)
    def test_sends_request_answer_notification(self, mock_send):
        """Test request answer notification is sent"""
        send_request_answered_email(
            user_email='requester@example.com',
            request_id=200,
            answer_text='This is the answer to your request.',
            requester_name='Jane Smith'
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs

        assert 'Antwort' in kwargs['subject']
        assert '200' in kwargs['plain_text'] or '#200' in kwargs['plain_text']
        assert 'This is the answer to your request.' in kwargs['plain_text']
        assert 'Jane Smith' in kwargs['plain_text']
        assert kwargs['recipient_email'] == 'requester@example.com'

    @patch(PATCH_TARGET)
    def test_request_answer_includes_full_answer_text(self, mock_send):
        """Test answer email includes the full answer text"""
        long_answer = 'This is a longer answer that explains everything in detail. ' * 5

        send_request_answered_email(
            user_email='user@example.com',
            request_id=1,
            answer_text=long_answer,
            requester_name='User'
        )

        kwargs = mock_send.call_args.kwargs
        assert long_answer in kwargs['plain_text']
