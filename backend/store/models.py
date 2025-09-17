from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام دسته بندی")

    class Meta:
        verbose_name = "دسته بندی"
        verbose_name_plural = "دسته بندی ها"

    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=50, verbose_name="نام رنگ")

    class Meta:
        verbose_name = "رنگ"
        verbose_name_plural = "رنگ ها"

    def __str__(self):
        return self.name

class Size(models.Model):
    name = models.CharField(max_length=50, verbose_name="سایز")

    class Meta:
        verbose_name = "سایز"
        verbose_name_plural = "سایز ها"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name="نام محصول")
    description = models.TextField(verbose_name="توضیحات")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="قیمت")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products', verbose_name="دسته بندی")
    colors = models.ManyToManyField(Color, related_name='products', verbose_name="رنگ ها")
    sizes = models.ManyToManyField(Size, related_name='products', verbose_name="سایز ها")
    image_url = models.URLField(max_length=1024, verbose_name="آدرس تصویر")
    rating = models.FloatField(default=0, verbose_name="امتیاز")
    review_count = models.PositiveIntegerField(default=0, verbose_name="تعداد نظرات")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="کاربر")
    phone_number = models.CharField(max_length=15, blank=True, verbose_name="شماره تلفن")

    class Meta:
        verbose_name = "مشتری"
        verbose_name_plural = "مشتریان"

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Order(models.Model):
    PAYMENT_STATUS_PENDING = 'P'
    PAYMENT_STATUS_COMPLETE = 'C'
    PAYMENT_STATUS_FAILED = 'F'

    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, 'در انتظار پرداخت'),
        (PAYMENT_STATUS_COMPLETE, 'تکمیل شده'),
        (PAYMENT_STATUS_FAILED, 'ناموفق'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, verbose_name="مشتری")
    placed_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت سفارش")
    payment_status = models.CharField(max_length=1, choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_STATUS_PENDING, verbose_name="وضعیت پرداخت")

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارشات"
        ordering = ['-placed_at']

    discount = models.ForeignKey('Discount', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders', verbose_name="تخفیف اعمال شده")

    def __str__(self):
        return f"سفارش {self.id} توسط {self.customer}"

class Discount(models.Model):
    DISCOUNT_TYPE_PERCENT = 'P'
    DISCOUNT_TYPE_FIXED = 'F'
    DISCOUNT_TYPE_CHOICES = [
        (DISCOUNT_TYPE_PERCENT, 'درصدی'),
        (DISCOUNT_TYPE_FIXED, 'مبلغ ثابت'),
    ]

    code = models.CharField(max_length=50, unique=True, db_index=True, verbose_name="کد تخفیف")
    description = models.TextField(verbose_name="توضیحات")
    discount_type = models.CharField(max_length=1, choices=DISCOUNT_TYPE_CHOICES, verbose_name="نوع تخفیف")
    value = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="مقدار")

    is_active = models.BooleanField(default=True, verbose_name="فعال است؟")
    valid_from = models.DateTimeField(null=True, blank=True, verbose_name="معتبر از تاریخ")
    valid_to = models.DateTimeField(null=True, blank=True, verbose_name="معتبر تا تاریخ")

    target_products = models.ManyToManyField(Product, blank=True, related_name="discounts", verbose_name="محصولات هدف")
    target_categories = models.ManyToManyField(Category, blank=True, related_name="discounts", verbose_name="دسته بندی های هدف")
    target_customers = models.ManyToManyField(Customer, blank=True, related_name="discounts", verbose_name="مشتریان هدف")

    min_purchase_amount = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name="حداقل مبلغ خرید")

    class Meta:
        verbose_name = "تخفیف"
        verbose_name_plural = "تخفیف ها"

    def __str__(self):
        return self.code

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='items', verbose_name="سفارش")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items', verbose_name="محصول")
    quantity = models.PositiveSmallIntegerField(verbose_name="تعداد")
    unit_price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="قیمت واحد")
    # Storing selected size and color as text, assuming they are denormalized for historical accuracy
    selected_size = models.CharField(max_length=50, verbose_name="سایز انتخابی")
    selected_color = models.CharField(max_length=50, verbose_name="رنگ انتخابی")

    class Meta:
        verbose_name = "آیتم سفارش"
        verbose_name_plural = "آیتم های سفارش"

    def __str__(self):
        return f"{self.quantity} عدد از {self.product.name}"

class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist', verbose_name="کاربر")
    products = models.ManyToManyField(Product, blank=True, related_name='wishlisted_by', verbose_name="محصولات مورد علاقه")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "لیست علاقه‌مندی‌ها"
        verbose_name_plural = "لیست‌های علاقه‌مندی‌"

    def __str__(self):
        return f"لیست علاقه‌مندی‌های {self.user.username}"
