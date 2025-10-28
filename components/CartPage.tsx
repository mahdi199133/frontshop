import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import * as discountService from '../services/discountService';
import { TrashIcon, PlusIcon, MinusIcon } from './Icons';

interface CartPageProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CartPage: React.FC<CartPageProps> = ({ addToast }) => {
  const { cart, updateCartItemQuantity, removeFromCart, isLoading } = useData();
  const { token } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart?.items.reduce((acc, item) => acc + (parseFloat(item.unit_price) * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? 50000 : 0;
  const total = subtotal - discount + shipping;
  
  const handleApplyCoupon = async () => {
    if (appliedCoupon || !token || !cart) return;

    setIsApplyingCoupon(true);
    try {
        const cartForApi = cart.items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity
        }));

        const response = await discountService.applyDiscount(token, {
            code: couponCode,
            cart: cartForApi
        });

        setDiscount(parseFloat(response.discount_amount));
        setAppliedCoupon(response.discount_applied.code);
        addToast('کد تخفیف با موفقیت اعمال شد!', 'success');
        setCouponCode('');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'کد تخفیف نامعتبر است.';
        addToast(errorMessage, 'error');
    } finally {
        setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
      setDiscount(0);
      setAppliedCoupon(null);
      addToast('کد تخفیف حذف شد.', 'info');
  }

  if (isLoading) {
    return <div className="text-center py-12">در حال بارگذاری سبد خرید...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">سبد خرید شما خالی است</h1>
        <p className="text-gray-600 mb-8">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
        <Link to="/" className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">سبد خرید</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-lg font-medium text-gray-900">اقلام سبد خرید</h2>
                    <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                        ادامه خرید &rarr;
                    </Link>
                </div>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="me-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product.name}</h3>
                          <p className="ms-4">{parseFloat(item.unit_price).toLocaleString('fa-IR')} تومان</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{`رنگ: ${item.selected_color}, سایز: ${item.selected_size}`}</p>
                         <p className="mt-1 text-sm text-green-600 font-medium">موجود در انبار</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600 hover:text-gray-800"><PlusIcon className="h-4 w-4"/></button>
                          <p className="px-4">{item.quantity}</p>
                          <button onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 text-gray-600 hover:text-gray-800"><MinusIcon className="h-4 w-4"/></button>
                        </div>
                        <div className="flex">
                          <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-red-600 hover:text-red-500 flex items-center">
                            <TrashIcon className="h-5 w-5 me-1"/> حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
                <h2 className="text-lg font-medium text-gray-900">کد تخفیف</h2>
                <p className="text-sm text-gray-500 mt-1">کد تخفیف خود را در صورت وجود وارد کنید.</p>
                {!appliedCoupon ? (
                    <div className="mt-4 flex gap-x-2">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="کد تخفیف"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={!couponCode || isApplyingCoupon}
                            className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isApplyingCoupon ? 'در حال بررسی...' : 'اعمال کد'}
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                        <p className="text-sm font-semibold text-green-700">کد <span className="font-mono">{appliedCoupon}</span> اعمال شد.</p>
                        <button onClick={handleRemoveCoupon} className="text-sm text-red-600 hover:underline">حذف</button>
                    </div>
                )}
            </div>
          </div>


          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-4">خلاصه سفارش</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">جمع کل</p>
                  <p className="text-sm font-medium text-gray-900">{subtotal.toLocaleString('fa-IR')} تومان</p>
                </div>
                 {appliedCoupon && (
                    <div className="flex items-center justify-between text-green-600">
                        <p className="text-sm">تخفیف ({appliedCoupon})</p>
                        <p className="text-sm font-medium">- {discount.toLocaleString('fa-IR')} تومان</p>
                    </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">هزینه ارسال</p>
                  <p className="text-sm font-medium text-gray-900">{shipping.toLocaleString('fa-IR')} تومان</p>
                </div>
                 <div className="flex items-center justify-between text-sm text-gray-500">
                   <span>زمان تخمینی تحویل:</span>
                   <span>۳ تا ۵ روز کاری</span>
                 </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">مبلغ قابل پرداخت</p>
                  <p className="text-base font-medium text-gray-900">{total.toLocaleString('fa-IR')} تومان</p>
                </div>
              </div>
              <div className="mt-6">
                <button onClick={() => navigate('/checkout')} className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
                  ادامه فرآیند خرید
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;