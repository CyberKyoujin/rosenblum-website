from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be provided')
        extra_fields.setdefault('username', None) 
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('username', None) 
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(email, password=password, **extra_fields)
    
class CustomUser(AbstractUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, null=True, blank=True)
    phone_number = models.CharField(max_length=12,null=True,blank=True)
    city = models.CharField(max_length=264,null=True,blank=True)
    street = models.CharField(max_length=264,null=True,blank=True)
    zip = models.CharField(max_length=264,null=True,blank=True)
    profile_img = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    profile_img_url = models.CharField(max_length=100, null=True, blank=True)
    
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email + ", Name: " + self.first_name + self.last_name
    

class EmailVerification(models.Model):
    user = models.OneToOneField(CustomUser, models.CASCADE)
    code = models.CharField(max_length=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    
    @property
    def expiration_date(self):
        return self.created_at + timedelta(minutes=15)
    
    def is_expired(self):
        return timezone.now() > self.expiration_date

    
class Order(models.Model):
    user = models.ForeignKey(CustomUser,models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length = 264)
    email = models.EmailField(max_length = 264)
    phone_number = models.CharField(max_length=12)
    city = models.CharField(max_length = 264)
    date = models.DateField(null=True,blank=True, auto_now_add = True)
    street = models.CharField(max_length = 264)
    zip = models.CharField(max_length = 10)
    message = models.CharField(max_length = 1000)
    status = models.CharField(max_length=40, default='review')
    timestamp = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    new = models.BooleanField(default=True, null=True, blank=True)

    def __str__(self):
        return f'Order number {self.pk}'
    
    def formatted_timestamp(self) -> str:
        local_timestamp = timezone.localtime(self.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
    
class Message(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='sent_messages', on_delete=models.CASCADE, blank=True, null=True)
    receiver = models.ForeignKey(CustomUser, related_name='received_messages', on_delete=models.CASCADE, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    viewed = models.BooleanField(default=False)
    
    def formatted_timestamp(self) -> str:
        local_timestamp = timezone.localtime(self.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')

class File(models.Model):
    order = models.ForeignKey(Order,models.CASCADE, related_name='files', blank=True, null=True)
    message = models.ForeignKey(Message, models.CASCADE, related_name='files', blank=True, null=True)
    file = models.FileField(upload_to='files/')
    file_name = models.CharField(max_length=255, blank=True)  
    file_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  

    def save(self, *args, **kwargs):
        self.file_name = self.file.name
        self.file_size = self.file.size / (1024 * 1024)  
        super(File, self).save(*args, **kwargs)

    def __str__(self):
        if self.order:
            return f'File {self.pk} to {self.order}'
        else: 
            return f'File {self.pk} to {self.message}'
        
class RequestObject(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    def formatted_timestamp(self) -> str:
        local_timestamp = timezone.localtime(self.timestamp)
        return local_timestamp.strftime('%d.%m.%Y %H:%M')
    
    def __str__(self):
        return f'Request number {self.pk} of {self.name}, time: {self.formatted_timestamp()}'

class Review(models.Model):
    google_review_id = models.CharField(max_length=255, unique=True)
    place_id = models.CharField(max_length=255)  
    author_name = models.CharField(max_length=255)
    profile_photo_url = models.URLField(blank=True, null=True)

    rating = models.PositiveSmallIntegerField()
    original_language = models.CharField(max_length=10)  # 'en', 'de', 'ru', 'uk', ...
    original_text = models.TextField()

    review_timestamp = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
        
    class Meta:
        ordering = ['-review_timestamp']
            
    def __str__(self):
        return f"{self.author_name} ({self.rating})"
          
class ReviewTranslation(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='translations')
    
    language = models.CharField(max_length=10) 
    translated_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('review', 'language')

    def __str__(self):
        return f"{self.review_id} -> {self.language}"
    
