
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

type DashboardTab = 'profile' | 'orders' | 'addresses' | 'wishlist';

interface DashboardPageProps {
  onSelectProduct: (productId: number) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist, isProductInWishlist, isLoading: isDataLoading } = useData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const orders = [
    { id: '12345', date: '۱۴۰۳/۰۵/۰۱', total: '۱,۵۷۰,۰۰۰ تومان', status: 'تحویل شده' },
    { id: '12346', date: '۱۴۰۳/۰۵/۱۰', total: '۸۵۰,۰۰۰ تومان', status: 'در حال پردازش' },
  ];

  if (!user) {
    // This should not happen if ProtectedRoute is used, but as a fallback:
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">پنل کاربری</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="User avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <nav className="bg-white p-4 rounded-lg shadow-sm mt-6">
              <ul className="space-y-1">
                <li><button onClick={() => setActiveTab('orders')} className={`w-full text-right px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>تاریخچه سفارش‌ها</button></li>
                <li><button onClick={() => setActiveTab('wishlist')} className={`w-full text-right px-4 py-2 rounded-md ${activeTab === 'wishlist' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>علاقه‌مندی‌ها</button></li>
                <li><button onClick={() => setActiveTab('profile')} className={`w-full text-right px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>پروفایل</button></li>
                <li><button onClick={() => setActiveTab('addresses')} className={`w-full text-right px-4 py-2 rounded-md ${activeTab === 'addresses' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>آدرس‌ها</button></li>
                <li><button onClick={handleLogout} className="w-full text-right px-4 py-2 rounded-md text-red-600 hover:bg-red-50">خروج از حساب</button></li>
              </ul>
            </nav>
          </aside>
          
          <main className="md:col-span-3">
            <div className="bg-white p-8 rounded-lg shadow-sm min-h-[400px]">
              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">تاریخچه سفارش‌ها</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">شماره سفارش</th>
                          <th scope="col" className="px-6 py-3">تاریخ</th>
                          <th scope="col" className="px-6 py-3">مبلغ کل</th>
                          <th scope="col" className="px-6 py-3">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">#{order.id}</td>
                            <td className="px-6 py-4">{order.date}</td>
                            <td className="px-6 py-4">{order.total}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'تحویل شده' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === 'wishlist' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">لیست علاقه‌مندی‌ها</h3>
                  {isDataLoading ? (<p>در حال بارگذاری...</p>) :
                   wishlist && wishlist.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {wishlist.products.map(product => (
                        <ProductCard 
                          key={product.id}
                          product={product}
                          onViewDetails={onSelectProduct}
                          onToggleWishlist={toggleWishlist}
                          isInWishlist={isProductInWishlist(product.id)}
                        />
                      ))}
                    </div>
                  ) : (<p className="text-gray-600">لیست علاقه‌مندی‌های شما خالی است.</p>)}
                </div>
              )}
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">ویرایش پروفایل</h3>
                  <p className="text-gray-600">فرم ویرایش اطلاعات کاربر در اینجا قرار خواهد گرفت.</p>
                </div>
              )}
              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6">مدیریت آدرس‌ها</h3>
                  <p className="text-gray-600">قابلیت افزودن، ویرایش و حذف آدرس‌ها در اینجا قرار خواهد گرفت.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
