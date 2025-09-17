from rest_framework import viewsets
from .models import Post, BlogCategory
from .serializers import PostSerializer, BlogCategorySerializer

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing blog posts.
    Only published posts are visible to the public.
    """
    queryset = Post.objects.filter(status=Post.Status.PUBLISHED)
    serializer_class = PostSerializer
    lookup_field = 'slug'

class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing blog categories.
    """
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    lookup_field = 'slug'
