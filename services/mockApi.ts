import { Product } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Our API is paginated, so the products are in the 'results' array
    return data.results;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Return an empty array or handle the error as appropriate
    return [];
  }
};

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`);
    if (!response.ok) {
      // Handle 404 Not Found separately
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

// TODO: Implement a backend endpoint for this or fetch products one by one.
// For now, leaving the mock implementation.
const mockFetchProductsByIds = (ids: number[]): Promise<Product[]> => {
    console.warn("fetchProductsByIds is using a mock implementation.");
    // This is inefficient, but will work for now.
    return Promise.all(ids.map(id => fetchProductById(id)))
      .then(products => products.filter((p): p is Product => p !== undefined));
  };

export const fetchProductsByIds = mockFetchProductsByIds;
