import api from './api';
import type { LoginResponse, RegisterResponse } from '../types';

export const authService = {
  // Register new user
  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await api.post('/users/register/', {
      username,
      email,
      password,
    });
    return response.data;
  },

  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/users/login/', {
      email,
      password,
    });
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/users/logout/', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/users/forgot-password/', { email });
    return response.data;
  },

  // Verify OTP and reset password
  resetPassword: async (
    user_id: number,
    otp_code: string,
    new_password: string,
    confirm_password: string
  ): Promise<{ message: string }> => {
    const response = await api.post('/users/forgot-password/verify/', {
      user_id,
      otp_code,
      new_password,
      confirm_password,
    });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (user_id: number): Promise<{ message: string }> => {
    const response = await api.post('/users/resend-otp/', { user_id });
    return response.data;
  },
};
