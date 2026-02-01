import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { userService } from '../services/user.service';
import type { Badge } from '../types';
import { FiAward, FiLock, FiCheckCircle } from 'react-icons/fi';

const Badges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userKarma, setUserKarma] = useState(0);
  const [currentBadge, setCurrentBadge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllBadges();
      setBadges(data.badges);
      setUserKarma(data.user_karma);
      setCurrentBadge(data.current_badge);
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="px-8 py-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Badges</h1>
          <p className="text-gray-600 mt-1">
            Earn badges by accumulating karma points • Current Karma: <span className="font-semibold text-primary-600">{userKarma}</span>
          </p>
        </div>

        {/* Current Badge Progress */}
        {currentBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/10 rounded-full">
                <FiAward size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Current Level: {currentBadge.name}</h2>
                <p className="text-primary-100">
                  {currentBadge.karma_min} - {currentBadge.karma_max} karma
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to Next Level</span>
                <span>{currentBadge.progress.percentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${currentBadge.progress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-primary-100 mt-2">
                {currentBadge.progress.karma_to_next_level} karma needed to reach the next level
              </p>
            </div>
          </motion.div>
        )}

        {/* Badges Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card ${
                badge.earned
                  ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white'
                  : badge.is_current_level
                  ? 'border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-white'
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-full ${
                      badge.earned
                        ? 'bg-yellow-100'
                        : badge.is_current_level
                        ? 'bg-primary-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {badge.earned ? (
                      <FiCheckCircle
                        className={badge.earned ? 'text-yellow-600' : 'text-gray-400'}
                        size={28}
                      />
                    ) : badge.is_current_level ? (
                      <FiAward className="text-primary-600" size={28} />
                    ) : (
                      <FiLock className="text-gray-400" size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">
                      {badge.karma_min} - {badge.karma_max} karma
                    </p>
                  </div>
                </div>
              </div>

              {badge.earned && (
                <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg">
                  <FiCheckCircle size={16} />
                  <span className="font-medium">Earned!</span>
                </div>
              )}

              {badge.is_current_level && !badge.earned && (
                <div className="flex items-center gap-2 text-sm text-primary-700 bg-primary-100 px-3 py-2 rounded-lg">
                  <FiAward size={16} />
                  <span className="font-medium">Current Level</span>
                </div>
              )}

              {!badge.earned && !badge.is_current_level && badge.karma_needed !== undefined && (
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">{badge.karma_needed}</span> karma needed
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Badges;
