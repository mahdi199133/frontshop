from django.urls import path, include
from rest_framework_nested import routers
from .views import ProductViewSet, ApplyDiscountView, WishlistViewSet, OrderViewSet, ReviewViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', OrderViewSet, basename='cart')

# Nested router for reviews under products
products_router = routers.NestedDefaultRouter(router, r'products', lookup='product')
products_router.register(r'reviews', ReviewViewSet, basename='product-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
    path('discounts/apply/', ApplyDiscountView.as_view(), name='apply-discount'),
]
