import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { FiCheckSquare, FiTrendingUp, FiZap, FiAward } from 'react-icons/fi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <FiCheckSquare className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sign in</h1>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full" 
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">or Sign up</span>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm dark:text-primary-400 dark:hover:text-primary-300"
            >
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-700 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          {/* Logo */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center transform rotate-12 mb-6">
              <FiCheckSquare size={40} className="transform -rotate-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome to TaskSphere</h2>
            <p className="text-gray-300 text-lg max-w-md">
              Organize your tasks, boost your productivity, and achieve your goals with our advanced task management system.
            </p>
          </div>

          {/* Feature Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md border border-white/20">
            <h3 className="text-xl font-semibold mb-3">
              Get organized and stay productive
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Track tasks, earn karma, compete on leaderboards, and unlock achievements as you complete your goals.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FiTrendingUp size={20} />
                </div>
                <p className="text-xs text-gray-300">Track Progress</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FiZap size={20} />
                </div>
                <p className="text-xs text-gray-300">Build Streaks</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FiAward size={20} />
                </div>
                <p className="text-xs text-gray-300">Earn Badges</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
