from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ApplyDiscountView, WishlistViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', OrderViewSet, basename='cart')


urlpatterns = router.urls + [
    path('discounts/apply/', ApplyDiscountView.as_view(), name='apply-discount'),
]
