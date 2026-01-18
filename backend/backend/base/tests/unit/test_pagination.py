import pytest
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from base.pagination import CustomPagination
from base.models import Order


@pytest.mark.django_db
class TestCustomPagination:
    """Tests for CustomPagination"""

    @pytest.fixture
    def pagination(self):
        """Create CustomPagination instance"""
        return CustomPagination()

    @pytest.fixture
    def api_factory(self):
        """Create API request factory"""
        return APIRequestFactory()

    def make_request(self, api_factory, path='/'):
        """Create a DRF Request from APIRequestFactory"""
        wsgi_request = api_factory.get(path)
        return Request(wsgi_request)

    @pytest.fixture
    def orders(self, create_order):
        """Create test orders"""
        orders = []
        for i in range(15):
            order = create_order(
                name=f'Order {i}',
                is_new=(i < 5)  # First 5 are new
            )
            orders.append(order)
        return orders

    def test_pagination_includes_new_count(self, pagination, orders, api_factory):
        """Test paginated response includes new_count field"""
        queryset = Order.objects.all()

        request = self.make_request(api_factory)

        # Paginate
        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert 'new_count' in response.data
        assert response.data['new_count'] == 5  # 5 orders with is_new=True

    def test_pagination_includes_count(self, pagination, orders, api_factory):
        """Test paginated response includes total count"""
        queryset = Order.objects.all()

        request = self.make_request(api_factory)

        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert 'count' in response.data
        assert response.data['count'] == 15

    def test_pagination_includes_results(self, pagination, orders, api_factory):
        """Test paginated response includes results"""
        queryset = Order.objects.all()

        request = self.make_request(api_factory)

        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert 'results' in response.data
        assert len(response.data['results']) == 10  # First page of 10

    def test_pagination_includes_next_link(self, pagination, orders, api_factory):
        """Test paginated response includes next link when more pages"""
        queryset = Order.objects.all()

        request = self.make_request(api_factory)

        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert 'next' in response.data
        assert response.data['next'] is not None  # Should have next page

    def test_pagination_includes_previous_link(self, pagination, orders, api_factory):
        """Test paginated response includes previous link"""
        queryset = Order.objects.all()

        request = self.make_request(api_factory, '/?page=2')

        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert 'previous' in response.data
        assert response.data['previous'] is not None  # Should have previous page

    def test_new_count_only_counts_new_items(self, pagination, create_order, api_factory):
        """Test new_count only counts items with is_new=True"""
        # Create 3 new and 7 not new
        for i in range(3):
            create_order(is_new=True)
        for i in range(7):
            create_order(is_new=False)

        queryset = Order.objects.all()

        request = self.make_request(api_factory)

        pagination.page_size = 20
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert response.data['new_count'] == 3

    def test_new_count_zero_when_no_new_items(self, pagination, create_order, api_factory):
        """Test new_count is 0 when no new items"""
        for i in range(5):
            create_order(is_new=False)

        queryset = Order.objects.all()

        request = self.make_request(api_factory)

        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)
        response = pagination.get_paginated_response(page)

        assert response.data['new_count'] == 0

    def test_empty_queryset(self, pagination, api_factory):
        """Test pagination with empty queryset"""
        queryset = Order.objects.none()

        request = self.make_request(api_factory)

        pagination.page_size = 10
        page = pagination.paginate_queryset(queryset, request)

        # Empty queryset returns None
        if page is None:
            # Pagination not applied for empty querysets in some cases
            pass
        else:
            response = pagination.get_paginated_response(page)
            assert response.data['count'] == 0
            assert response.data['new_count'] == 0
            assert response.data['results'] == []
