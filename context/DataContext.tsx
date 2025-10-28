import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';
import * as wishlistService from '../services/wishlistService';
import { Order, Wishlist, Product, CartItem } from '../types';

interface DataContextType {
  cart: Order | null;
  wishlist: Wishlist | null;
  isLoading: boolean;
  fetchData: () => void;
  addToCart: (product: Product, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  isProductInWishlist: (productId: number) => boolean;
  clearCart: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isLoggedIn } = useAuth();
  const [cart, setCart] = useState<Order | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (isLoggedIn && token) {
      setIsLoading(true);
      try {
        const [cartData, wishlistData] = await Promise.all([
          cartService.getCart(token),
          wishlistService.getWishlist(token)
        ]);
        setCart(cartData);
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        // Handle error appropriately, maybe show a toast to the user
      } finally {
        setIsLoading(false);
      }
    } else {
        // Clear data on logout
        setCart(null);
        setWishlist(null);
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = async (product: Product, size: string, color: string, quantity: number) => {
    if (!token) throw new Error("Authentication token not found.");
    const updatedCart = await cartService.addToCart(token, product.id, quantity, size, color);
    setCart(updatedCart);
  };

  const removeFromCart = async (itemId: number) => {
    if (!token) throw new Error("Authentication token not found.");
    const updatedCart = await cartService.removeFromCart(token, itemId);
    setCart(updatedCart);
  };

  const updateCartItemQuantity = async (itemId: number, quantity: number) => {
    if (!token) throw new Error("Authentication token not found.");
    const updatedCart = await cartService.updateCartItem(token, itemId, quantity);
    setCart(updatedCart);
  };

  const isProductInWishlist = (productId: number): boolean => {
      return wishlist?.products.some(p => p.id === productId) || false;
  }

  const toggleWishlist = async (productId: number) => {
    if (!token) throw new Error("Authentication token not found.");

    const inWishlist = isProductInWishlist(productId);
    let updatedWishlist;
    if (inWishlist) {
      updatedWishlist = await wishlistService.removeProductFromWishlist(token, productId);
    } else {
      updatedWishlist = await wishlistService.addProductToWishlist(token, productId);
    }
    setWishlist(updatedWishlist);
  };

  const clearCart = async () => {
      // In a real app, this would likely call an API to archive the order
      // and create a new one. For now, we just clear it locally.
      setCart(null);
      // And refetch to be sure
      fetchData();
  }

  const value = {
    cart,
    wishlist,
    isLoading,
    fetchData,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    toggleWishlist,
    isProductInWishlist,
    clearCart
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
