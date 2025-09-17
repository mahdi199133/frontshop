
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { fetchProductById } from '../services/productService';
import { StarIcon, PlusIcon, MinusIcon, HeartIcon } from './Icons';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailPageProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
    </div>
);

// Helper function to map Persian color names to hex codes for styling
const colorToHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'آبی': '#3b82f6', 'ذغالی': '#374151', 'خاکی': '#d2b48c', 'سرمه‌ای': '#1e3a8a',
        'مشکی': '#000000', 'آبی روشن': '#60a5fa', 'طوسی': '#9ca3af', 'آبی آسمانی': '#38bdf8',
        'سفید': '#ffffff', 'ملانژ': '#d1d5db', 'کرم': '#f5f5dc', 'سبز یشمی': '#2f4f4f',
    };
    return colorMap[colorName] || '#cccccc';
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ addToast }) => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, toggleWishlist, isProductInWishlist } = useData();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProduct = await fetchProductById(parseInt(productId, 10));
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setSelectedSize(fetchedProduct.sizes[0]);
          setSelectedColor(fetchedProduct.colors[0]);
        } else {
          setError('محصول یافت نشد.');
        }
      } catch (e) {
        setError('خطا در دریافت اطلاعات محصول.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const handleAddToCartClick = async () => {
    if (product && selectedSize && selectedColor) {
      try {
        await addToCart(product, selectedSize, selectedColor, quantity);
        addToast(`${product.name} به سبد خرید اضافه شد!`, 'success');
      } catch (err) {
        addToast('خطا در افزودن به سبد خرید.', 'error');
      }
    }
  };

  const handleToggleWishlistClick = async () => {
      if (!isLoggedIn) {
          addToast('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.', 'info');
          navigate('/login');
          return;
      }
      if (product) {
          const wasInWishlist = isProductInWishlist(product.id);
          try {
            await toggleWishlist(product.id);
            addToast(wasInWishlist ? 'محصول از علاقه‌مندی‌ها حذف شد.' : 'محصول به علاقه‌مندی‌ها اضافه شد.', 'info');
          } catch(err) {
            addToast('خطا در بروزرسانی لیست علاقه‌مندی‌ها.', 'error');
          }
      }
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        <Link to="/" className="mt-8 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  if (!product) {
    return null; // Or a "Product not found" component
  }

  const isInWishlist = isProductInWishlist(product.id);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-8">
          &rarr; بازگشت به همه محصولات
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          {/* Image gallery */}
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover object-center" />
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500 mt-2">{product.category}</p>

            <div className="mt-4 flex items-center">
              <p className="text-3xl tracking-tight text-gray-900">{product.price.toLocaleString('fa-IR')} تومان</p>
              <div className="ms-4 border-s border-gray-300 ps-4 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <a href="#" className="ms-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">{product.reviewCount} نظر</a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">رنگ</h3>
                <fieldset className="mt-2">
                  <legend className="sr-only">Choose a color</legend>
                  <div className="flex items-center space-s-3">
                    {product.colors.map((color) => (
                      <label key={color} className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none">
                        <input type="radio" name="color-choice" value={color} checked={selectedColor === color} onChange={() => setSelectedColor(color)} className="sr-only" />
                        <span aria-hidden="true" className={`h-8 w-8 rounded-full border border-black border-opacity-10 ${selectedColor === color ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`} style={{ backgroundColor: colorToHex(color) }}></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Sizes */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">سایز</h3>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">راهنمای سایز</a>
                </div>
                <fieldset className="mt-2">
                  <legend className="sr-only">Choose a size</legend>
                  <div className="grid grid-cols-5 gap-4">
                    {product.sizes.map((size) => (
                      <label key={size} className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none cursor-pointer ${selectedSize === size ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-900'}`}>
                        <input type="radio" name="size-choice" value={size} checked={selectedSize === size} onChange={() => setSelectedSize(size)} className="sr-only" />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Quantity */}
               <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">تعداد</h3>
                  <div className="flex items-center border border-gray-300 rounded-md w-fit">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:text-gray-800"><MinusIcon className="h-4 w-4"/></button>
                    <p className="px-5 text-lg font-semibold">{quantity}</p>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-600 hover:text-gray-800"><PlusIcon className="h-4 w-4"/></button>
                  </div>
               </div>

              <div className="mt-10 flex gap-x-4">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                >
                  افزودن به سبد خرید
                </button>
                 <button
                    type="button"
                    onClick={handleToggleWishlistClick}
                    className={`p-3 rounded-md border transition-colors duration-200 ${isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500'}`}
                  >
                    <HeartIcon className="w-6 h-6" fill={isInWishlist ? 'currentColor' : 'none'} />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
