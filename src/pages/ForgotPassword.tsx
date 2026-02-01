import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { authService } from '../services/auth.service';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email) as any;
      // Backend should return user_id for next step
      if (response.user_id) {
        setUserId(response.user_id);
      }
      setSuccess(response.message || 'OTP sent to your email');
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!userId) {
      setError('Invalid session. Please try again.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(userId, otpCode, newPassword, confirmPassword);
      setSuccess('Password reset successful! You can now login.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 'email' ? 'Forgot Password' : 'Reset Password'}
            </h1>
            <p className="text-gray-600">
              {step === 'email'
                ? 'Enter your email to receive a password reset code'
                : 'Enter the OTP code and your new password'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6"
            >
              {success}
            </motion.div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="relative">
                <FiMail className="absolute left-3 top-11 text-gray-400" size={20} />
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                Send Reset Code
              </Button>
            </form>
          )}

          {/* Reset Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <Input
                type="text"
                label="OTP Code"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                maxLength={6}
              />

              <div className="relative">
                <FiLock className="absolute left-3 top-11 text-gray-400" size={20} />
                <Input
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-11 text-gray-400" size={20} />
                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                Reset Password
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <FiArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
