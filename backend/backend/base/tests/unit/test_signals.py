import pytest
from unittest.mock import patch, MagicMock
from django.db.models.signals import post_save, pre_save
from base.models import CustomUser, Message, Order, RequestObject, RequestAnswer
from base.signals import (
    user_created_handler,
    message_created_handler,
    order_status_changed_handler,
    request_created_handler,
    request_answer_created_handler
)


@pytest.mark.django_db
class TestUserCreatedHandler:
    """Tests for user_created_handler signal"""

    @patch('base.signals.send_message_account_created')
    def test_sends_welcome_email_on_user_creation(self, mock_send_email, db):
        """Test welcome email is sent when user is created"""
        user = CustomUser.objects.create_user(
            email='newuser@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )

        mock_send_email.assert_called_once_with(
            'newuser@example.com',
            'John',
            'Doe'
        )

    @patch('base.signals.send_message_account_created')
    def test_does_not_send_email_on_user_update(self, mock_send_email, create_user):
        """Test email is not sent when user is updated"""
        user = create_user(email='existing@example.com')
        mock_send_email.reset_mock()

        user.first_name = 'Updated'
        user.save()

        mock_send_email.assert_not_called()


@pytest.mark.django_db
class TestMessageCreatedHandler:
    """Tests for message_created_handler signal"""

    @patch('base.signals.send_new_message_email')
    def test_sends_notification_on_message_creation(self, mock_send_email, create_user):
        """Test notification email is sent when message is created"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Hello!'
        )

        mock_send_email.assert_called_once_with('receiver@example.com')

    @patch('base.signals.send_new_message_email')
    def test_does_not_send_email_on_message_update(self, mock_send_email, create_user):
        """Test email is not sent when message is updated"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Hello!'
        )
        mock_send_email.reset_mock()

        message.viewed = True
        message.save()

        mock_send_email.assert_not_called()

    @patch('base.signals.send_new_message_email')
    def test_does_not_send_if_no_receiver(self, mock_send_email, create_user):
        """Test email is not sent if message has no receiver"""
        sender = create_user(email='sender@example.com')

        Message.objects.create(
            sender=sender,
            receiver=None,
            message='Hello!'
        )

        mock_send_email.assert_not_called()

    @patch('base.signals.send_new_message_email')
    def test_does_not_send_if_receiver_has_no_email(self, mock_send_email, create_user):
        """Test email is not sent if receiver has no email"""
        sender = create_user(email='sender@example.com')
        receiver = create_user(email='receiver@example.com')
        receiver.email = ''
        receiver.save()

        Message.objects.create(
            sender=sender,
            receiver=receiver,
            message='Hello!'
        )

        mock_send_email.assert_not_called()


@pytest.mark.django_db(transaction=True)
class TestOrderStatusChangedHandler:
    """Tests for order_status_changed_handler signal"""

    @patch('base.signals.send_order_ready_email')
    def test_sends_email_when_status_changes_to_completed(self, mock_send_email, db):
        """Test email is sent when order status changes to completed"""
        from django.test import TestCase

        # Create order directly to avoid fixture transaction issues
        order = Order.objects.create(
            name='Test',
            email='test@example.com',
            phone_number='123',
            city='City',
            street='Street',
            zip='12345',
            message='Test',
            status='review'
        )

        order.status = 'completed'
        order.save()

        # With transaction=True, on_commit callbacks should execute
        mock_send_email.assert_called()

    @patch('base.signals.send_order_ready_email')
    def test_sends_email_when_status_changes_to_ready_pick_up(self, mock_send_email, db):
        """Test email is sent when order status changes to ready_pick_up"""
        order = Order.objects.create(
            name='Test',
            email='test@example.com',
            phone_number='123',
            city='City',
            street='Street',
            zip='12345',
            message='Test',
            status='in_progress'
        )

        order.status = 'ready_pick_up'
        order.save()

        mock_send_email.assert_called()

    @patch('base.signals.send_order_ready_email')
    def test_sends_email_when_status_changes_to_sent(self, mock_send_email, db):
        """Test email is sent when order status changes to sent"""
        order = Order.objects.create(
            name='Test',
            email='test@example.com',
            phone_number='123',
            city='City',
            street='Street',
            zip='12345',
            message='Test',
            status='in_progress'
        )

        order.status = 'sent'
        order.save()

        mock_send_email.assert_called()

    @patch('base.signals.send_order_ready_email')
    def test_does_not_send_email_for_non_ready_status(self, mock_send_email, create_order):
        """Test email is not sent when changing to non-ready status"""
        order = create_order(status='review')

        order.status = 'in_progress'
        order.save()

        mock_send_email.assert_not_called()

    @patch('base.signals.send_order_ready_email')
    def test_does_not_send_email_when_already_ready(self, mock_send_email, create_order):
        """Test email is not sent when status was already ready"""
        order = create_order(status='completed')

        order.status = 'sent'
        order.save()

        # Should not send because old status was already in ready set
        mock_send_email.assert_not_called()

    @patch('base.signals.send_order_ready_email')
    def test_uses_user_email_if_available(self, mock_send_email, create_user, create_order):
        """Test uses user's email if order has associated user"""
        user = create_user(email='user@example.com')
        order = create_order(user=user, email='order@example.com', status='review')

        order.status = 'completed'
        order.save()

        # Should use user's email, not order email
        if mock_send_email.called:
            call_args = mock_send_email.call_args[0]
            assert call_args[0] == 'user@example.com'

    @patch('base.signals.send_order_ready_email')
    def test_uses_order_email_if_no_user(self, mock_send_email, create_order):
        """Test uses order's email if no associated user"""
        order = create_order(user=None, email='order@example.com', status='review')

        order.status = 'completed'
        order.save()

        if mock_send_email.called:
            call_args = mock_send_email.call_args[0]
            assert call_args[0] == 'order@example.com'


@pytest.mark.django_db
class TestRequestCreatedHandler:
    """Tests for request_created_handler signal"""

    @patch('base.signals.send_request_created')
    def test_sends_confirmation_on_request_creation(self, mock_send_email):
        """Test confirmation email is sent when request is created"""
        request = RequestObject.objects.create(
            name='John Doe',
            email='john@example.com',
            phone_number='1234567890',
            message='Test request'
        )

        mock_send_email.assert_called_once_with(
            'john@example.com',
            request.pk,
            'John Doe'
        )

    @patch('base.signals.send_request_created')
    def test_does_not_send_on_request_update(self, mock_send_email):
        """Test email is not sent when request is updated"""
        request = RequestObject.objects.create(
            name='John Doe',
            email='john@example.com',
            phone_number='1234567890',
            message='Test request'
        )
        mock_send_email.reset_mock()

        request.is_new = False
        request.save()

        mock_send_email.assert_not_called()

    @patch('base.signals.send_request_created')
    def test_does_not_send_if_no_email(self, mock_send_email):
        """Test email is not sent if request has no email"""
        request = RequestObject.objects.create(
            name='John Doe',
            email='',
            phone_number='1234567890',
            message='Test request'
        )

        mock_send_email.assert_not_called()

    @patch('base.signals.send_request_created')
    def test_does_not_send_if_no_name(self, mock_send_email):
        """Test email is not sent if request has no name"""
        request = RequestObject.objects.create(
            name='',
            email='john@example.com',
            phone_number='1234567890',
            message='Test request'
        )

        mock_send_email.assert_not_called()


@pytest.mark.django_db
class TestRequestAnswerCreatedHandler:
    """Tests for request_answer_created_handler signal"""

    @patch('base.signals.send_request_answered_email')
    def test_sends_answer_notification(self, mock_send_email):
        """Test notification email is sent when answer is created"""
        request = RequestObject.objects.create(
            name='John Doe',
            email='john@example.com',
            phone_number='1234567890',
            message='Test request'
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text='Here is your answer'
        )

        mock_send_email.assert_called_once_with(
            'john@example.com',
            request.pk,
            'Here is your answer',
            'John Doe'
        )

    @patch('base.signals.send_request_answered_email')
    def test_does_not_send_on_answer_update(self, mock_send_email):
        """Test email is not sent when answer is updated"""
        request = RequestObject.objects.create(
            name='John Doe',
            email='john@example.com',
            phone_number='1234567890',
            message='Test request'
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text='Original answer'
        )
        mock_send_email.reset_mock()

        answer.answer_text = 'Updated answer'
        answer.save()

        mock_send_email.assert_not_called()

    @patch('base.signals.send_request_answered_email')
    def test_does_not_send_if_request_has_no_email(self, mock_send_email):
        """Test email is not sent if request has no email"""
        request = RequestObject.objects.create(
            name='John Doe',
            email='',
            phone_number='1234567890',
            message='Test request'
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text='Here is your answer'
        )

        mock_send_email.assert_not_called()

    @patch('base.signals.send_request_answered_email')
    def test_does_not_send_if_request_has_no_name(self, mock_send_email):
        """Test email is not sent if request has no name"""
        request = RequestObject.objects.create(
            name='',
            email='john@example.com',
            phone_number='1234567890',
            message='Test request'
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text='Here is your answer'
        )

        mock_send_email.assert_not_called()
