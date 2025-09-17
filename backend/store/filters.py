import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    # Filter for price less than or equal to the given value
    price__lte = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    # Filter for price greater than or equal to the given value
    price__gte = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    # Filter for name containing the given value (case-insensitive)
    name__icontains = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Product
        fields = ['category', 'price__lte', 'price__gte', 'name__icontains']
