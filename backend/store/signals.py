from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review, Product

@receiver(post_save, sender=Review)
def update_product_rating_on_save(sender, instance, **kwargs):
    """
    Update the product's average rating and review count when a review is saved.
    """
    product = instance.product
    reviews = Review.objects.filter(product=product)

    product.rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    product.review_count = reviews.aggregate(Count('id'))['id__count']
    product.save()

@receiver(post_delete, sender=Review)
def update_product_rating_on_delete(sender, instance, **kwargs):
    """
    Update the product's average rating and review count when a review is deleted.
    """
    product = instance.product
    reviews = Review.objects.filter(product=product)

    product.rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    product.review_count = reviews.aggregate(Count('id'))['id__count']
    product.save()
