import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';
import { User, LoginCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect handles the initial auth state check
    const checkAuth = async () => {
      if (token) {
        // Here you would typically have an endpoint to verify the token and get user data
        // For now, we assume the token is valid if it exists.
        // A real app should fetch user data based on the token.
        // For this implementation, we'll rely on the user data from login.
        // Let's try to get user data from localStorage if available.
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    const { key, user: loggedInUser } = await authService.login(credentials);
    setToken(key);
    setUser(loggedInUser);
    localStorage.setItem('authToken', key);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
  };

  const logout = async () => {
    if (token) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.error("Logout failed on server, clearing client state anyway.", error);
      } finally {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        // Also clear cart and wishlist from previous user
        localStorage.removeItem('shoppingCart');
        // Wishlist is user-specific, so it will be cleared on next login.
      }
    }
  };

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
