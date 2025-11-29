from rest_framework import serializers
from .models import CustomUser,Order,File, Message, RequestObject, Review, EmailVerification
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from django.utils import timezone
from .models import Order
from base.services.email_verification import send_verification_code
from django.db import transaction
from rest_framework import exceptions


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
            verification_code = send_verification_code(user.email, user.first_name, user.last_name)
            EmailVerification.objects.create(user=user, code=verification_code)
        
        return user
     
    def update(self, instance, validated_data):
        profile_img = validated_data.get('profile_img')
        if 'profile_img' in validated_data:
            if profile_img is not None:
                instance.profile_img = profile_img
            else:
                instance.profile_img.delete(save=False)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.city = validated_data.get('city', instance.city)
        instance.street = validated_data.get('street', instance.street)
        instance.zip = validated_data.get('zip', instance.zip)
        instance.save()
        return instance
    
    def get_image_url(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.build_absolute_uri(obj.profile_img.url)
        else:
            return obj.profile_img.url if obj.profile_img else None
        
    def get_orders(self, obj):
        return Order.objects.filter(user=obj).count()
        
class UserDataSerializer(serializers.ModelSerializer):
    
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['date_joined', 'phone_number', 'city', 'street', 'zip', 'image_url']
        
    def get_image_url(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.build_absolute_uri(obj.profile_img.url)
        else:
            return obj.profile_img.url if obj.profile_img else None

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
        
        
class OrderSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True,read_only=True)
    formatted_timestamp = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = '__all__'
        
    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
        

class MessageSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()
    files = FileSerializer(many=True,read_only=True)
    class Meta:
        model = Message
        fields = '__all__' 
        
    def get_formatted_timestamp(self, obj):
        local_timestamp = timezone.localtime(obj.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
    

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestObject
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