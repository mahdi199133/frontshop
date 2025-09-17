import decimal
from django.utils import timezone
import decimal
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Product, Discount, Wishlist, Order, OrderItem, Customer
from .filters import ProductFilter
from .serializers import (
    ProductSerializer, DiscountApplySerializer, DiscountSerializer,
    WishlistSerializer, OrderSerializer, OrderItemSerializer
)

class ProductViewSet(ReadOnlyModelViewSet):
    """
    API endpoint that allows products to be viewed.
    Provides `list` and `retrieve` actions.
    Supports filtering by category, price, and name, and ordering by price and rating.
    """
    queryset = Product.objects.select_related('category').prefetch_related('colors', 'sizes').all()
    serializer_class = ProductSerializer
    filterset_class = ProductFilter
    ordering_fields = ['price', 'rating']

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        """
        Returns a list of recommended products based on the category of the current product.
        """
        product = self.get_object()
        # Optimized query with prefetching
        recommended_products = Product.objects.filter(category=product.category) \
            .exclude(id=product.id) \
            .select_related('category') \
            .prefetch_related('colors', 'sizes') \
            .order_by('-rating', '-created_at')[:5]

        serializer = self.get_serializer(recommended_products, many=True)
        return Response(serializer.data)

class WishlistViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the user's wishlist.
    """
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return the wishlist for the currently authenticated user,
        with products and their related fields prefetched to avoid N+1 queries.
        """
        user = self.request.user
        # Ensure the user has a wishlist.
        Wishlist.objects.get_or_create(user=user)

        return Wishlist.objects.filter(user=user).prefetch_related(
            'products__category',
            'products__colors',
            'products__sizes'
        )

    def perform_create(self, serializer):
        # Link the wishlist to the current user
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='products')
    def add_product(self, request):
        """
        Add a product to the user's wishlist.
        """
        user = request.user
        wishlist, _ = Wishlist.objects.get_or_create(user=user)

        try:
            product = Product.objects.get(id=request.data.get('product_id'))
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        wishlist.products.add(product)
        return Response(self.get_serializer(wishlist).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='products/(?P<product_id>[^/.]+)')
    def remove_product(self, request, product_id=None):
        """
        Remove a product from the user's wishlist.
        """
        user = request.user
        wishlist, _ = Wishlist.objects.get_or_create(user=user)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        if product in wishlist.products.all():
            wishlist.products.remove(product)
            return Response(self.get_serializer(wishlist).data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Product not in wishlist.'}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the user's cart, which is represented as a pending Order.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return orders for the currently authenticated user.
        Prefetches related items and product details to avoid N+1 queries.
        """
        user = self.request.user
        return Order.objects.filter(customer__user=user).prefetch_related(
            'items__product__category',
            'items__product__colors',
            'items__product__sizes',
            'discount'
        )

    def get_object(self):
        """
        Gets the user's active cart (pending order). Creates one if it doesn't exist.
        """
        user = self.request.user
        customer, _ = Customer.objects.get_or_create(user=user)
        cart, created = Order.objects.get_or_create(
            customer=customer,
            payment_status=Order.PAYMENT_STATUS_PENDING
        )
        return cart

    @action(detail=False, methods=['get'], url_path='cart')
    def get_cart(self, request):
        """
        Retrieve the current user's active cart.
        """
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='cart/items')
    def add_item_to_cart(self, request):
        cart = self.get_object()
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']

            # Check if item exists to update quantity, or create new
            order_item, created = OrderItem.objects.get_or_create(
                order=cart,
                product=product,
                selected_size=serializer.validated_data.get('selected_size'),
                selected_color=serializer.validated_data.get('selected_color'),
                defaults={'quantity': quantity, 'unit_price': product.price}
            )

            if not created:
                order_item.quantity += quantity
                order_item.save()

            cart_serializer = self.get_serializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='items/(?P<item_id>[^/.]+)')
    def update_cart_item(self, request, pk=None, item_id=None):
        try:
            item = OrderItem.objects.get(id=item_id, order__customer__user=request.user)
            new_quantity = request.data.get('quantity')
            if new_quantity is None or not isinstance(new_quantity, int) or new_quantity <= 0:
                return Response({'error': 'Invalid quantity provided.'}, status=status.HTTP_400_BAD_REQUEST)

            item.quantity = new_quantity
            item.save()

            # Return the entire updated cart
            cart = self.get_object()
            serializer = self.get_serializer(cart)
            return Response(serializer.data)
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], url_path='items/(?P<item_id>[^/.]+)')
    def remove_cart_item(self, request, pk=None, item_id=None):
        try:
            item = OrderItem.objects.get(id=item_id, order__customer__user=request.user)
            cart = item.order
            item.delete()

            # Return the entire updated cart
            # We must refetch the cart object to get the updated state
            cart = self.get_queryset().get(id=cart.id)
            serializer = self.get_serializer(cart)
            return Response(serializer.data)
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)


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
            # Prefetch related targets to avoid queries in the loop
            discount = Discount.objects.prefetch_related(
                'target_products', 'target_categories'
            ).get(code__iexact=code, is_active=True)
        except Discount.DoesNotExist:
            return Response({'error': 'کد تخفیف نامعتبر یا منقضی شده است.'}, status=status.HTTP_404_NOT_FOUND)

        # Check validity period
        now = timezone.now()
        if (discount.valid_from and now < discount.valid_from) or \
           (discount.valid_to and now > discount.valid_to):
            return Response({'error': 'کد تخفیف در این بازه زمانی معتبر نیست.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Calculate cart total and check applicability ---

        product_ids = [item['product_id'] for item in cart_items]
        # Also select_related category for checking against discount targets
        products_in_cart = Product.objects.select_related('category').in_bulk(product_ids)

        total_price = decimal.Decimal(0)
        applicable_items_price = decimal.Decimal(0)

        # Create sets of target IDs for fast, in-memory lookups
        target_product_ids = set(discount.target_products.values_list('id', flat=True))
        target_category_ids = set(discount.target_categories.values_list('id', flat=True))
        has_specific_targets = bool(target_product_ids or target_category_ids)

        for item in cart_items:
            product = products_in_cart.get(item['product_id'])
            if not product:
                return Response({'error': f'محصول با شناسه {item["product_id"]} یافت نشد.'}, status=status.HTTP_400_BAD_REQUEST)

            item_total = product.price * item['quantity']
            total_price += item_total

            # Efficiently check if this item is eligible for the discount
            is_eligible = False
            if not has_specific_targets:
                is_eligible = True
            else:
                if product.id in target_product_ids or product.category.id in target_category_ids:
                    is_eligible = True

            if is_eligible:
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
