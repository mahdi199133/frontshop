from rest_framework import serializers
from .models import Post, BlogCategory

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'author',
            'category',
            'content',
            'image_url',
            'status',
            'created_at',
            'updated_at'
        ]
        lookup_field = 'slug'
