import json
from django.core.management.base import BaseCommand
from django.db import transaction
from store.models import Product, Category, Color, Size
from pathlib import Path

class Command(BaseCommand):
    help = 'Seeds the database with initial product data from a JSON file.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # The JSON file is in the same directory as models.py etc.
        json_file_path = Path(__file__).resolve().parent.parent.parent / 'seed_data.json'

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                products_data = json.load(f)

            product_count = 0
            for product_data in products_data:
                category_name = product_data.get('category')
                if not category_name:
                    self.stdout.write(self.style.WARNING(f"Skipping product with no category: {product_data.get('name')}"))
                    continue

                category, _ = Category.objects.get_or_create(name=category_name)

                product, created = Product.objects.get_or_create(
                    id=product_data.get('id'),
                    defaults={
                        'name': product_data.get('name'),
                        'description': product_data.get('description'),
                        'price': product_data.get('price'),
                        'category': category,
                        'image_url': product_data.get('imageUrl'),
                        'rating': product_data.get('rating'),
                        'review_count': product_data.get('reviewCount'),
                    }
                )

                if created:
                    product_count += 1
                    # Add colors
                    for color_name in product_data.get('colors', []):
                        color, _ = Color.objects.get_or_create(name=color_name)
                        product.colors.add(color)

                    # Add sizes
                    for size_name in product_data.get('sizes', []):
                        size, _ = Size.objects.get_or_create(name=size_name)
                        product.sizes.add(size)

                    self.stdout.write(self.style.SUCCESS(f'Successfully created product: "{product.name}"'))

            if product_count == 0:
                self.stdout.write(self.style.WARNING('No new products were created. The database might already be seeded.'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Successfully seeded {product_count} products.'))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Could not find seed_data.json at {json_file_path}'))
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'Error decoding JSON from seed_data.json: {e}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An unexpected error occurred: {e}'))
