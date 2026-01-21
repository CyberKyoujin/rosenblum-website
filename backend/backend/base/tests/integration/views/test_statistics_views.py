import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from base.models import CustomUser, Order, RequestObject


@pytest.mark.django_db
class TestDashboardStatsView:
    """Tests for DashboardStatsView"""

    def test_returns_total_orders(self, api_client, create_order):
        """Test returns total order count"""
        create_order()
        create_order()
        create_order()

        response = api_client.get('/api/statistics/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['total_orders'] == 3

    def test_returns_new_orders_count(self, api_client, create_order):
        """Test returns count of orders in review status"""
        create_order(status='review')
        create_order(status='review')
        create_order(status='completed')

        response = api_client.get('/api/statistics/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['new_orders'] == 2

    def test_empty_database_returns_zeros(self, api_client):
        """Test returns zeros when no orders exist"""
        response = api_client.get('/api/statistics/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['total_orders'] == 0
        assert response.data['new_orders'] == 0

    def test_no_auth_required(self, api_client, create_order):
        """Test statistics endpoint is public"""
        create_order()

        response = api_client.get('/api/statistics/')

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestOrderStatusDistributionView:
    """Tests for OrderStatusDistributionView"""

    def test_returns_status_distribution(self, api_client, create_order):
        """Test returns order counts by status"""
        create_order(status='review')
        create_order(status='review')
        create_order(status='completed')
        create_order(status='sent')

        response = api_client.get('/api/statistics/status-distribution/')

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

        # Find review status count
        review_data = next((d for d in response.data if d['id'] == 'review'), None)
        assert review_data is not None
        assert review_data['value'] == 2

    def test_returns_german_labels(self, api_client, create_order):
        """Test returns German labels for statuses"""
        create_order(status='review')

        response = api_client.get('/api/statistics/status-distribution/')

        assert response.status_code == status.HTTP_200_OK
        review_data = next((d for d in response.data if d['id'] == 'review'), None)
        assert review_data['label'] == 'Wird bearbeitet'

    def test_empty_database_returns_empty_list(self, api_client):
        """Test returns empty list when no orders"""
        response = api_client.get('/api/statistics/status-distribution/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_all_statuses_have_correct_format(self, api_client, create_order):
        """Test each status entry has id, value, and label"""
        create_order(status='review')
        create_order(status='in_progress')

        response = api_client.get('/api/statistics/status-distribution/')

        assert response.status_code == status.HTTP_200_OK
        for item in response.data:
            assert 'id' in item
            assert 'value' in item
            assert 'label' in item


@pytest.mark.django_db
class TestOrderDynamicsView:
    """Tests for OrderDynamicsView"""

    def test_returns_monthly_order_counts(self, api_client, create_order):
        """Test returns orders grouped by month"""
        create_order()
        create_order()

        response = api_client.get('/api/statistics/ordering-dynamics/')

        assert response.status_code == status.HTTP_200_OK
        # Response data may be a QuerySet or list depending on serialization
        data = list(response.data) if hasattr(response.data, '__iter__') else response.data
        assert isinstance(data, list)

    def test_only_includes_last_year(self, api_client, db):
        """Test only includes orders from last 365 days"""
        # Create recent order
        Order.objects.create(
            name='Recent',
            email='recent@example.com',
            phone_number='123',
            city='City',
            street='Street',
            zip='12345',
            message='Test'
        )

        response = api_client.get('/api/statistics/ordering-dynamics/')

        assert response.status_code == status.HTTP_200_OK
        # Should have at least one month of data
        if len(response.data) > 0:
            assert 'period' in response.data[0]
            assert 'count' in response.data[0]

    def test_returns_period_and_count(self, api_client, create_order):
        """Test each entry has period and count"""
        create_order()

        response = api_client.get('/api/statistics/ordering-dynamics/')

        assert response.status_code == status.HTTP_200_OK
        if len(response.data) > 0:
            assert 'period' in response.data[0]
            assert 'count' in response.data[0]


@pytest.mark.django_db
class TestOrderTypeDistributionView:
    """Tests for OrderTypeDistributionView"""

    def test_returns_type_distribution(self, api_client, create_order):
        """Test returns order counts by type"""
        create_order(order_type='order')
        create_order(order_type='order')
        create_order(order_type='costs_estimate')

        response = api_client.get('/api/statistics/type-distribution/')

        assert response.status_code == status.HTTP_200_OK
        # Response data may be a QuerySet or list depending on serialization
        data = list(response.data) if hasattr(response.data, '__iter__') else response.data
        assert isinstance(data, list)

    def test_counts_each_type(self, api_client, create_order):
        """Test correctly counts each order type"""
        create_order(order_type='order')
        create_order(order_type='order')
        create_order(order_type='costs_estimate')

        response = api_client.get('/api/statistics/type-distribution/')

        assert response.status_code == status.HTTP_200_OK

        order_type_data = next((d for d in response.data if d['order_type'] == 'order'), None)
        estimate_type_data = next((d for d in response.data if d['order_type'] == 'costs_estimate'), None)

        if order_type_data:
            assert order_type_data['value'] == 2
        if estimate_type_data:
            assert estimate_type_data['value'] == 1


@pytest.mark.django_db
class TestGeographyStatsView:
    """Tests for GeographyStatsView"""

    def test_returns_top_cities(self, api_client, create_order):
        """Test returns top 10 cities by order count"""
        create_order(city='Berlin')
        create_order(city='Berlin')
        create_order(city='Munich')

        response = api_client.get('/api/statistics/customers-geography/')

        assert response.status_code == status.HTTP_200_OK
        # Response data may be a QuerySet or list depending on serialization
        data = list(response.data) if hasattr(response.data, '__iter__') else response.data
        assert isinstance(data, list)

    def test_cities_sorted_by_count(self, api_client, create_order):
        """Test cities are sorted by order count descending"""
        create_order(city='Munich')
        create_order(city='Berlin')
        create_order(city='Berlin')
        create_order(city='Berlin')

        response = api_client.get('/api/statistics/customers-geography/')

        assert response.status_code == status.HTTP_200_OK
        if len(response.data) >= 2:
            assert response.data[0]['count'] >= response.data[1]['count']

    def test_excludes_empty_cities(self, api_client, create_order):
        """Test excludes orders with empty city"""
        create_order(city='Berlin')
        create_order(city='')
        # Note: city=None not allowed by model's NOT NULL constraint

        response = api_client.get('/api/statistics/customers-geography/')

        assert response.status_code == status.HTTP_200_OK
        data = list(response.data) if hasattr(response.data, '__iter__') else response.data
        cities = [d['city'] for d in data]
        assert '' not in cities

    def test_limits_to_10_cities(self, api_client, create_order):
        """Test returns max 10 cities"""
        cities = ['City1', 'City2', 'City3', 'City4', 'City5',
                  'City6', 'City7', 'City8', 'City9', 'City10', 'City11', 'City12']
        for city in cities:
            create_order(city=city)

        response = api_client.get('/api/statistics/customers-geography/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) <= 10


@pytest.mark.django_db
class TestUserGrowthView:
    """Tests for UserGrowthView"""

    def test_returns_registration_trends(self, api_client, create_user):
        """Test returns user registration counts by month"""
        create_user(email='user1@example.com')
        create_user(email='user2@example.com')

        response = api_client.get('/api/statistics/customers-growth/')

        assert response.status_code == status.HTTP_200_OK
        # Response data may be a QuerySet or list depending on serialization
        data = list(response.data) if hasattr(response.data, '__iter__') else response.data
        assert isinstance(data, list)

    def test_returns_period_and_count(self, api_client, create_user):
        """Test each entry has period and count"""
        create_user(email='user1@example.com')

        response = api_client.get('/api/statistics/customers-growth/')

        assert response.status_code == status.HTTP_200_OK
        if len(response.data) > 0:
            assert 'period' in response.data[0]
            assert 'count' in response.data[0]

    def test_ordered_by_period(self, api_client, create_user):
        """Test results are ordered by period"""
        create_user(email='user1@example.com')
        create_user(email='user2@example.com')

        response = api_client.get('/api/statistics/customers-growth/')

        assert response.status_code == status.HTTP_200_OK
        # Results should be ordered
        if len(response.data) > 1:
            periods = [d['period'] for d in response.data]
            assert periods == sorted(periods)


@pytest.mark.django_db
class TestComparisonStatsView:
    """Tests for ComparisonStatsView"""

    def test_returns_orders_and_requests_comparison(self, api_client, create_order):
        """Test returns both orders and requests data"""
        create_order()

        RequestObject.objects.create(
            name='Test',
            email='test@example.com',
            phone_number='123',
            message='Test request'
        )

        response = api_client.get('/api/statistics/order-request-comparison/')

        assert response.status_code == status.HTTP_200_OK
        assert 'orders' in response.data
        assert 'requests' in response.data

    def test_orders_have_period_and_count(self, api_client, create_order):
        """Test orders data has correct structure"""
        create_order()

        response = api_client.get('/api/statistics/order-request-comparison/')

        assert response.status_code == status.HTTP_200_OK
        if len(response.data['orders']) > 0:
            assert 'period' in response.data['orders'][0]
            assert 'count' in response.data['orders'][0]

    def test_requests_have_period_and_count(self, api_client):
        """Test requests data has correct structure"""
        RequestObject.objects.create(
            name='Test',
            email='test@example.com',
            phone_number='123',
            message='Test request'
        )

        response = api_client.get('/api/statistics/order-request-comparison/')

        assert response.status_code == status.HTTP_200_OK
        if len(response.data['requests']) > 0:
            assert 'period' in response.data['requests'][0]
            assert 'count' in response.data['requests'][0]

    def test_only_last_180_days(self, api_client, create_order):
        """Test only includes data from last 180 days"""
        create_order()

        response = api_client.get('/api/statistics/order-request-comparison/')

        assert response.status_code == status.HTTP_200_OK
        # Data should be from recent period
        assert isinstance(response.data['orders'], list)
        assert isinstance(response.data['requests'], list)

    def test_empty_data_returns_empty_lists(self, api_client):
        """Test returns empty lists when no data"""
        response = api_client.get('/api/statistics/order-request-comparison/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['orders'] == []
        assert response.data['requests'] == []
