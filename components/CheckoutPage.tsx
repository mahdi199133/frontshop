
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from './Icons';
import { useData } from '../context/DataContext';

const CheckoutPage: React.FC = () => {
  const { clearCart } = useData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
        // Final submission
        clearCart();
        setStep(4); // Show confirmation
    }
  };

  const steps = ['اطلاعات ارسال', 'پرداخت', 'تایید نهایی'];

  if (step === 4) {
      return (
          <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
              <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6"/>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">سفارش شما با موفقیت ثبت شد!</h1>
              <p className="text-gray-600 mb-8">از خرید شما سپاسگزاریم. جزئیات سفارش به ایمیل شما ارسال شد.</p>
              <Link to="/" className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700">
                  بازگشت به صفحه اصلی
              </Link>
          </div>
      )
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">تکمیل خرید</h1>

        {/* Stepper */}
        <div className="mb-12">
          <ol className="flex items-center w-full">
            {steps.map((title, index) => (
              <li key={title} className={`flex w-full items-center ${index + 1 < step ? 'text-indigo-600' : ''} ${index + 1 < steps.length ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block" : ""}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${step >= index + 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  {step > index + 1 ? <CheckCircleIcon className="w-6 h-6 text-indigo-600" /> : <span className="font-bold">{index + 1}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form onSubmit={handleNextStep}>
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">۱. اطلاعات ارسال</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">شماره موبایل</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">آدرس</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">شهر</label>
                    <input type="text" name="city" id="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">کد پستی</label>
                    <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">۲. روش پرداخت</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">در این مرحله به درگاه پرداخت متصل خواهید شد. این یک نسخه نمایشی است.</p>
                    <div className="p-4 border rounded-md">
                        <p className="font-semibold">درگاه پرداخت اینترنتی</p>
                        <p className="text-sm text-gray-500">پرداخت با کلیه کارت‌های عضو شتاب</p>
                    </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">۳. تایید نهایی</h2>
                <div className="space-y-2 text-gray-700 border p-4 rounded-md">
                    <p><strong>نام:</strong> {formData.fullName}</p>
                    <p><strong>آدرس:</strong> {`${formData.address}, ${formData.city}`}</p>
                    <p><strong>شماره تماس:</strong> {formData.phone}</p>
                    <p className="font-bold pt-4 mt-4 border-t">لطفا اطلاعات خود را بررسی کرده و سفارش را نهایی کنید.</p>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">
                  مرحله قبل
                </button>
              )}
              <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 ms-auto">
                {step === 3 ? 'پرداخت و ثبت نهایی' : 'ادامه'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
