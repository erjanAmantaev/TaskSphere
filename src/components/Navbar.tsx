import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://tasksphere-production-090a.up.railway.app';

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate avatar initials from username or email
  const getInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 -mt-0.5 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 h-16 flex items-center justify-end">
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors dark:hover:bg-gray-700"
          >
            {/* Avatar */}
            {user?.profile_picture ? (
              <img
                src={user.profile_picture.startsWith('http') ? user.profile_picture : `${API_BASE}${user.profile_picture}`}
                alt={user.username || 'User'}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white" size={20} />
              </div>
            )}
            
            {/* User Info */}
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {user?.username || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </div>
            </div>

            {/* Dropdown Icon */}
            <FiChevronDown
              className={`text-gray-400 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              size={16}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 dark:bg-gray-800 dark:border-gray-700"
              >
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FiUser size={16} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FiSettings size={16} />
                  Settings
                </button>

                <div className="border-t border-gray-200 my-1 dark:border-gray-700"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
