from rest_framework.routers import DefaultRouter
from .views import PostViewSet, BlogCategoryViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'categories', BlogCategoryViewSet, basename='blog-category')

urlpatterns = router.urls
