from django.contrib import admin
from .models import (
    Category,
    Color,
    Size,
    Product,
    Customer,
    Order,
    OrderItem,
    Discount,
    Review,
    Wishlist
)

# Custom Admin for Product
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'rating', 'review_count', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    readonly_fields = ('rating', 'review_count', 'created_at', 'updated_at')

# Simple registration for other models
admin.site.register(Category)
admin.site.register(Color)
admin.site.register(Size)
admin.site.register(Customer)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    # Fields to display for each inline item
    fields = ('product', 'quantity', 'unit_price', 'selected_size', 'selected_color')
    readonly_fields = ('product', 'unit_price', 'selected_size', 'selected_color')
    extra = 0 # Don't show extra empty forms
    can_delete = False # Usually we don't want to delete order items from the admin

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'payment_status', 'placed_at', 'discount')
    list_filter = ('payment_status', 'placed_at')
    search_fields = ('customer__user__username', 'id')
    readonly_fields = ('placed_at',)
    inlines = [OrderItemInline]

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'is_active', 'valid_from', 'valid_to')
    list_filter = ('is_active', 'discount_type')
    search_fields = ('code',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__name', 'user__username', 'comment')
    readonly_fields = ('created_at',)

admin.site.register(Wishlist)
