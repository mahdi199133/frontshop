import { Product } from '../types';
import { fetchWithAuth } from './authService';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/products/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/products/${id}/`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return undefined;
  }
};

export const fetchProductsByIds = async (ids: number[]): Promise<Product[]> => {
    if (ids.length === 0) {
        return [];
    }
    try {
        const params = new URLSearchParams();
        ids.forEach(id => params.append('ids', id.toString()));
        const response = await fetchWithAuth(`${API_BASE_URL}/products/by_ids/?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products by ids:", error);
        return [];
    }
};

export const fetchRecommendations = async (productId: number): Promise<Product[]> => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/products/${productId}/recommendations/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch recommendations for product ${productId}:`, error);
        return [];
    }
};
