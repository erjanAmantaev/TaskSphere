import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { FiCheckSquare, FiTarget, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.email?.[0] || err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
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
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-1">Join TaskSphere today</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-2" 
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">or Sign in</span>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Already have an account? Sign in
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
            <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-gray-300 text-lg max-w-md">
              Join thousands of users who have transformed their productivity with TaskSphere's powerful task management features.
            </p>
          </div>

          {/* Feature Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md border border-white/20">
            <h3 className="text-xl font-semibold mb-3">
              Everything you need to succeed
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Create tasks, organize with categories, set priorities, track your progress, and compete with others.
            </p>
            
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <FiTarget size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm">Goal Tracking</p>
                  <p className="text-xs text-gray-400">Set and achieve your targets</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm">Progress Analytics</p>
                  <p className="text-xs text-gray-400">Visualize your productivity</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <FiUsers size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm">Leaderboards</p>
                  <p className="text-xs text-gray-400">Compete and stay motivated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
