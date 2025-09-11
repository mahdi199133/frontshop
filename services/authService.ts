import { User } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface AuthTokens {
  access: string;
  refresh: string;
}

export const storeTokens = (tokens: AuthTokens) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const loginUser = async (username: string, password: string): Promise<AuthTokens> => {
  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
};

export const registerUser = async (userData: Omit<User, 'id' | 'name'> & {password: string}): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Combine error messages for display
      const messages = Object.values(errorData).flat().join(', ');
      throw new Error(messages || 'Registration failed');
    }

    return response.json();
};

// A wrapper for fetch that includes the auth token
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAccessToken();

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const response = await fetch(url, { ...options, headers });

    // TODO: Add logic to refresh token if response is 401 Unauthorized

    return response;
};
