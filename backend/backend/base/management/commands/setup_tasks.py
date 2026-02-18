from django.core.management.base import BaseCommand
from django_q.models import Schedule
from django.utils import timezone

class Command(BaseCommand):
    help = 'Sets up scheduled tasks for the application'

    def handle(self, *args, **kwargs):
        # Create or update the schedule for syncing Google reviews hourly
        
        func_path = 'base.services.google_reviews.sync_google_reviews'
        
        schedule, created = Schedule.objects.update_or_create(
            func=func_path,
            defaults={
                'name': "Sync Google Reviews Hourly",
                'schedule_type': Schedule.HOURLY,
                'repeats': -1,
                'next_run': timezone.now(),
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Scheduled task created: {func_path}'))
        else:
            self.stdout.write(self.style.WARNING(f'Scheduled task already exists: {func_path}'))