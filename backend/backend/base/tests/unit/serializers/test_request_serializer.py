import pytest
from django.utils import timezone
from base.serializers import RequestSerializer, RequestAnswerSerializer
from base.models import RequestObject, RequestAnswer


@pytest.mark.django_db
class TestRequestSerializerValidation:
    """Tests for RequestSerializer validation"""

    def test_valid_request_data(self):
        """Test serializer accepts valid request data"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'message': 'I need help with translation'
        }
        serializer = RequestSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_invalid_email_rejected(self):
        """Test serializer rejects invalid email"""
        data = {
            'name': 'John Doe',
            'email': 'not-an-email',
            'phone_number': '1234567890',
            'message': 'Test message'
        }
        serializer = RequestSerializer(data=data)
        assert not serializer.is_valid()
        assert 'email' in serializer.errors

    def test_missing_required_fields_rejected(self):
        """Test serializer rejects missing required fields"""
        data = {
            'name': 'John Doe'
        }
        serializer = RequestSerializer(data=data)
        assert not serializer.is_valid()

    def test_empty_message_rejected(self):
        """Test serializer rejects empty message"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'message': ''
        }
        serializer = RequestSerializer(data=data)
        assert not serializer.is_valid()
        assert 'message' in serializer.errors


@pytest.mark.django_db
class TestRequestSerializerCreate:
    """Tests for RequestSerializer create method"""

    def test_create_request(self):
        """Test creating request via serializer"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'message': 'Translation request message'
        }
        serializer = RequestSerializer(data=data)
        assert serializer.is_valid()

        request_obj = serializer.save()

        assert request_obj.name == 'John Doe'
        assert request_obj.email == 'john@example.com'
        assert request_obj.is_new is True  # Default
        assert RequestObject.objects.filter(id=request_obj.id).exists()

    def test_create_request_default_is_new_true(self):
        """Test request is created with is_new=True by default"""
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '1234567890',
            'message': 'Test message'
        }
        serializer = RequestSerializer(data=data)
        assert serializer.is_valid()

        request_obj = serializer.save()

        assert request_obj.is_new is True


@pytest.mark.django_db
class TestRequestSerializerOutput:
    """Tests for RequestSerializer output fields"""

    def test_formatted_timestamp_field(self):
        """Test formatted_timestamp returns correct format"""
        request_obj = RequestObject.objects.create(
            name='Test User',
            email='test@example.com',
            phone_number='1234567890',
            message='Test message'
        )

        serializer = RequestSerializer(request_obj)

        # Should be in format DD.MM.YYYY HH:MM
        formatted = serializer.data['formatted_timestamp']
        assert formatted is not None
        assert '.' in formatted
        assert ':' in formatted

    def test_all_fields_present(self):
        """Test all expected fields are present in output"""
        request_obj = RequestObject.objects.create(
            name='Test User',
            email='test@example.com',
            phone_number='1234567890',
            message='Test message'
        )

        serializer = RequestSerializer(request_obj)

        expected_fields = ['id', 'name', 'email', 'phone_number', 'message', 'is_new', 'formatted_timestamp']

        for field in expected_fields:
            assert field in serializer.data, f"Field '{field}' should be in output"


@pytest.mark.django_db
class TestRequestAnswerSerializerValidation:
    """Tests for RequestAnswerSerializer validation"""

    def test_valid_answer_data(self):
        """Test serializer accepts valid answer data"""
        request_obj = RequestObject.objects.create(
            name='Test User',
            email='test@example.com',
            phone_number='1234567890',
            message='Test message'
        )

        data = {
            'request': request_obj.id,
            'answer_text': 'This is the answer to your request.'
        }
        serializer = RequestAnswerSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_missing_request_rejected(self):
        """Test serializer rejects missing request reference"""
        data = {
            'answer_text': 'Answer without request'
        }
        serializer = RequestAnswerSerializer(data=data)
        assert not serializer.is_valid()
        assert 'request' in serializer.errors


@pytest.mark.django_db
class TestRequestAnswerSerializerCreate:
    """Tests for RequestAnswerSerializer create method"""

    def test_create_answer(self):
        """Test creating answer via serializer"""
        request_obj = RequestObject.objects.create(
            name='Test User',
            email='test@example.com',
            phone_number='1234567890',
            message='Test message'
        )

        data = {
            'request': request_obj.id,
            'answer_text': 'Here is the answer to your question.'
        }
        serializer = RequestAnswerSerializer(data=data)
        assert serializer.is_valid()

        answer = serializer.save()

        assert answer.request == request_obj
        assert answer.answer_text == 'Here is the answer to your question.'
        assert RequestAnswer.objects.filter(id=answer.id).exists()


@pytest.mark.django_db
class TestRequestAnswerSerializerOutput:
    """Tests for RequestAnswerSerializer output fields"""

    def test_formatted_timestamp_field(self):
        """Test formatted_timestamp returns correct format"""
        request_obj = RequestObject.objects.create(
            name='Test User',
            email='test@example.com',
            phone_number='1234567890',
            message='Test message'
        )
        answer = RequestAnswer.objects.create(
            request=request_obj,
            answer_text='Answer text'
        )

        serializer = RequestAnswerSerializer(answer)

        # Should be in format DD.MM.YYYY HH:MM
        formatted = serializer.data['formatted_timestamp']
        assert formatted is not None
        assert '.' in formatted
        assert ':' in formatted
