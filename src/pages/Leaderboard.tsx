import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Select from '../components/Select';
import { userService } from '../services/user.service';
import type { LeaderboardEntry } from '../types';
import { FiAward, FiZap, FiUser } from 'react-icons/fi';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [yourRank, setYourRank] = useState(0);
  const [yourKarma, setYourKarma] = useState(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    loadLeaderboard();
  }, [limit]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await userService.getLeaderboard(limit);
      setLeaderboard(data.leaderboard);
      setYourRank(data.your_rank);
      setYourKarma(data.your_karma);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700';
    return 'text-gray-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <FiAward className={getRankColor(rank)} size={24} />;
    return <span className="text-gray-600 font-bold">{rank}</span>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-8 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Top users ranked by karma points</p>
        </div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <FiUser size={28} />
              </div>
              <div>
                <p className="text-primary-100 text-sm">Your Rank</p>
                <p className="text-3xl font-bold">#{yourRank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-sm">Your Karma</p>
              <p className="text-3xl font-bold">{yourKarma}</p>
            </div>
          </div>
        </motion.div>

        {/* Limit Selector */}
        <div className="flex justify-end mb-4">
          <div className="w-48">
            <Select
              value={limit}
              onChange={(value) => setLimit(Number(value))}
              options={[
                { value: 10, label: 'Top 10' },
                { value: 25, label: 'Top 25' },
                { value: 50, label: 'Top 50' },
                { value: 100, label: 'Top 100' },
              ]}
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Karma
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Streak
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((entry, index) => (
                    <motion.tr
                      key={entry.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-10">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {entry.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{entry.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiAward className="text-purple-600" size={18} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{entry.current_badge_level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-primary-600">
                          {entry.karma}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiZap className="text-orange-500" size={18} />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {entry.current_streak} days
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Best: {entry.highest_streak}
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
