import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCheckSquare, FiCalendar, FiFolder, FiTag, FiAward, FiTrendingUp } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/categories', icon: FiFolder, label: 'Categories' },
    { path: '/tags', icon: FiTag, label: 'Tags' },
    { path: '/badges', icon: FiAward, label: 'Badges' },
    { path: '/leaderboard', icon: FiTrendingUp, label: 'Leaderboard' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col dark:bg-gray-800 dark:border-gray-700">
      {/* Logo */}
      <div className="h-16 px-6 border-b border-gray-200 flex items-center dark:border-gray-700">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">TaskSphere</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1 h-6 bg-primary-600 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
