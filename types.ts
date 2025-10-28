
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export enum Page {
  Home = 'HOME',
  Cart = 'CART',
  Checkout = 'CHECKOUT',
  Dashboard = 'DASHBOARD',
  ProductDetail = 'PRODUCT_DETAIL',
  Login = 'LOGIN',
  Register = 'REGISTER',
}
