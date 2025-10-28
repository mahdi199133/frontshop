from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class BlogCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="نام دسته‌بندی")
    slug = models.SlugField(max_length=120, unique=True, blank=True, allow_unicode=True)

    class Meta:
        verbose_name = "دسته‌بندی وبلاگ"
        verbose_name_plural = "دسته‌بندی‌های وبلاگ"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DF', 'پیش‌نویس'
        PUBLISHED = 'PB', 'منتشر شده'

    title = models.CharField(max_length=255, verbose_name="عنوان")
    slug = models.SlugField(max_length=270, unique=True, blank=True, allow_unicode=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts', verbose_name="نویسنده")
    category = models.ForeignKey(BlogCategory, on_delete=models.PROTECT, related_name='posts', verbose_name="دسته‌بندی")
    content = models.TextField(verbose_name="محتوا")
    image_url = models.URLField(max_length=1024, blank=True, verbose_name="آدرس تصویر")
    status = models.CharField(max_length=2, choices=Status.choices, default=Status.DRAFT, verbose_name="وضعیت")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "پست"
        verbose_name_plural = "پست‌ها"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
