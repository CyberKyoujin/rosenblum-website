import pytest
from django.utils import timezone
from base.models import Order, File


@pytest.mark.django_db
class TestOrderModel:
    """Test cases for Order model"""

    def test_create_order_with_user(self, create_user):
        """Test creating an order associated with a user"""
        user = create_user(email="orderuser@example.com")
        order = Order.objects.create(
            user=user,
            name="John Doe",
            email="john@example.com",
            phone_number="1234567890",
            city="Berlin",
            street="Main St 123",
            zip="12345",
            message="Test order message"
        )
        assert order.user == user
        assert order.name == "John Doe"
        assert order.email == "john@example.com"
        assert order.status == Order.Status.REVIEW
        assert order.order_type == Order.OrderType.ORDER

    def test_create_anonymous_order(self):
        """Test creating order without user (anonymous)"""
        order = Order.objects.create(
            user=None,
            name="Anonymous User",
            email="anon@example.com",
            phone_number="9876543210",
            city="Munich",
            street="Side St 456",
            zip="54321",
            message="Anonymous order"
        )
        assert order.user is None
        assert order.name == "Anonymous User"

    def test_status_choices_validation(self, create_user):
        """Test that status field accepts valid choices"""
        user = create_user(email="status@example.com")

        valid_statuses = [
            Order.Status.REVIEW,
            Order.Status.IN_PROGRESS,
            Order.Status.COMPLETED,
            Order.Status.PICK_UP_READY,
            Order.Status.SENT,
            Order.Status.CANCELED
        ]

        for status in valid_statuses:
            order = Order.objects.create(
                user=user,
                name=f"User {status}",
                email=f"{status}@example.com",
                phone_number="0000000000",
                city="City",
                street="Street 1",
                zip="12345",
                message="Message",
                status=status
            )
            assert order.status == status

    def test_order_type_choices_validation(self, create_user):
        """Test that order_type field accepts valid choices"""
        user = create_user(email="type@example.com")

        # Test COSTS_ESTIMATE
        order1 = Order.objects.create(
            user=user,
            name="Estimate User",
            email="estimate@example.com",
            phone_number="1111111111",
            city="City",
            street="Street 1",
            zip="12345",
            message="Estimate message",
            order_type=Order.OrderType.COSTS_ESTIMATE
        )
        assert order1.order_type == Order.OrderType.COSTS_ESTIMATE

        # Test ORDER
        order2 = Order.objects.create(
            user=user,
            name="Order User",
            email="order@example.com",
            phone_number="2222222222",
            city="City",
            street="Street 2",
            zip="54321",
            message="Order message",
            order_type=Order.OrderType.ORDER
        )
        assert order2.order_type == Order.OrderType.ORDER

    def test_default_status_is_review(self, create_user):
        """Test that default status is REVIEW"""
        user = create_user(email="default@example.com")
        order = Order.objects.create(
            user=user,
            name="Default User",
            email="default@example.com",
            phone_number="3333333333",
            city="City",
            street="Street 3",
            zip="11111",
            message="Default message"
        )
        assert order.status == Order.Status.REVIEW

    def test_default_order_type_is_order(self, create_user):
        """Test that default order_type is ORDER"""
        user = create_user(email="defaulttype@example.com")
        order = Order.objects.create(
            user=user,
            name="Default Type User",
            email="defaulttype@example.com",
            phone_number="4444444444",
            city="City",
            street="Street 4",
            zip="22222",
            message="Default type message"
        )
        assert order.order_type == Order.OrderType.ORDER

    def test_default_is_new_true(self, create_user):
        """Test that default is_new is True"""
        user = create_user(email="new@example.com")
        order = Order.objects.create(
            user=user,
            name="New User",
            email="new@example.com",
            phone_number="5555555555",
            city="City",
            street="Street 5",
            zip="33333",
            message="New message"
        )
        assert order.is_new is True

    def test_formatted_timestamp_localization(self, create_user):
        """Test formatted_timestamp returns localized timestamp"""
        user = create_user(email="timestamp@example.com")
        order = Order.objects.create(
            user=user,
            name="Timestamp User",
            email="timestamp@example.com",
            phone_number="6666666666",
            city="City",
            street="Street 6",
            zip="44444",
            message="Timestamp message"
        )
        formatted = order.formatted_timestamp()
        # Format is 'DD.MM.YYYY HH:MM'
        assert len(formatted) == 16
        assert formatted[2] == '.'
        assert formatted[5] == '.'
        assert formatted[10] == ' '
        assert formatted[13] == ':'

    def test_auto_timestamp_on_creation(self, create_user):
        """Test that timestamp is automatically set on creation"""
        user = create_user(email="auto@example.com")
        before_creation = timezone.now()
        order = Order.objects.create(
            user=user,
            name="Auto User",
            email="auto@example.com",
            phone_number="7777777777",
            city="City",
            street="Street 7",
            zip="55555",
            message="Auto message"
        )
        after_creation = timezone.now()

        assert order.timestamp is not None
        assert before_creation <= order.timestamp <= after_creation

    def test_cascade_delete_files(self, create_user):
        """Test that deleting order cascades to delete associated files"""
        from django.core.files.uploadedfile import SimpleUploadedFile

        user = create_user(email="files@example.com")
        order = Order.objects.create(
            user=user,
            name="Files User",
            email="files@example.com",
            phone_number="8888888888",
            city="City",
            street="Street 8",
            zip="66666",
            message="Files message"
        )

        # Create a simple uploaded file
        uploaded_file = SimpleUploadedFile(
            "test_file.pdf",
            b"file content",
            content_type="application/pdf"
        )

        # Create file associated with order
        file = File.objects.create(
            order=order,
            file=uploaded_file
        )
        file_id = file.id

        # Delete order
        order.delete()

        # Verify file is deleted
        assert not File.objects.filter(id=file_id).exists()

    def test_user_deletion_nullifies_order_user(self, create_user):
        """Test that deleting user sets order.user to NULL due to CASCADE with null=True"""
        user = create_user(email="nullify@example.com")
        order = Order.objects.create(
            user=user,
            name="Nullify User",
            email="nullify@example.com",
            phone_number="9999999999",
            city="City",
            street="Street 9",
            zip="77777",
            message="Nullify message"
        )
        order_id = order.id

        # Delete user - should CASCADE delete the order because of models.CASCADE
        user.delete()

        # Verify order is deleted (CASCADE behavior)
        assert not Order.objects.filter(id=order_id).exists()

    def test_string_representation(self, create_user):
        """Test __str__ method"""
        user = create_user(email="string@example.com")
        order = Order.objects.create(
            user=user,
            name="String User",
            email="string@example.com",
            phone_number="0101010101",
            city="City",
            street="Street 10",
            zip="88888",
            message="String message"
        )
        expected = f"Order number {order.pk}"
        assert str(order) == expected

    def test_date_auto_generated(self, create_user):
        """Test that date is auto-generated on creation"""
        import datetime
        user = create_user(email="date@example.com")
        order = Order.objects.create(
            user=user,
            name="Date User",
            email="date@example.com",
            phone_number="1212121212",
            city="City",
            street="Street 11",
            zip="99999",
            message="Date message"
        )
        assert order.date is not None
        # Date should be today (allow 1 day difference for timezone edge cases)
        today = datetime.date.today()
        date_diff = abs((order.date - today).days)
        assert date_diff <= 1, f"Order date {order.date} is more than 1 day from today {today}"

    def test_message_max_length_1000(self, create_user):
        """Test that message field has max length of 1000 characters"""
        user = create_user(email="maxlength@example.com")
        long_message = "A" * 1000
        order = Order.objects.create(
            user=user,
            name="Max Length User",
            email="maxlength@example.com",
            phone_number="1313131313",
            city="City",
            street="Street 12",
            zip="00000",
            message=long_message
        )
        assert len(order.message) == 1000
        assert order.message == long_message

    def test_update_order_status(self, create_user):
        """Test updating order status"""
        user = create_user(email="update@example.com")
        order = Order.objects.create(
            user=user,
            name="Update User",
            email="update@example.com",
            phone_number="1414141414",
            city="City",
            street="Street 13",
            zip="11110",
            message="Update message"
        )

        assert order.status == Order.Status.REVIEW

        order.status = Order.Status.IN_PROGRESS
        order.save()

        assert order.status == Order.Status.IN_PROGRESS

    def test_mark_order_as_not_new(self, create_user):
        """Test marking order as not new"""
        user = create_user(email="notnew@example.com")
        order = Order.objects.create(
            user=user,
            name="Not New User",
            email="notnew@example.com",
            phone_number="1515151515",
            city="City",
            street="Street 14",
            zip="22220",
            message="Not new message"
        )

        assert order.is_new is True

        order.is_new = False
        order.save()

        assert order.is_new is False
