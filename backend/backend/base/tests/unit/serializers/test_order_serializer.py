import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from base.serializers import OrderSerializer, FileSerializer
from base.models import Order, File


@pytest.mark.django_db
class TestOrderSerializerValidation:
    """Tests for OrderSerializer validation"""

    def test_valid_order_data(self):
        """Test serializer accepts valid order data"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'city': 'Berlin',
            'street': 'Main St 123',
            'zip': '12345',
            'message': 'Test order message'
        }
        serializer = OrderSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_invalid_email_rejected(self):
        """Test serializer rejects invalid email"""
        data = {
            'name': 'John Doe',
            'email': 'not-an-email',
            'phone_number': '1234567890',
            'city': 'Berlin',
            'street': 'Main St',
            'zip': '12345',
            'message': 'Test'
        }
        serializer = OrderSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_missing_required_fields_rejected(self):
        """Test serializer rejects missing required fields"""
        data = {
            'name': 'John Doe'
            # Missing email, phone_number, etc.
        }
        serializer = OrderSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_valid_status_choices(self):
        """Test serializer accepts valid status choices"""
        valid_statuses = ['review', 'in_progress', 'completed', 'ready_pick_up', 'sent', 'canceled']

        for status in valid_statuses:
            data = {
                'name': 'Test User',
                'email': 'test@example.com',
                'phone_number': '1234567890',
                'city': 'City',
                'street': 'Street',
                'zip': '12345',
                'message': 'Message',
                'status': status
            }
            serializer = OrderSerializer(data=data)
            assert serializer.is_valid(), f"Status '{status}' should be valid: {serializer.errors}"

    def test_invalid_status_rejected(self):
        """Test serializer rejects invalid status"""
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone_number': '1234567890',
            'city': 'City',
            'street': 'Street',
            'zip': '12345',
            'message': 'Message',
            'status': 'invalid_status'
        }
        serializer = OrderSerializer(data=data)
        assert not serializer.is_valid()
        assert 'status' in serializer.errors

    def test_valid_order_type_choices(self):
        """Test serializer accepts valid order_type choices"""
        valid_types = ['costs_estimate', 'order']

        for order_type in valid_types:
            data = {
                'name': 'Test User',
                'email': 'test@example.com',
                'phone_number': '1234567890',
                'city': 'City',
                'street': 'Street',
                'zip': '12345',
                'message': 'Message',
                'order_type': order_type
            }
            serializer = OrderSerializer(data=data)
            assert serializer.is_valid(), f"Order type '{order_type}' should be valid: {serializer.errors}"


@pytest.mark.django_db
class TestOrderSerializerCreate:
    """Tests for OrderSerializer create method"""

    def test_create_order_with_minimal_data(self):
        """Test creating order with minimal required data"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'city': 'Berlin',
            'street': 'Main St',
            'zip': '12345',
            'message': 'Test message'
        }
        serializer = OrderSerializer(data=data)
        assert serializer.is_valid()

        order = serializer.save()

        assert order.name == 'John Doe'
        assert order.email == 'john@example.com'
        assert order.status == 'review'  # Default status
        assert Order.objects.filter(id=order.id).exists()

    def test_create_order_with_uploaded_files(self):
        """Test creating order with uploaded files"""
        file1 = SimpleUploadedFile("doc1.pdf", b"content1", content_type="application/pdf")
        file2 = SimpleUploadedFile("doc2.pdf", b"content2", content_type="application/pdf")

        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'city': 'Berlin',
            'street': 'Main St',
            'zip': '12345',
            'message': 'Test message',
            'uploaded_files': [file1, file2]
        }
        serializer = OrderSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        order = serializer.save()

        # Verify files were created
        assert order.files.count() == 2

    def test_create_order_default_status_is_review(self):
        """Test order is created with 'review' status by default"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'city': 'Berlin',
            'street': 'Main St',
            'zip': '12345',
            'message': 'Test message'
        }
        serializer = OrderSerializer(data=data)
        assert serializer.is_valid()

        order = serializer.save()

        assert order.status == 'review'

    def test_create_order_default_type_is_order(self):
        """Test order is created with 'order' type by default"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'city': 'Berlin',
            'street': 'Main St',
            'zip': '12345',
            'message': 'Test message'
        }
        serializer = OrderSerializer(data=data)
        assert serializer.is_valid()

        order = serializer.save()

        assert order.order_type == 'order'


@pytest.mark.django_db
class TestOrderSerializerOutput:
    """Tests for OrderSerializer output fields"""

    def test_formatted_timestamp_field(self, create_order):
        """Test formatted_timestamp returns correct format"""
        order = create_order()
        serializer = OrderSerializer(order)

        # Should be in format DD.MM.YYYY HH:MM
        formatted = serializer.data['formatted_timestamp']
        assert formatted is not None
        assert '.' in formatted  # Contains date separators
        assert ':' in formatted  # Contains time separator

    def test_files_included_in_output(self, create_order):
        """Test files are included in serialized output"""
        order = create_order()

        # Add a file
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
