from rest_framework import serializers
from .models import Product, Category, Color, Size, Discount

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
