import random
import uuid
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from base.models import Order, RequestObject, Review

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with test data for statistics'

    def handle(self, *args, **kwargs):
        self.stdout.write("Generating test data...")

        ORDERS_COUNT = 100
        REQUESTS_COUNT = 300
        USERS_COUNT = 50
        DAYS_BACK = 156  

        cities = ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Dusseldorf", "Leipzig"]
        streets = ["Hauptstr.", "Bahnhofstr.", "Berliner Str.", "Schulstr.", "Gartenstr."]
        
        users = []
        self.stdout.write("Creating users...")
        for i in range(USERS_COUNT):
            email = f"user{i}_{uuid.uuid4().hex[:4]}@example.com"
            user = User(
                email=email,
                first_name=f"User{i}",
                last_name="Test",
                is_active=True,
                date_joined=timezone.now() - timedelta(days=random.randint(0, DAYS_BACK))
            )
            users.append(user)
        
        User.objects.bulk_create(users, ignore_conflicts=True)
        all_users = list(User.objects.all())

        self.stdout.write("Creating orders...")
        orders_batch = []
        statuses = [Order.Status.COMPLETED] * 50 + [Order.Status.IN_PROGRESS] * 30 + [Order.Status.REVIEW] * 10 + [Order.Status.CANCELED] * 5
        types = [Order.OrderType.ORDER] * 70 + [Order.OrderType.COSTS_ESTIMATE] * 30

        for i in range(ORDERS_COUNT):
            created_date = timezone.now() - timedelta(days=random.randint(0, DAYS_BACK))
            
            order = Order(
                user=random.choice(all_users) if random.random() > 0.7 else None,
                name=f"Customer {i}",
                email=f"customer{i}@test.com",
                phone_number=f"+4912345{i:05d}",
                city=random.choice(cities),
                street=random.choice(streets),
                zip=f"{random.randint(10000, 99999)}",
                message="This is a generated test order.",
                status=random.choice(statuses),
                order_type=random.choice(types),
                new=random.choice([True, False]),
                timestamp=created_date, 
                date=created_date.date()
            )
            orders_batch.append(order)
        
        Order.objects.bulk_create(orders_batch)

        self.stdout.write("Creating requests...")
        requests_batch = []
        for i in range(REQUESTS_COUNT):
            created_date = timezone.now() - timedelta(days=random.randint(0, DAYS_BACK))
            req = RequestObject(
                name=f"Requester {i}",
                email=f"request{i}@test.com",
                phone_number=f"+4998765{i:05d}",
                message="I have a question about translation.",
                timestamp=created_date
            )
            requests_batch.append(req)
        
        RequestObject.objects.bulk_create(requests_batch)

        self.stdout.write("Fixing timestamps (bypassing auto_now_add)...")

        created_orders = Order.objects.order_by('-id')[:ORDERS_COUNT]
        for order in created_orders:
            random_days = random.randint(0, DAYS_BACK)
            random_date = timezone.now() - timedelta(days=random_days)
            Order.objects.filter(pk=order.pk).update(timestamp=random_date, date=random_date.date())

        created_requests = RequestObject.objects.order_by('-id')[:REQUESTS_COUNT]
        for req in created_requests:
            random_days = random.randint(0, DAYS_BACK)
            random_date = timezone.now() - timedelta(days=random_days)
            RequestObject.objects.filter(pk=req.pk).update(timestamp=random_date)

        self.stdout.write(self.style.SUCCESS(f'Successfully created and fixed dates for {ORDERS_COUNT} orders, {REQUESTS_COUNT} requests.'))