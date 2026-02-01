import api from './api';
import type { ProfileData, Badge, LeaderboardEntry, KarmaTransaction } from '../types';

export const userService = {
  // Get user profile
  getProfile: async (): Promise<ProfileData> => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  // Get user badges
  getUserBadges: async (): Promise<{ total_badges: number; badges: Badge[] }> => {
    const response = await api.get('/users/badges/');
    return response.data;
  },

  // Get all available badges
  getAllBadges: async (): Promise<{
    total_available_badges: number;
    badges: Badge[];
    user_karma: number;
    current_badge: any;
  }> => {
    const response = await api.get('/users/badges/all/');
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (limit: number = 10): Promise<{
    leaderboard: LeaderboardEntry[];
    your_rank: number;
    your_karma: number;
  }> => {
    const response = await api.get('/users/leaderboard/', { params: { limit } });
    return response.data;
  },

  // Get karma history
  getKarmaHistory: async (
    days: number = 30,
    limit: number = 50
  ): Promise<{
    current_karma: number;
    statistics: {
      period_days: number;
      total_earned: number;
      total_lost: number;
      net_change: number;
    };
    transactions: KarmaTransaction[];
    total_transactions: number;
  }> => {
    const response = await api.get('/users/karma/history/', { params: { days, limit } });
    return response.data;
  },
};
