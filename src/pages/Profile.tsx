import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { userService } from '../services/user.service';
import type { ProfileData } from '../types';
import { FiAward, FiTrendingUp, FiCheckCircle, FiZap } from 'react-icons/fi';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 lg:ml-64">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const maxCompletions = Math.max(
    ...profile.amount_of_tasks_completed_on_each_day_for_the_past_7d.map((d) => d.count),
    1
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your progress and achievements</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Karma & Badge Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <p className="text-primary-100">TaskSphere Member</p>
                </div>
                <div className="p-4 bg-white/10 rounded-full">
                  <FiAward size={32} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-primary-100 text-sm">Karma Points</p>
                  <p className="text-3xl font-bold">{profile.karma}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-sm">Current Badge</p>
                  <p className="text-xl font-semibold">
                    {profile.current_badge_level?.name || 'No Badge'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {profile.current_badge_level && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level Progress</span>
                    <span>{profile.current_badge_level.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${profile.current_badge_level.progress_percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-primary-100 mt-1">
                    {profile.current_badge_level.karma_to_next_level} karma to next level
                  </p>
                </div>
              )}
            </motion.div>

            {/* Streaks Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiZap className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Streaks</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{profile.current_streak}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Highest Streak</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{profile.highest_streak}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">days</p>
                </div>
              </div>
            </motion.div>

            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiTrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">7-Day Activity</h3>
              </div>

              <div className="space-y-4">
                {profile.amount_of_tasks_completed_on_each_day_for_the_past_7d.map((day) => (
                  <div key={day.date}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{day.day_name}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{day.count} tasks</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.count / maxCompletions) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {profile.total_amount_of_completed_tasks}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Past 7 Days</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {profile.total_amount_of_completed_tasks_for_the_past_7d}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Badges */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card sticky top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiAward className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Earned Badges</h3>
              </div>

              {profile.earned_badges.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No badges earned yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.earned_badges.slice(0, 5).map((badge) => (
                    <div
                      key={badge.name}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <FiCheckCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{badge.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{badge.karma_range} karma</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
