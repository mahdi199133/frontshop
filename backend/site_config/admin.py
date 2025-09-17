from django.contrib import admin
from .models import SiteConfiguration

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'contact_email', 'phone_number')

    # Prevent adding more than one configuration
    def has_add_permission(self, request):
        return not SiteConfiguration.objects.exists()
