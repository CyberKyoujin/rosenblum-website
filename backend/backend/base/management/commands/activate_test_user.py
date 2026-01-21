from django.core.management.base import BaseCommand
from base.models import User


class Command(BaseCommand):
    help = 'Activate a user by email (for E2E testing)'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the user to activate')

    def handle(self, *args, **options):
        email = options['email']
        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f'User {email} activated successfully'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {email} not found'))
