from django.core.management.base import BaseCommand, CommandError
from base.models import Order
from base.services.tasks import create_lex_office_invoice

class Command(BaseCommand):
    help = 'Creates an invoice in LexOffice for a given order ID'

    def add_arguments(self, parser):
        parser.add_argument('order_id', type=int, help='Order ID for which to create the invoice')

    def handle(self, *args, **options):
        order_id = options['order_id']

        try:
            order = Order.objects.get(pk=order_id)
            self.stdout.write(self.style.SUCCESS(f'Order #{order_id} found. Sending to LexOffice...'))

            result = create_lex_office_invoice(order.id)

            self.stdout.write(
                self.style.SUCCESS(f'Success! Invoice created. ID in LexOffice: {result.get("id")}')
            )

        except Order.DoesNotExist:
            raise CommandError(f'Order with ID {order_id} not found in database.')
        
        except Exception as e:
            raise CommandError(f'Error calling LexOffice API: {str(e)}')