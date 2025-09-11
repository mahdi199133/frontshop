from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ApplyDiscountView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = router.urls + [
    path('discounts/apply/', ApplyDiscountView.as_view(), name='apply-discount'),
]
