from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        
        queryset = self.page.paginator.object_list
        
        return Response({
            'count': self.page.paginator.count, 
            'new_count': queryset.filter(is_new=True).count(), 
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })