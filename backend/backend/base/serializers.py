import uuid
from rest_framework import serializers
from .models import CustomUser, Order, File, Message, RequestObject, Review, EmailVerification, RequestAnswer, Translation, Document, CostEstimate, Invoice
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from django.utils import timezone
from base.services.email_verification import send_verification_code, generate_verification_code
from base.services.email_notifications import (
    send_order_received_email,
    send_order_sent_email,
    send_order_pickup_ready_email,
    send_order_canceled_email,
    send_admin_new_order_notification,
)
from django.db import transaction
from rest_framework import exceptions
import json
from django_q.tasks import async_task
from base.services.tasks import create_lex_office_invoice
from .utils import get_doc_price
import logging

logger = logging.getLogger(__name__)

class CustomUserSerializer(serializers.ModelSerializer):
    
    image_url = serializers.SerializerMethodField()
    orders = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        
        with transaction.atomic():
            user = CustomUser.objects.create_user(**validated_data)
            
            code = generate_verification_code()
        
            EmailVerification.objects.create(user=user, code=code)

            transaction.on_commit(lambda: send_verification_code(user.email, user.first_name, user.last_name, code))
        
        return user
     
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        
        instance.save()
        return instance
    
    def get_image_url(self, obj):
        request = self.context.get('request', None)
    
        if obj.profile_img:
            file_url = obj.profile_img.url
            
            if request:
                return request.build_absolute_uri(file_url)
            else:
                return file_url
            
        return None
        
    def get_orders(self, obj):
        if hasattr(obj, 'orders_count'):
            return obj.orders_count
        return Order.objects.filter(user=obj).count()
        
class UserDataSerializer(serializers.ModelSerializer):
    
    image_url = serializers.ImageField(source='profile_img', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'date_joined', 'phone_number', 'city', 'street', 'zip', 'image_url', 'first_name', 'last_name', 'email', 'profile_img_url']
        

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = RefreshToken(attrs['refresh'])
        user = get_user_model().objects.get(id=refresh['user_id'])

        access = AccessToken.for_user(user)

        access['id'] = user.id
        access['email'] = user.email
        access['first_name'] = user.first_name
        access['last_name'] = user.last_name
        access['profile_img_url'] = user.profile_img_url

        data['access'] = str(access)

        return data    
    
class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['profile_img_url'] = user.profile_img_url

        return token
    
    def validate(self, attrs):
        
        email = attrs.get("email")
        password = attrs.get("password")
        
        user = None
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            pass 

        if user is None or not user.check_password(password):
            
            raise exceptions.AuthenticationFailed(
                detail={
                    "detail": "Invalid email or password.",
                    "code": "authentication_failed"
                }
            )
            
        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                detail={
                    "detail": "Account unverified. Please verify your email.",
                    "code": "account_disabled"
                }
            )
            
        refresh = self.get_token(user)

        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Login successful"
        }

        return data


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
        
class DocumentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False, allow_null=True)
    class Meta:
        model = Document
        fields = '__all__'

    def validate_language(self, value):
        valid = [c[0] for c in Document.Status.choices]
        if value not in valid:
            raise serializers.ValidationError(f"Invalid language '{value}'. Must be one of: {valid}")
        return value

    def validate_type(self, value):
        if not isinstance(value, str):
            raise serializers.ValidationError("Type must be a string.")
        return value

    def validate_price(self, value):
        from decimal import Decimal, InvalidOperation
        try:
            d = Decimal(str(value))
            if d < 0:
                logger.error("[ORDER SETRIALIZER]: A negative price recieved.")
                raise serializers.ValidationError("Price must be non-negative.")
            return d
        except (InvalidOperation, TypeError, ValueError):
            logger.error(f"[ORDER SETRIALIZER]: An invalid price value recieved: {value}")
            raise serializers.ValidationError(f"Invalid price value: '{value}'.")
        
class CostEstimateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostEstimate
        fields = '__all__'  
           
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    cost_estimate = CostEstimateSerializer(read_only=True)
    invoice = InvoiceSerializer(read_only=True)
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    order_docs = serializers.ListField(
        child=serializers.JSONField(),
        write_only=True,
        required=True
    )
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')

    def create(self, validated_data):
        
        uploaded_files = validated_data.pop('uploaded_files', [])
        order_docs = validated_data.pop('order_docs', [])
        password = validated_data.pop('password', None) 
    
        
        user = validated_data.get('user')

        with transaction.atomic():
            
            if not user and password:
                email = validated_data.get('email')

                user = CustomUser.objects.filter(email=email).first()

                if not user:
                    name = validated_data.get('name', '')
                    parts = name.split(' ', 1)
                    first_name = parts[0]
                    last_name = parts[1] if len(parts) > 1 else ''

                    user = CustomUser.objects.create_user(
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        password=password,
                        phone_number=validated_data.get('phone_number'),
                        city=validated_data.get('city'),
                        street=validated_data.get('street'),
                        zip=validated_data.get('zip'),
                    )

                    code = generate_verification_code()
                    EmailVerification.objects.create(user=user, code=code)

                    transaction.on_commit(lambda: send_verification_code(user.email, user.first_name, user.last_name, code))

                    logger.info("[ORDER] Created new user %s with order (email=%s)", user.id, email)

                validated_data['user'] = user

            # Set guest_uuid for guest orders AND newly registered users (not yet verified)
            if not validated_data.get('user') or password:
                validated_data['guest_uuid'] = str(uuid.uuid4())
            
            order = Order.objects.create(**validated_data)
            
            logger.info("[ORDER] Order %s created in serializer (type=%s, user=%s)", order.id, order.order_type, order.user_id or "anonymous")

            for file in uploaded_files:
                File.objects.create(order=order, file=file)

            for doc in order_docs:
                if isinstance(doc, str):
                    doc = json.loads(doc)
                
                if self.context['request'].user.is_staff:
                    price = doc.get('price')
                else:
                    price = get_doc_price(doc.get('type', 'Sonstige'))
                
                Document.objects.create(
                    order=order,
                    type=doc.get("type", "Sonstige"), 
                    language=doc.get("language", "ua"),
                    price=price,
                    individual_price=doc.get("individualPrice", False),
                )
                
            if validated_data.get('payment_type') == 'rechnung':
                transaction.on_commit(lambda: async_task(create_lex_office_invoice, order.pk))

            order_email = validated_data.get('email', '')
            order_name = validated_data.get('name', '')
            order_pk = order.pk
            order_type = validated_data.get('order_type', '')
            order_total = float(order.total_price)
            transaction.on_commit(lambda: send_order_received_email(order_email, order_pk, order_name))
            transaction.on_commit(lambda: send_admin_new_order_notification(order_pk, order_name, order_email, order_type, order_total))

        return order
    
class DocumentUpdateInputSerializer(serializers.Serializer):
    id = serializers.CharField(required=False, allow_null=True)
    type = serializers.CharField(required=False, default='Sonstige')
    language = serializers.CharField(required=False, default='ua')
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    individual_price = serializers.BooleanField(required=False, default=False)

class OrderUpdateSerializer(serializers.ModelSerializer):
    documents = DocumentUpdateInputSerializer(many=True, required=False)
    class Meta:
        model = Order
        fields = ['status', 'is_new', 'order_type', 'payment_status', 'payment_type', 'documents']
        
    def update(self, instance, validated_data):

        order_docs_data = validated_data.pop('documents', None)
        old_payment_type = instance.payment_type
        new_payment_type = validated_data.get('payment_type')
        old_status = instance.status

        with transaction.atomic():

            instance = super().update(instance, validated_data)

            # Trigger invoice creation when payment_type is set to rechnung
            if new_payment_type == 'rechnung' and old_payment_type != 'rechnung' and not instance.lexoffice_id:
                transaction.on_commit(lambda: async_task(create_lex_office_invoice, instance.pk))

            # Send customer email on status change
            new_status = instance.status
            if new_status != old_status:
                customer_email = instance.email
                order_pk = instance.pk
                if new_status == Order.Status.SENT:
                    transaction.on_commit(lambda: send_order_sent_email(customer_email, order_pk))
                elif new_status == Order.Status.PICK_UP_READY:
                    transaction.on_commit(lambda: send_order_pickup_ready_email(customer_email, order_pk))
                elif new_status == Order.Status.CANCELED:
                    transaction.on_commit(lambda: send_order_canceled_email(customer_email, order_pk))

            logger.info("[ORDER] Order %s updated in serializer (status=%s, order_type=%s, payment_status=%s, payment_type=%s)", instance.id, instance.status, instance.order_type, instance.payment_status, instance.payment_type)

            # Delete docs from DB which aren't present in the request

            if order_docs_data is not None:
                
                keep_ids = []
                for d in order_docs_data:
                    did = d.get('id')
                    if isinstance(did, int):
                        keep_ids.append(did)
                    elif isinstance(did, str) and did.isdigit():
                        keep_ids.append(int(did))

                instance.documents.exclude(id__in=keep_ids).delete()
                
                # Creating docs
                
                for doc_data in order_docs_data:
                    doc_id = doc_data.get('id')
                    
                    if self.context['request'].user.is_staff:
                        price  = doc_data.get('price')
                    else:
                        price = get_doc_price(doc_data.get('type', 'Sonstige'))

                    doc_serializer = DocumentSerializer(data={
                        'order': instance.pk,
                        'price': price,
                        'individual_price': doc_data.get('individual_price', False),
                        'language': doc_data.get('language', 'ua'),
                        'type': doc_data.get('type', 'Sonstige'),
                    })
                    doc_serializer.is_valid(raise_exception=True)

                    fields = {
                        'price': doc_serializer.validated_data['price'],
                        'individual_price': doc_serializer.validated_data['individual_price'],
                        'language': doc_serializer.validated_data['language'],
                        'type': doc_serializer.validated_data['type'],
                    }

                    is_numeric = str(doc_id).isdigit() if doc_id is not None else False

                    if is_numeric:
                        Document.objects.filter(id=int(doc_id), order=instance).update(**fields)
                    else:
                        Document.objects.create(order=instance, **fields)
            
        return instance
    

class MessageSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()
    files = FileSerializer(many=True,read_only=True)
    receiver_data = UserDataSerializer(source='receiver', read_only=True)
    sender_data = UserDataSerializer(source='sender', read_only=True)
    partner_data = serializers.SerializerMethodField()
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Message
        fields = '__all__' 
        extra_kwargs = {'sender': {'required': False}}
        
    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
    
    def get_partner_data(self, obj):
        request = self.context.get('request')
        if not request:
            return None
            
        user = request.user
        
        if obj.sender_id == user.id:
            return UserDataSerializer(obj.receiver, context=self.context).data
        return UserDataSerializer(obj.sender, context=self.context).data
    
    def create(self, validated_data):
        with transaction.atomic():
            uploaded_files = validated_data.pop('uploaded_files', [])
        
            message = Message.objects.create(**validated_data)
            
            for file in uploaded_files:
                File.objects.create(message=message, file=file)
        return message
    
    
class RequestSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()
    class Meta:
        model = RequestObject
        fields = '__all__'
        
    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
    
    
class RequestAnswerSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()
    class Meta:
        model = RequestAnswer
        fields = '__all__'
        
    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
    
class ReviewSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "author_name",
            "rating",
            "original_language",
            "text",
            "review_timestamp",
            "profile_photo_url"
        ]

    def get_text(self, obj: Review):
        lang = self.context.get("lang")

        if not lang or lang == obj.original_language:
            return obj.original_text

        translations = getattr(obj, "translations", [])
        for t in translations.all():
            if t.language == lang:
                return t.translated_text

        return obj.original_text
    
class TranslateSerializer(serializers.Serializer):
    text = serializers.CharField(required=True)
    lan_to = serializers.CharField(required=True)
    
class TranslationSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()
    class Meta:
        model = Translation
        fields = "__all__"    
        
    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')