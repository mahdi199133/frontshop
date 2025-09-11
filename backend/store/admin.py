from django.contrib import admin
from .models import Product, Category, Color, Size, Customer, Order, OrderItem, Discount

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'rating', 'review_count']
    list_filter = ['category']
    search_fields = ['name', 'description']
    ordering = ['-created_at']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'phone_number']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'unit_price', 'selected_size', 'selected_color']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'placed_at', 'payment_status', 'discount']
    list_filter = ['payment_status', 'placed_at']
    inlines = [OrderItemInline]
    ordering = ['-placed_at']

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'discount_type', 'value', 'is_active']
    list_filter = ['is_active', 'discount_type']
    search_fields = ['code', 'description']
