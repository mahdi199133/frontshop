import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import DashboardPage from './components/DashboardPage';
import ProductDetailPage from './components/ProductDetailPage';
import LoginPage from './components/LoginPage';
import { ToastContainer } from './components/Toast';
import { Page, Product, CartItem, ToastMessage, User } from './types';
import { fetchProductById, fetchProducts } from './services/mockApi';


const Spinner: React.FC = () => (
    <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
    </div>
);

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.Home);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [detailedProduct, setDetailedProduct] = useState<Product | undefined>(undefined);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (e) { return null; }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const savedWishlist = localStorage.getItem(`wishlist_${currentUser?.id || ''}`);
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (e) { return []; }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch all products on initial load
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setIsLoadingProducts(false);
    };
    loadProducts();
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save cart to localStorage", error);
    }
  }, [cart]);

  // Persist user and wishlist
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
      } else {
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error("Could not save user data to localStorage", error);
    }
  }, [currentUser, wishlist]);


  // Load detailed product when needed
  useEffect(() => {
    if (page === Page.ProductDetail && selectedProductId !== null) {
      const loadProduct = async () => {
        setIsLoadingProduct(true);
        setDetailedProduct(undefined);
        const product = await fetchProductById(selectedProductId);
        setDetailedProduct(product);
        setIsLoadingProduct(false);
      };
      loadProduct();
    }
  }, [page, selectedProductId]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const navigate = useCallback((targetPage: Page) => {
    // Protected routes
    if (targetPage === Page.Dashboard && !currentUser) {
      setPage(Page.Login);
      return;
    }
    setPage(targetPage);
  }, [currentUser]);

  const handleSelectProduct = useCallback((id: number) => {
    setSelectedProductId(id);
    navigate(Page.ProductDetail);
  }, [navigate]);
  
  const handleAddToCart = useCallback((product: Product, size: string, color: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
    addToast(`${product.name} به سبد خرید اضافه شد!`);
  }, []);

  const handleUpdateQuantity = useCallback((productId: number, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    addToast('محصول از سبد خرید حذف شد.', 'info');
  }, []);
  
  const handleClearCart = useCallback(() => {
      setCart([]);
  }, []);

  const handleLogin = useCallback((email: string) => {
      const user: User = { id: '123', name: 'علی رضایی', email: email };
      setCurrentUser(user);
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
      addToast(`خوش آمدید، ${user.name}!`);
      navigate(Page.Home);
  }, [navigate]);

  const handleLogout = useCallback(() => {
      addToast('با موفقیت خارج شدید.');
      setCurrentUser(null);
      setWishlist([]);
      navigate(Page.Home);
  }, [navigate]);

  const handleToggleWishlist = useCallback((productId: number) => {
      if (!currentUser) {
          addToast('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.', 'info');
          navigate(Page.Login);
          return;
      }
      setWishlist(prev => {
          if (prev.includes(productId)) {
              addToast('محصول از علاقه‌مندی‌ها حذف شد.', 'info');
              return prev.filter(id => id !== productId);
          } else {
              addToast('محصول به علاقه‌مندی‌ها اضافه شد.');
              return [...prev, productId];
          }
      });
  }, [currentUser, navigate]);


  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const isLoggedIn = !!currentUser;

  const renderPage = () => {
    switch (page) {
      case Page.Login:
        return <LoginPage onLogin={handleLogin} />;
      case Page.Cart:
        return <CartPage cartItems={cart} updateQuantity={handleUpdateQuantity} removeFromCart={handleRemoveFromCart} setPage={navigate} addToast={addToast} />;
      case Page.Checkout:
        return <CheckoutPage setPage={navigate} clearCart={handleClearCart} />;
      case Page.Dashboard:
        if (!currentUser) return <LoginPage onLogin={handleLogin} />;
        return <DashboardPage currentUser={currentUser} onLogout={handleLogout} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onSelectProduct={handleSelectProduct} />;
      case Page.ProductDetail:
        if (isLoadingProduct) {
          return <Spinner />;
        }
        if (!detailedProduct) {
          return (
            <div className="container mx-auto px-4 py-12 text-center">
              <h1 className="text-2xl font-bold text-gray-800">محصول یافت نشد</h1>
              <p className="text-gray-600 mt-4">ممکن است این محصول حذف شده یا آدرس آن اشتباه باشد.</p>
              <button onClick={() => navigate(Page.Home)} className="mt-8 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700">
                بازگشت به فروشگاه
              </button>
            </div>
          );
        }
        return <ProductDetailPage 
            product={detailedProduct} 
            onAddToCart={handleAddToCart} 
            onBack={() => navigate(Page.Home)}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.includes(detailedProduct.id)}
        />;
      case Page.Home:
      default:
        return <HomePage 
            products={products}
            loading={isLoadingProducts}
            onSelectProduct={handleSelectProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
        />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header cartItemCount={cartItemCount} setPage={navigate} isLoggedIn={isLoggedIn} />
      <main>
        {renderPage()}
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
            <p>&copy; ۱۴۰۳ - تمام حقوق برای فروشگاه شلوارکده محفوظ است.</p>
        </div>
      </footer>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;