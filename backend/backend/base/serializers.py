from rest_framework import serializers
from .models import CustomUser,Order,File
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


class CustomUserSerializer(serializers.ModelSerializer):
    
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)
    
    def get_image_url(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.build_absolute_uri(obj.profile_img.url)
        else:
            return obj.profile_img.url if obj.profile_img else None
    
    
class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['profile_img_url'] = user.profile_img_url
        return token

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'