import pytest
from django.utils import timezone
from base.models import RequestObject, RequestAnswer


@pytest.mark.django_db
class TestRequestObjectModel:
    """Test cases for RequestObject model"""

    def test_create_request(self):
        """Test creating a request"""
        request = RequestObject.objects.create(
            name="John Doe",
            email="john@example.com",
            phone_number="1234567890",
            message="I need help with translation"
        )

        assert request.name == "John Doe"
        assert request.email == "john@example.com"
        assert request.phone_number == "1234567890"
        assert request.message == "I need help with translation"
        assert request.is_new is True

    def test_default_is_new_true(self):
        """Test that default is_new is True"""
        request = RequestObject.objects.create(
            name="Jane Smith",
            email="jane@example.com",
            phone_number="9876543210",
            message="Request message"
        )

        assert request.is_new is True

    def test_formatted_timestamp(self):
        """Test formatted_timestamp returns localized timestamp"""
        request = RequestObject.objects.create(
            name="Timestamp User",
            email="timestamp@example.com",
            phone_number="1111111111",
            message="Timestamp test"
        )

        formatted = request.formatted_timestamp()
        # Format is 'DD.MM.YYYY HH:MM'
        assert len(formatted) == 16
        assert formatted[2] == '.'
        assert formatted[5] == '.'
        assert formatted[10] == ' '
        assert formatted[13] == ':'

    def test_cascade_delete_answers(self):
        """Test that deleting request cascades to delete answers"""
        request = RequestObject.objects.create(
            name="Cascade User",
            email="cascade@example.com",
            phone_number="2222222222",
            message="Cascade test"
        )

        # Create answers
        answer1 = RequestAnswer.objects.create(
            request=request,
            answer_text="First answer"
        )
        answer2 = RequestAnswer.objects.create(
            request=request,
            answer_text="Second answer"
        )

        answer1_id = answer1.id
        answer2_id = answer2.id

        # Delete request
        request.delete()

        # Verify answers are deleted
        assert not RequestAnswer.objects.filter(id=answer1_id).exists()
        assert not RequestAnswer.objects.filter(id=answer2_id).exists()

    def test_auto_timestamp_on_creation(self):
        """Test that timestamp is automatically set on creation"""
        before_creation = timezone.now()
        request = RequestObject.objects.create(
            name="Auto User",
            email="auto@example.com",
            phone_number="3333333333",
            message="Auto timestamp test"
        )
        after_creation = timezone.now()

        assert request.timestamp is not None
        assert before_creation <= request.timestamp <= after_creation

    def test_string_representation(self):
        """Test __str__ method"""
        request = RequestObject.objects.create(
            name="String User",
            email="string@example.com",
            phone_number="4444444444",
            message="String test"
        )

        str_repr = str(request)
        assert "Request number" in str_repr
        assert str(request.pk) in str_repr
        assert "String User" in str_repr

    def test_mark_request_as_not_new(self):
        """Test marking request as not new"""
        request = RequestObject.objects.create(
            name="Not New User",
            email="notnew@example.com",
            phone_number="5555555555",
            message="Not new test"
        )

        assert request.is_new is True

        request.is_new = False
        request.save()

        assert request.is_new is False

    def test_message_with_long_text(self):
        """Test request with very long message"""
        long_message = "A" * 5000  # TextField has no limit
        request = RequestObject.objects.create(
            name="Long Message User",
            email="long@example.com",
            phone_number="6666666666",
            message=long_message
        )

        assert len(request.message) == 5000
        assert request.message == long_message

    def test_request_with_special_characters_in_phone(self):
        """Test phone number with special characters"""
        request = RequestObject.objects.create(
            name="Special Phone User",
            email="special@example.com",
            phone_number="+49 (123) 456-7890",
            message="Special phone test"
        )

        assert request.phone_number == "+49 (123) 456-7890"

    def test_multiple_requests_from_same_email(self):
        """Test creating multiple requests from same email"""
        for i in range(3):
            RequestObject.objects.create(
                name=f"User {i}",
                email="same@example.com",
                phone_number=f"777777777{i}",
                message=f"Request {i}"
            )

        requests = RequestObject.objects.filter(email="same@example.com")
        assert requests.count() == 3


@pytest.mark.django_db
class TestRequestAnswerModel:
    """Test cases for RequestAnswer model"""

    def test_create_answer(self):
        """Test creating an answer for a request"""
        request = RequestObject.objects.create(
            name="Answer User",
            email="answer@example.com",
            phone_number="8888888888",
            message="Need help"
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text="We will help you soon"
        )

        assert answer.request == request
        assert answer.answer_text == "We will help you soon"

    def test_foreign_key_to_request(self):
        """Test foreign key relationship to RequestObject"""
        request = RequestObject.objects.create(
            name="FK User",
            email="fk@example.com",
            phone_number="9999999999",
            message="FK test"
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text="FK answer"
        )

        # Access request from answer
        assert answer.request == request

        # Access answers from request (via related name or _set)
        assert answer in request.requestanswer_set.all()

    def test_answer_text_max_length(self):
        """Test that answer_text has max length of 1000"""
        request = RequestObject.objects.create(
            name="Max Length User",
            email="maxlength@example.com",
            phone_number="1010101010",
            message="Max length test"
        )

        long_answer = "A" * 1000
        answer = RequestAnswer.objects.create(
            request=request,
            answer_text=long_answer
        )

        assert len(answer.answer_text) == 1000
        assert answer.answer_text == long_answer

    def test_formatted_timestamp(self):
        """Test formatted_timestamp returns localized timestamp"""
        request = RequestObject.objects.create(
            name="Timestamp Answer User",
            email="timestampanswer@example.com",
            phone_number="1212121212",
            message="Timestamp answer test"
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text="Timestamp test answer"
        )

        formatted = answer.formatted_timestamp()
        # Format is 'DD.MM.YYYY HH:MM'
        assert len(formatted) == 16
        assert formatted[2] == '.'
        assert formatted[5] == '.'
        assert formatted[10] == ' '
        assert formatted[13] == ':'

    def test_auto_timestamp_on_creation(self):
        """Test that timestamp is automatically set on creation"""
        request = RequestObject.objects.create(
            name="Auto Answer User",
            email="autoanswer@example.com",
            phone_number="1313131313",
            message="Auto answer test"
        )

        before_creation = timezone.now()
        answer = RequestAnswer.objects.create(
            request=request,
            answer_text="Auto timestamp test"
        )
        after_creation = timezone.now()

        assert answer.timestamp is not None
        assert before_creation <= answer.timestamp <= after_creation

    def test_cascade_delete_on_request_deletion(self):
        """Test that deleting request deletes answer"""
        request = RequestObject.objects.create(
            name="Delete User",
            email="delete@example.com",
            phone_number="1414141414",
            message="Delete test"
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text="This will be deleted"
        )
        answer_id = answer.id

        # Delete request
        request.delete()

        # Verify answer is deleted
        assert not RequestAnswer.objects.filter(id=answer_id).exists()

    def test_multiple_answers_for_request(self):
        """Test creating multiple answers for one request"""
        request = RequestObject.objects.create(
            name="Multi Answer User",
            email="multianswer@example.com",
            phone_number="1515151515",
            message="Need multiple answers"
        )

        # Create 3 answers
        for i in range(3):
            RequestAnswer.objects.create(
                request=request,
                answer_text=f"Answer number {i+1}"
            )

        assert request.requestanswer_set.count() == 3

    def test_default_answer_text_empty_string(self):
        """Test that default answer_text is empty string"""
        request = RequestObject.objects.create(
            name="Default Answer User",
            email="defaultanswer@example.com",
            phone_number="1616161616",
            message="Default answer test"
        )

        answer = RequestAnswer.objects.create(
            request=request
        )

        assert answer.answer_text == ""

    def test_answer_with_empty_text(self):
        """Test creating answer with empty text"""
        request = RequestObject.objects.create(
            name="Empty Answer User",
            email="emptyanswer@example.com",
            phone_number="1717171717",
            message="Empty answer test"
        )

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text=""
        )

        assert answer.answer_text == ""

    def test_answer_with_multiline_text(self):
        """Test answer with multiline text"""
        request = RequestObject.objects.create(
            name="Multiline Answer User",
            email="multiline@example.com",
            phone_number="1818181818",
            message="Multiline test"
        )

        multiline_text = """Line 1
Line 2
Line 3"""

        answer = RequestAnswer.objects.create(
            request=request,
            answer_text=multiline_text
        )

        assert answer.answer_text == multiline_text
        assert "\n" in answer.answer_text
