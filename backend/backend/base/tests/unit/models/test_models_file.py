import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from base.models import File, Order, Message


@pytest.mark.django_db
class TestFileModel:
    """Test cases for File model"""

    def test_create_file_for_order(self, create_user, create_order):
        """Test creating a file associated with an order"""
        user = create_user(email="fileorder@example.com")
        order = create_order(user=user)

        # Create a simple uploaded file
        uploaded_file = SimpleUploadedFile(
            "test_document.pdf",
            b"file_content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        assert file.order == order
        assert file.message is None
        assert file.file_name == "test_document.pdf"
        assert file.file_size is not None

    def test_create_file_for_message(self, create_user):
        """Test creating a file associated with a message"""
        sender = create_user(email="filesender@example.com")
        receiver = create_user(email="filereceiver@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Message with attachment"
        )

        uploaded_file = SimpleUploadedFile(
            "attachment.jpg",
            b"image_content",
            content_type="image/jpeg"
        )

        file = File.objects.create(
            message=message,
            file=uploaded_file
        )

        assert file.message == message
        assert file.order is None
        assert file.file_name == "attachment.jpg"

    def test_file_without_order_or_message(self):
        """Test creating file without order or message"""
        uploaded_file = SimpleUploadedFile(
            "standalone.txt",
            b"text_content",
            content_type="text/plain"
        )

        file = File.objects.create(
            order=None,
            message=None,
            file=uploaded_file
        )

        assert file.order is None
        assert file.message is None

    def test_file_size_calculation_on_save(self, create_user, create_order):
        """Test that file_size is calculated on save (in MB)"""
        user = create_user(email="filesize@example.com")
        order = create_order(user=user)

        # Create a file with 1024 bytes (1 KB = 0.0009765625 MB)
        content = b"a" * 1024
        uploaded_file = SimpleUploadedFile(
            "sizetest.txt",
            content,
            content_type="text/plain"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        # File size should be calculated as bytes / (1024 * 1024)
        # 1024 bytes / (1024 * 1024) = 0.0009765625 MB
        assert file.file_size is not None
        expected_size = 1024 / (1024 * 1024)
        assert abs(float(file.file_size) - expected_size) < 0.0001

    def test_file_name_extraction_on_save(self, create_user, create_order):
        """Test that file_name is extracted from uploaded file on save"""
        user = create_user(email="filename@example.com")
        order = create_order(user=user)

        uploaded_file = SimpleUploadedFile(
            "my_document_2024.pdf",
            b"content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        assert file.file_name == "my_document_2024.pdf"

    def test_cascade_delete_on_order_deletion(self, create_user, create_order):
        """Test that deleting order cascades to delete files"""
        user = create_user(email="cascadeorder@example.com")
        order = create_order(user=user)

        uploaded_file = SimpleUploadedFile(
            "cascade.pdf",
            b"content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )
        file_id = file.id

        # Delete order
        order.delete()

        # Verify file is deleted
        assert not File.objects.filter(id=file_id).exists()

    def test_cascade_delete_on_message_deletion(self, create_user):
        """Test that deleting message cascades to delete files"""
        sender = create_user(email="cascadesender@example.com")
        receiver = create_user(email="cascadereceiver@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Cascade test"
        )

        uploaded_file = SimpleUploadedFile(
            "cascade_msg.pdf",
            b"content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            message=message,
            file=uploaded_file
        )
        file_id = file.id

        # Delete message
        message.delete()

        # Verify file is deleted
        assert not File.objects.filter(id=file_id).exists()

    def test_file_size_in_megabytes(self, create_user, create_order):
        """Test that file size is stored in megabytes"""
        user = create_user(email="megabytes@example.com")
        order = create_order(user=user)

        # Create a 2MB file (2 * 1024 * 1024 bytes)
        size_in_bytes = 2 * 1024 * 1024
        content = b"a" * size_in_bytes
        uploaded_file = SimpleUploadedFile(
            "large_file.bin",
            content,
            content_type="application/octet-stream"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        # File size should be approximately 2.0 MB
        assert file.file_size is not None
        assert abs(float(file.file_size) - 2.0) < 0.01  # Allow small floating point error

    def test_string_representation_with_order(self, create_user, create_order):
        """Test __str__ method when file is associated with order"""
        user = create_user(email="strorder@example.com")
        order = create_order(user=user)

        uploaded_file = SimpleUploadedFile(
            "str_test.pdf",
            b"content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        expected = f"File {file.pk} to {order}"
        assert str(file) == expected

    def test_string_representation_with_message(self, create_user):
        """Test __str__ method when file is associated with message"""
        sender = create_user(email="strsender@example.com")
        receiver = create_user(email="strreceiver@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="String test"
        )

        uploaded_file = SimpleUploadedFile(
            "str_msg.pdf",
            b"content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            message=message,
            file=uploaded_file
        )

        expected = f"File {file.pk} to {message}"
        assert str(file) == expected

    def test_multiple_files_for_order(self, create_user, create_order):
        """Test creating multiple files for one order"""
        user = create_user(email="multiorder@example.com")
        order = create_order(user=user)

        # Create 3 files
        for i in range(3):
            uploaded_file = SimpleUploadedFile(
                f"file_{i}.pdf",
                b"content",
                content_type="application/pdf"
            )
            File.objects.create(
                order=order,
                file=uploaded_file
            )

        # Check order has 3 files via related_name 'files'
        assert order.files.count() == 3

    def test_multiple_files_for_message(self, create_user):
        """Test creating multiple files for one message"""
        sender = create_user(email="multisender@example.com")
        receiver = create_user(email="multireceiver@example.com")

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message="Multiple attachments"
        )

        # Create 2 files
        for i in range(2):
            uploaded_file = SimpleUploadedFile(
                f"attachment_{i}.jpg",
                b"content",
                content_type="image/jpeg"
            )
            File.objects.create(
                message=message,
                file=uploaded_file
            )

        # Check message has 2 files via related_name 'files'
        assert message.files.count() == 2

    def test_file_with_very_small_size(self, create_user, create_order):
        """Test file with very small size (< 1KB)"""
        user = create_user(email="tiny@example.com")
        order = create_order(user=user)

        # Create tiny file (10 bytes)
        uploaded_file = SimpleUploadedFile(
            "tiny.txt",
            b"small",
            content_type="text/plain"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        # Size should be a very small decimal
        assert file.file_size is not None
        assert float(file.file_size) < 0.001  # Less than 0.001 MB

    def test_file_name_with_spaces_and_special_chars(self, create_user, create_order):
        """Test file name with spaces and special characters"""
        user = create_user(email="special@example.com")
        order = create_order(user=user)

        uploaded_file = SimpleUploadedFile(
            "My Document (2024) - Final.pdf",
            b"content",
            content_type="application/pdf"
        )

        file = File.objects.create(
            order=order,
            file=uploaded_file
        )

        assert file.file_name == "My Document (2024) - Final.pdf"
