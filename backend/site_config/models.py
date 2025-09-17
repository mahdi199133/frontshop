from django.db import models
from django.core.exceptions import ValidationError

class SiteConfiguration(models.Model):
    store_name = models.CharField(max_length=255, default="فروشگاه من")
    logo = models.ImageField(upload_to='logos/', blank=True, null=True, help_text="لوگوی فروشگاه")
    contact_email = models.EmailField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    # Social Media Links
    instagram_url = models.URLField(blank=True)
    telegram_url = models.URLField(blank=True)

    # Theming
    primary_color = models.CharField(max_length=7, default="#6366f1", help_text="رنگ اصلی (فرمت هگز)")

    class Meta:
        verbose_name = "پیکربندی سایت"
        verbose_name_plural = "پیکربندی سایت"

    def __str__(self):
        return "پیکربندی سایت"

    def save(self, *args, **kwargs):
        if not self.pk and SiteConfiguration.objects.exists():
            # If you are trying to create a new one and one already exists
            raise ValidationError('فقط یک نمونه از پیکربندی سایت می‌تواند وجود داشته باشد.')
        return super(SiteConfiguration, self).save(*args, **kwargs)
