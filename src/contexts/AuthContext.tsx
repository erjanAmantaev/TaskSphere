import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { settingsService } from '../services/settings.service';
import type { LoginResponse, RegisterResponse } from '../types';

interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (username: string, email: string, password: string) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check if user is already authenticated
      const token = localStorage.getItem('access_token');
      const storedUserId = localStorage.getItem('user_id');
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');

      if (token && storedUserId) {
        setIsAuthenticated(true);
        setUserId(parseInt(storedUserId));
        
        // Fetch account info to get profile picture
        try {
          const accountInfo = await settingsService.getAccountInfo();
          
          localStorage.setItem('username', accountInfo.username);
          localStorage.setItem('email', accountInfo.email);
          
          setUser({
            id: parseInt(storedUserId),
            username: accountInfo.username,
            email: accountInfo.email,
            profile_picture: accountInfo.profile_picture,
          });
        } catch (error) {
          console.error('Failed to fetch account info:', error);
          // Fallback to stored values
          setUser({
            id: parseInt(storedUserId),
            username: storedUsername || '',
            email: storedEmail || '',
            profile_picture: null,
          });
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await authService.login(email, password);
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user_id', response.user_id.toString());
    localStorage.setItem('username', response.username || '');
    localStorage.setItem('email', email);
    
    setIsAuthenticated(true);
    setUserId(response.user_id);
    
    // Fetch account info to get profile picture
    try {
      const accountInfo = await settingsService.getAccountInfo();
      setUser({
        id: response.user_id,
        username: response.username || '',
        email: email,
        profile_picture: accountInfo.profile_picture,
      });
    } catch (error) {
      console.error('Failed to fetch account info:', error);
      setUser({
        id: response.user_id,
        username: response.username || '',
        email: email,
        profile_picture: null,
      });
    }
    
    return response;
  };

  const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await authService.register(username, email, password);
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user_id', response.user_id.toString());
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    
    setIsAuthenticated(true);
    setUserId(response.user_id);
    setUser({
      id: response.user_id,
      username: username,
      email: email,
    });
    
    return response;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated || !userId) return;
    
    try {
      const accountInfo = await settingsService.getAccountInfo();
      setUser({
        id: userId,
        username: accountInfo.username,
        email: accountInfo.email,
        profile_picture: accountInfo.profile_picture,
      });
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
