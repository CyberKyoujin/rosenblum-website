import pytest
from unittest.mock import MagicMock
from django.core.files.uploadedfile import SimpleUploadedFile
from base.serializers import OrderSerializer, FileSerializer
from base.models import Order, File, Document


def _make_request(user=None):
    """Create a mock request with the given user (or AnonymousUser)."""
    request = MagicMock()
    if user:
        request.user = user
        request.user.is_staff = user.is_staff
        request.user.is_authenticated = True
    else:
        request.user.is_staff = False
        request.user.is_authenticated = False
    return request


def _valid_order_data(**overrides):
    """Return minimal valid order data with order_docs."""
    data = {
        'name': 'John Doe',
        'email': 'john@example.com',
        'phone_number': '1234567890',
        'city': 'Berlin',
        'street': 'Main St 123',
        'zip': '12345',
        'message': 'Test order message',
        'order_docs': ['{"type": "Geburtsurkunde", "language": "ua"}'],
    }
    data.update(overrides)
    return data


@pytest.mark.django_db
class TestOrderSerializerValidation:
    """Tests for OrderSerializer validation"""

    def test_valid_order_data(self):
        """Test serializer accepts valid order data"""
        serializer = OrderSerializer(data=_valid_order_data())
        assert serializer.is_valid(), serializer.errors

    def test_invalid_email_rejected(self):
        """Test serializer rejects invalid email"""
        serializer = OrderSerializer(data=_valid_order_data(email='not-an-email'))
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_missing_required_fields_rejected(self):
        """Test serializer rejects missing required fields"""
        data = {'name': 'John Doe'}
        serializer = OrderSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_valid_status_choices(self):
        """Test serializer accepts valid status choices"""
        valid_statuses = ['review', 'in_progress', 'ready_pick_up', 'sent', 'canceled']

        for s in valid_statuses:
            serializer = OrderSerializer(data=_valid_order_data(status=s))
            assert serializer.is_valid(), f"Status '{s}' should be valid: {serializer.errors}"

    def test_invalid_status_rejected(self):
        """Test serializer rejects invalid status"""
        serializer = OrderSerializer(data=_valid_order_data(status='invalid_status'))
        assert not serializer.is_valid()
        assert 'status' in serializer.errors

    def test_valid_order_type_choices(self):
        """Test serializer accepts valid order_type choices"""
        valid_types = ['kostenvoranschlag', 'order']

        for order_type in valid_types:
            serializer = OrderSerializer(data=_valid_order_data(order_type=order_type))
            assert serializer.is_valid(), f"Order type '{order_type}' should be valid: {serializer.errors}"


@pytest.mark.django_db
class TestOrderSerializerCreate:
    """Tests for OrderSerializer create method"""

    def test_create_order_with_minimal_data(self):
        """Test creating order with minimal required data"""
        request = _make_request()
        serializer = OrderSerializer(data=_valid_order_data(), context={'request': request})
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        assert order.name == 'John Doe'
        assert order.email == 'john@example.com'
        assert order.status == 'review'
        assert Order.objects.filter(id=order.id).exists()
        assert Document.objects.filter(order=order).count() == 1

    def test_create_order_with_uploaded_files(self):
        """Test creating order with uploaded files"""
        file1 = SimpleUploadedFile("doc1.pdf", b"content1", content_type="application/pdf")
        file2 = SimpleUploadedFile("doc2.pdf", b"content2", content_type="application/pdf")

        request = _make_request()
        data = _valid_order_data(uploaded_files=[file1, file2])
        serializer = OrderSerializer(data=data, context={'request': request})
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        assert order.files.count() == 2

    def test_create_order_default_status_is_review(self):
        """Test order is created with 'review' status by default"""
        request = _make_request()
        serializer = OrderSerializer(data=_valid_order_data(), context={'request': request})
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        assert order.status == 'review'

    def test_create_order_default_type_is_order(self):
        """Test order is created with 'order' type by default"""
        request = _make_request()
        serializer = OrderSerializer(data=_valid_order_data(), context={'request': request})
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        assert order.order_type == 'order'

    def test_create_order_anonymous_gets_guest_uuid(self):
        """Test anonymous order gets a guest_uuid"""
        request = _make_request()
        serializer = OrderSerializer(data=_valid_order_data(), context={'request': request})
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        assert order.guest_uuid is not None
        assert len(order.guest_uuid) > 0

    def test_create_order_non_staff_price_from_utils(self):
        """Test non-staff user gets price from get_doc_price, not from request"""
        request = _make_request()
        data = _valid_order_data(
            order_docs=['{"type": "Geburtsurkunde", "language": "ua", "price": 999}']
        )
        serializer = OrderSerializer(data=data, context={'request': request})
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        doc = Document.objects.get(order=order)
        from decimal import Decimal
        assert doc.price == Decimal('35.30')  # from utils, not 999


@pytest.mark.django_db
class TestOrderSerializerOutput:
    """Tests for OrderSerializer output fields"""

    def test_formatted_timestamp_field(self, create_order):
        """Test formatted_timestamp returns correct format"""
        order = create_order()
        serializer = OrderSerializer(order)

        formatted = serializer.data['formatted_timestamp']
        assert formatted is not None
        assert '.' in formatted
        assert ':' in formatted

    def test_files_included_in_output(self, create_order):
        """Test files are included in serialized output"""
        order = create_order()

        uploaded_file = SimpleUploadedFile("test.pdf", b"content", content_type="application/pdf")
        File.objects.create(order=order, file=uploaded_file)

        serializer = OrderSerializer(order)

        assert 'files' in serializer.data
        assert len(serializer.data['files']) == 1

    def test_uploaded_files_not_in_output(self, create_order):
        """Test uploaded_files (write_only) is not in output"""
        order = create_order()
        serializer = OrderSerializer(order)

        assert 'uploaded_files' not in serializer.data

    def test_all_fields_present(self, create_order):
        """Test all expected fields are present in output"""
        order = create_order()
        serializer = OrderSerializer(order)

        expected_fields = [
            'id', 'name', 'email', 'phone_number', 'city', 'street', 'zip',
            'message', 'status', 'order_type', 'files', 'formatted_timestamp'
        ]

        for field in expected_fields:
            assert field in serializer.data, f"Field '{field}' should be in output"


@pytest.mark.django_db
class TestFileSerializer:
    """Tests for FileSerializer"""

    def test_serialize_file(self, create_order):
        """Test FileSerializer serializes file correctly"""
        order = create_order()
        uploaded_file = SimpleUploadedFile("document.pdf", b"pdf content", content_type="application/pdf")
        file_obj = File.objects.create(order=order, file=uploaded_file)

        serializer = FileSerializer(file_obj)

        assert 'id' in serializer.data
        assert 'file' in serializer.data
        assert serializer.data['file_name'] is not None
