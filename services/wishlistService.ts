import { Wishlist } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };
};

export const getWishlist = async (token: string): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlist/`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  // The API returns a list with one item, the user's wishlist object.
  const data = await response.json();
  return data[0];
};

export const addProductToWishlist = async (token: string, productId: number): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlist/products/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add product to wishlist');
  }
  return response.json();
};

export const removeProductFromWishlist = async (token: string, productId: number): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlist/products/${productId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    // A 204 No Content response is also OK here
    if (response.status !== 204) {
        throw new Error('Failed to remove product from wishlist');
    }
    // If deleted successfully, the body can be empty. We might need to handle this.
    // For now, let's assume it returns the updated wishlist or we refetch.
    // The backend seems to return the updated wishlist, which is good.
    return response.json();
  }
  return response.json();
};
