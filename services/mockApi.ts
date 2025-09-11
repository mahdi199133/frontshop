
import { Product } from '../types';

const products: Product[] = [
  {
    id: 1,
    name: 'شلوار جین کلاسیک آبی',
    category: 'جین',
    price: 850000,
    imageUrl: 'https://picsum.photos/seed/p1/400/500',
    rating: 4.5,
    reviewCount: 120,
    colors: ['آبی', 'ذغالی'],
    sizes: ['30', '32', '34', '36'],
    description: 'این شلوار جین کلاسیک با کیفیت بالا از بهترین پارچه دنیم ساخته شده است. طراحی آن برای راحتی و دوام در استفاده روزمره بهینه شده و برای هر موقعیتی مناسب است.'
  },
  {
    id: 2,
    name: 'شلوار کتان خاکی',
    category: 'کتان',
    price: 720000,
    imageUrl: 'https://picsum.photos/seed/p2/400/500',
    rating: 4.7,
    reviewCount: 95,
    colors: ['خاکی', 'سرمه‌ای', 'مشکی'],
    sizes: ['M', 'L', 'XL'],
    description: 'شلوار کتان با رنگ خاکی، انتخابی ایده‌آل برای استایل‌های کژوال و هوشمند. پارچه نرم و تنفس‌پذیر آن راحتی را در تمام طول روز تضمین می‌کند.'
  },
  {
    id: 3,
    name: 'شلوار جین زاپ‌دار',
    category: 'جین',
    price: 980000,
    imageUrl: 'https://picsum.photos/seed/p3/400/500',
    rating: 4.2,
    reviewCount: 250,
    colors: ['آبی روشن', 'مشکی'],
    sizes: ['31', '32', '33', '34'],
    description: 'یک شلوار جین مدرن و جوان‌پسند با زاپ‌های طراحی شده. این شلوار به استایل شما جلوه‌ای خاص و امروزی می‌بخشد.'
  },
  {
    id: 4,
    name: 'شلوار پارچه‌ای راسته',
    category: 'پارچه‌ای',
    price: 650000,
    imageUrl: 'https://picsum.photos/seed/p4/400/500',
    rating: 4.8,
    reviewCount: 180,
    colors: ['طوسی', 'مشکی', 'سرمه‌ای'],
    sizes: ['40', '42', '44', '46'],
    description: 'شلوار پارچه‌ای با برش راسته، مناسب برای محیط‌های رسمی و اداری. پارچه باکیفیت آن ظاهری شیک و حرفه‌ای برای شما به ارمغان می‌آورد.'
  },
  {
    id: 5,
    name: 'شلوار جین مام استایل',
    category: 'جین',
    price: 920000,
    imageUrl: 'https://picsum.photos/seed/p5/400/500',
    rating: 4.6,
    reviewCount: 310,
    colors: ['آبی آسمانی', 'سفید'],
    sizes: ['S', 'M', 'L'],
    description: 'این شلوار جین مام استایل با فاق بلند و طراحی راحت، بازگشتی به مد دهه ۹۰ است و استایلی راحت و در عین حال شیک را برای شما فراهم می‌کند.'
  },
  {
    id: 6,
    name: 'شلوار اسلش ورزشی',
    category: 'اسلش',
    price: 550000,
    imageUrl: 'https://picsum.photos/seed/p6/400/500',
    rating: 4.4,
    reviewCount: 75,
    colors: ['ملانژ', 'مشکی'],
    sizes: ['L', 'XL', 'XXL'],
    description: 'شلوار اسلش راحت و مناسب برای فعالیت‌های ورزشی یا استفاده روزمره. پارچه نرم آن احساس راحتی بی‌نظیری را به شما هدیه می‌دهد.'
  },
  {
    id: 7,
    name: 'شلوار جین اسکینی مشکی',
    category: 'جین',
    price: 890000,
    imageUrl: 'https://picsum.photos/seed/p7/400/500',
    rating: 4.9,
    reviewCount: 400,
    colors: ['مشکی', 'ذغالی'],
    sizes: ['29', '30', '31', '32', '34'],
    description: 'شلوار جین اسکینی مشکی، یک آیتم ضروری در کمد هر فردی. این شلوار به راحتی با هر لباسی ست می‌شود و ظاهری جذاب و مدرن ایجاد می‌کند.'
  },
  {
    id: 8,
    name: 'شلوار کتان کلاسیک',
    category: 'کتان',
    price: 750000,
    imageUrl: 'https://picsum.photos/seed/p8/400/500',
    rating: 4.5,
    reviewCount: 150,
    colors: ['کرم', 'طوسی', 'سبز یشمی'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'شلوار کتان با طراحی کلاسیک و رنگ‌های متنوع، مناسب برای ساختن استایل‌های مختلف از روزمره تا نیمه‌رسمی.'
  },
];

export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 1000); // Simulate network delay
  });
};

export const fetchProductById = (id: number): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.find(p => p.id === id));
      }, 500);
    });
  };

export const fetchProductsByIds = (ids: number[]): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter(p => ids.includes(p.id)));
    }, 300);
  });
};
