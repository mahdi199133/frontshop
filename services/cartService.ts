import { Order } from '../types'; // Assuming Order can represent the Cart

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };
};

export const getCart = async (token: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/cart/cart/`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

export const addToCart = async (token: string, productId: number, quantity: number, size: string, color: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/cart/cart/items/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
        selected_size: size,
        selected_color: color
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  return response.json();
};

export const updateCartItem = async (token: string, itemId: number, quantity: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/cart/cart/items/${itemId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }
    return response.json();
  };

export const removeFromCart = async (token: string, itemId: number): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/cart/cart/items/${itemId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
  return response.json();
};
