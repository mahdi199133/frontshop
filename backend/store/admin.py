from django.contrib import admin
from .models import Product, Category, Color, Size, Customer, Order, OrderItem, Discount

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

class ColorAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

class SizeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'rating', 'review_count']
    list_filter = ['category']
    search_fields = ['name', 'description']
    ordering = ['-created_at']

class CustomerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'phone_number']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'unit_price', 'selected_size', 'selected_color']
    can_delete = False

class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'placed_at', 'payment_status', 'discount']
    list_filter = ['payment_status', 'placed_at']
    inlines = [OrderItemInline]
    ordering = ['-placed_at']
    readonly_fields = ['customer', 'placed_at', 'discount']

class DiscountAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'discount_type', 'value', 'is_active']
    list_filter = ['is_active', 'discount_type']
    search_fields = ['code', 'description']

# Register models with the admin site
admin.site.register(Category, CategoryAdmin)
admin.site.register(Color, ColorAdmin)
admin.site.register(Size, SizeAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Discount, DiscountAdmin)
