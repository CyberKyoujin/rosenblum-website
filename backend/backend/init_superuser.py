import os
import django

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import CustomUser
from django.contrib.auth.hashers import make_password

username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')

if not CustomUser.objects.filter(username=username).exists():
    CustomUser.objects.create(
        username=username,
        email=email,
        password=make_password(password),
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    print(f'Superuser {username} created')
else:
    print(f'Superuser {username} already exists')