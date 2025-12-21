from django.urls import path
from base.views.statistics_views import ComparisonStatsView, UserGrowthView, GeographyStatsView, OrderTypeDistributionView, OrderDynamicsView, DashboardStatsView, OrderStatusDistributionView


urlpatterns = [
    path('', DashboardStatsView.as_view(), name="basic-stats"),
    path('status-distribution/', OrderStatusDistributionView.as_view(), name="status-distribution-data"),
    path('ordering-dynamics/', OrderDynamicsView.as_view(), name="ordering-dynamics"),
    path('type-distribution/', OrderTypeDistributionView.as_view(), name="type-distribution"),
    path('customers-geography/', GeographyStatsView.as_view(), name="georgaphy-distribution"),
    path('customers-growth/', UserGrowthView.as_view(), name="customers-growth"),
    path('order-request-comparison/', ComparisonStatsView.as_view(), name="order-request-comparison"),
]
