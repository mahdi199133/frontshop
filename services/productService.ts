import { Product, PaginatedResponse, Review } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchProductsPaginated = async (params: { [key: string]: any }): Promise<PaginatedResponse<Product>> => {
  try {
    const query = new URLSearchParams();
    for (const key in params) {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '' && params[key] !== 'all') {
            query.append(key, params[key]);
        }
    }

    const response = await fetch(`${API_BASE_URL}/products/?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Return a default empty response in case of error
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return undefined;
  }
};

export const fetchReviews = async (productId: number): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch reviews for product ${productId}:`, error);
    return [];
  }
};

export const postReview = async (
  productId: number,
  review: { rating: number; comment: string },
  token: string
): Promise<Review> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(review),
  });
  if (!response.ok) {
    // Try to parse the error message from the backend
    const errorData = await response.json();
    throw new Error(errorData[0] || 'Failed to post review');
  }
  return response.json();
};
