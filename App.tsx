import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from './components/Toast';
import { ToastMessage } from './types';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import { useSiteConfig } from './context/SiteConfigContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load page components for code splitting
const HomePage = React.lazy(() => import('./components/HomePage'));
const CartPage = React.lazy(() => import('./components/CartPage'));
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));
const DashboardPage = React.lazy(() => import('./components/DashboardPage'));
const ProductDetailPage = React.lazy(() => import('./components/ProductDetailPage'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const BlogListPage = React.lazy(() => import('./components/BlogListPage'));
const BlogPostPage = React.lazy(() => import('./components/BlogPostPage'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const App: React.FC = () => {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { cart, isLoading: isDataLoading } = useData();
  const { config } = useSiteConfig();
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const navigate = useNavigate();

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSelectProduct = useCallback((id: number) => {
    navigate(`/products/${id}`);
  }, [navigate]);
  
  const cartItemCount = cart?.items.reduce((count, item) => count + item.quantity, 0) || 0;

  if (isAuthLoading || (isLoggedIn && isDataLoading)) {
      return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header cartItemCount={cartItemCount} isLoggedIn={isLoggedIn} />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={
                    <HomePage
                        onSelectProduct={handleSelectProduct}
                        addToast={addToast}
                    />}
                />
                <Route path="/products/:productId" element={
                    <ProductDetailPage
                        addToast={addToast}
                    />}
                />
                <Route path="/cart" element={
                    <CartPage
                        addToast={addToast}
                    />}
                />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage addToast={addToast} />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage
                            onSelectProduct={handleSelectProduct}
                        />
                    </ProtectedRoute>
                } />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
        </Suspense>
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} - تمام حقوق برای {config?.store_name || 'فروشگاه شما'} محفوظ است.</p>
        </div>
      </footer>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;