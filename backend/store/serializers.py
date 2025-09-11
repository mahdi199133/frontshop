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
    category = CategorySerializer(read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    sizes = SizeSerializer(many=True, read_only=True)

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
            'image_url', # Renaming from imageUrl to match DRF conventions
            'rating',
            'review_count'
        ]

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
