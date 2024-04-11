from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager


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

    def __str__(self):
        return f'Order number {self.pk}'


class File(models.Model):
    order = models.ForeignKey(Order,models.CASCADE, related_name='files')
    file = models.FileField(upload_to='files/')
    file_name = models.CharField(max_length=255, blank=True)  
    file_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  

    def save(self, *args, **kwargs):
        self.file_name = self.file.name
        self.file_size = self.file.size / (1024 * 1024)  
        super(File, self).save(*args, **kwargs)

    def __str__(self):
        return f'File {self.pk} to {self.order}'



