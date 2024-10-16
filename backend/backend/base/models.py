from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email + ", Name: " + self.first_name + self.last_name
    
        
    
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
    

    def save(self, *args, **kwargs):
      
        super(Message, self).save(*args, **kwargs)

        if kwargs.get('created', True):
            send_mail(
                subject='Sie haben eine neue Nachricht!',
                message=f"""Eine neue Nachricht wurde für Sie zugestellt. 
Die Nachricht können Sie unter dem folgenden Link finden: http://localhost:5173/messages""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.receiver.email],
                fail_silently=False,
            )


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
        

class Request(models.Model):
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
    
    def save(self, *args, **kwargs):
      
        super(Request, self).save(*args, **kwargs)

        if kwargs.get('created', True):
            send_mail(
                subject='Bestätigung Ihrer Anfrage',
                message=f"""Sie haben eine Anfrage für uns gelassen! 
                
Name: {self.name}
Telefonnumer: {self.phone_number}
Datum und Uhrzeit : {self.formatted_timestamp()}
Ihre Anfrage: {self.message}

Mit freundlichen Grüßen, Team Rosenblum.""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.email],
                fail_silently=False,
            )
    