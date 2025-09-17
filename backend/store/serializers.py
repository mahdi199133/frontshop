from rest_framework import serializers
from .models import Product, Category, Color, Size, Discount, Wishlist, Order, OrderItem, Review

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    # To match the simple string format of the mock API
    category = serializers.StringRelatedField(read_only=True)
    # To return a list of strings, e.g., ["آبی", "مشکی"]
    colors = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'colors',
            'sizes',
            'image_url',
            'rating',
            'review_count'
        ]

    def get_colors(self, obj):
        return [color.name for color in obj.colors.all()]

    def get_sizes(self, obj):
        return [size.name for size in obj.sizes.all()]

    def to_representation(self, instance):
        """
        Convert `image_url` to `imageUrl` to match the frontend's expected camelCase format.
        """
        representation = super().to_representation(instance)
        representation['imageUrl'] = representation.pop('image_url')
        representation['reviewCount'] = representation.pop('review_count')
        # DRF DecimalField serializes to string. Convert to float or int for frontend if needed.
        # For now, string is fine as JS can parse it.
        # representation['price'] = float(representation['price'])
        return representation

# --- Serializers for Discount Logic ---

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['code', 'description', 'discount_type', 'value']

class CartItemValidationSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class DiscountApplySerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    cart = CartItemValidationSerializer(many=True)

# --- Serializers for Wishlist ---

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'updated_at']
        read_only_fields = ['user']

# --- Serializers for Cart/Order ---

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'selected_size', 'selected_color']
        read_only_fields = ['unit_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'customer', 'placed_at', 'payment_status', 'discount', 'items', 'total_price']
        read_only_fields = ['customer', 'placed_at', 'payment_status', 'discount']

    def get_total_price(self, order):
        return sum(item.unit_price * item.quantity for item in order.items.all())

# --- Serializer for Reviews ---

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        product_id = self.context['product_id']
        user = self.context['request'].user

        # Check if the user has already reviewed this product
        if Review.objects.filter(product_id=product_id, user=user).exists():
            raise serializers.ValidationError('شما قبلاً برای این محصول نظر ثبت کرده‌اید.')

        return Review.objects.create(product_id=product_id, user=user, **validated_data)
