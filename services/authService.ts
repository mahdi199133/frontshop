import { LoginCredentials, User } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

interface LoginResponse {
  key: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.non_field_errors?.[0] || 'Login failed');
  }

  return response.json();
};

export const logout = async (token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
};

// Add other auth functions like register if needed
