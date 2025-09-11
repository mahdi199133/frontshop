import decimal
from django.utils import timezone
import decimal
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.pagination import PageNumberPagination
from .models import Product, Discount
from .serializers import ProductSerializer, DiscountApplySerializer, DiscountSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(ReadOnlyModelViewSet):
    """
    API endpoint that allows products to be viewed.
    Provides `list` and `retrieve` actions.
    """
    queryset = Product.objects.select_related('category').prefetch_related('colors', 'sizes').all()
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        """
        Returns a list of recommended products based on the category of the current product.
        """
        product = self.get_object()
        recommended_products = Product.objects.filter(category=product.category) \
            .exclude(id=product.id) \
            .order_by('-rating', '-created_at')[:5]

        serializer = self.get_serializer(recommended_products, many=True)
        return Response(serializer.data)

class ApplyDiscountView(APIView):
    """
    Validates and applies a discount code to a given cart.
    """
    def post(self, request, *args, **kwargs):
        serializer = DiscountApplySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data['code']
        cart_items = serializer.validated_data['cart']

        try:
            discount = Discount.objects.get(code__iexact=code, is_active=True)
        except Discount.DoesNotExist:
            return Response({'error': 'کد تخفیف نامعتبر یا منقضی شده است.'}, status=status.HTTP_404_NOT_FOUND)

        # Check validity period
        now = timezone.now()
        if (discount.valid_from and now < discount.valid_from) or \
           (discount.valid_to and now > discount.valid_to):
            return Response({'error': 'کد تخفیف در این بازه زمانی معتبر نیست.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Calculate cart total and check applicability ---

        product_ids = [item['product_id'] for item in cart_items]
        products_in_cart = Product.objects.in_bulk(product_ids)

        total_price = decimal.Decimal(0)
        applicable_items_price = decimal.Decimal(0)

        for item in cart_items:
            product = products_in_cart.get(item['product_id'])
            if not product:
                return Response({'error': f'محصول با شناسه {item["product_id"]} یافت نشد.'}, status=status.HTTP_400_BAD_REQUEST)

            item_total = product.price * item['quantity']
            total_price += item_total

            # Check if this item is eligible for the discount
            is_product_targeted = discount.target_products.exists() and product in discount.target_products.all()
            is_category_targeted = discount.target_categories.exists() and product.category in discount.target_categories.all()

            # If the discount has targets, the item must match one of them
            if discount.target_products.exists() or discount.target_categories.exists():
                if is_product_targeted or is_category_targeted:
                    applicable_items_price += item_total
            else: # No specific targets, applies to all items
                applicable_items_price += item_total

        if total_price < discount.min_purchase_amount:
            return Response({'error': f'حداقل مبلغ خرید برای اعمال این تخفیف {discount.min_purchase_amount} تومان است.'}, status=status.HTTP_400_BAD_REQUEST)

        if applicable_items_price == 0:
            return Response({'error': 'این کد تخفیف برای محصولات موجود در سبد خرید شما معتبر نیست.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Calculate discount ---
        discount_amount = decimal.Decimal(0)
        if discount.discount_type == Discount.DISCOUNT_TYPE_PERCENT:
            discount_amount = (applicable_items_price * discount.value) / 100
        elif discount.discount_type == Discount.DISCOUNT_TYPE_FIXED:
            # Cannot discount more than the applicable price
            discount_amount = min(decimal.Decimal(discount.value), applicable_items_price)

        final_price = total_price - discount_amount

        return Response({
            'original_price': total_price,
            'discount_applied': DiscountSerializer(discount).data,
            'discount_amount': discount_amount,
            'final_price': final_price,
        }, status=status.HTTP_200_OK)
