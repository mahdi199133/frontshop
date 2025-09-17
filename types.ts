
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

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  selected_size: string;
  selected_color: string;
}

export interface Order {
  id: number;
  customer: number; // customer ID
  placed_at: string;
  payment_status: string;
  items: CartItem[];
  total_price: number;
  discount?: any; // Define more strictly if needed
}

export interface Wishlist {
  id: number;
  user: number; // user ID
  products: Product[];
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: string;
  username: string; // Django's default user model has username
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginCredentials {
    username: string;
    password?: string;
    email?: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

