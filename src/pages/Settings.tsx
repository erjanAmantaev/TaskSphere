import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { settingsService } from '../services/settings.service';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiGlobe, FiTrash2, FiSave, FiCamera, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const API_BASE = 'https://tasksphere-production-090a.up.railway.app';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, language, setTheme, setLanguage } = useTheme();
  const { refreshUser } = useAuth();

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Username change
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');

  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Preflanguage, setLanguage] = useState('en');
  const [preferencesSuccess, setPreferencesSuccess] = useState('');

  // Profile picture
  const [uploading, setUploading] = useState(false);
  const [pictureError, setPictureError] = useState('');
  const [pictureSuccess, setPictureSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete account
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    loadAccountInfo();
  }, []);

  const loadAccountInfo = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getAccountInfo();
      setAccountInfo(data);
      // Sync with context if backend has different values
      if (data.theme && data.theme !== theme) {
        setTheme(data.theme as 'light' | 'dark');
      }
      if (data.language && data.language !== language) {
        setLanguage(data.language as 'en' | 'ru');
      }
    } catch (error) {
      console.error('Failed to load account info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await settingsService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPasswordSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');

    try {
      await settingsService.changeUsername({ new_username: newUsername });
      setUsernameSuccess('Username changed successfully');
      localStorage.setItem('username', newUsername);
      await loadAccountInfo();
      setNewUsername('');
    } catch (error: any) {
      setUsernameError(error.response?.data?.error || 'Failed to change username');
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    try {
      await settingsService.changeEmail({
        new_email: newEmail,
        password: emailPassword,
      });
      setEmailSuccess('Email changed successfully');
      localStorage.setItem('email', newEmail);
      await loadAccountInfo();
      setNewEmail('');
      setEmailPassword('');
    } catch (error: any) {
      setEmailError(error.response?.data?.error || 'Failed to change email');
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPictureError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPictureError('Image size must be less than 5MB');
      return;
    }

    setPictureError('');
    setPictureSuccess('');
    setUploading(true);

    try {
      await settingsService.uploadProfilePicture(file);
      setPictureSuccess('Profile picture updated successfully');
      await refreshUser(); // Update AuthContext
      await loadAccountInfo();
      setTimeout(() => setPictureSuccess(''), 3000);
    } catch (error: any) {
      setPictureError(error.response?.data?.error || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProfilePicture = async () => {
    setPictureError('');
    setPictureSuccess('');

    try {
      await settingsService.deleteProfilePicture();
      setPictureSuccess('Profile picture removed successfully');
      await refreshUser(); // Update AuthContext
      await loadAccountInfo();
      setTimeout(() => setPictureSuccess(''), 3000);
    } catch (error: any) {
      setPictureError(error.response?.data?.error || 'Failed to remove profile picture');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');

    try {
      await settingsService.deleteAccount({ password: deletePassword });
      localStorage.clear();
      navigate('/login');
    } catch (error: any) {
      setDeleteError(error.response?.data?.error || 'Failed to delete account');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64 bg-gray-50 dark:bg-gray-900">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="px-8 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Picture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiCamera />
                  Profile Picture
                </h2>
                <div className="flex items-center gap-6">
                  {/* Profile Picture Preview */}
                  <div className="relative">
                    {accountInfo?.profile_picture ? (
                      <img
                        src={accountInfo.profile_picture.startsWith('http') ? accountInfo.profile_picture : `${API_BASE}${accountInfo.profile_picture}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                        <FiUser size={40} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Upload/Delete Buttons */}
                  <div className="flex-1">
                    {pictureError && (
                      <div className="mb-3 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                        {pictureError}
                      </div>
                    )}
                    {pictureSuccess && (
                      <div className="mb-3 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                        {pictureSuccess}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="primary"
                        disabled={uploading}
                      >
                        <FiCamera size={18} />
                        {uploading ? 'Uploading...' : accountInfo?.profile_picture ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      {accountInfo?.profile_picture && (
                        <Button
                          onClick={handleDeleteProfilePicture}
                          variant="secondary"
                          disabled={uploading}
                        >
                          <FiX size={18} />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiUser />
                  Account Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Username:</span>
                    <span className="font-medium dark:text-gray-200">{accountInfo?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium dark:text-gray-200">{accountInfo?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Created:</span>
                    <span className="font-medium dark:text-gray-200">
                      {accountInfo?.account_created && format(new Date(accountInfo.account_created), 'PPP')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Change Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiLock />
                  Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                      {passwordSuccess}
                    </div>
                  )}
                  <Input
                    label="Current Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="primary">
                    <FiSave size={18} />
                    Change Password
                  </Button>
                </form>
              </motion.div>

              {/* Change Username */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiUser />
                  Change Username
                </h2>
                <form onSubmit={handleChangeUsername} className="space-y-4">
                  {usernameError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                      {usernameError}
                    </div>
                  )}
                  {usernameSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                      {usernameSuccess}
                    </div>
                  )}
                  <Input
                    label="New Username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    required
                  />
                  <Button type="submit" variant="primary">
                    <FiSave size={18} />
                    Change Username
                  </Button>
                </form>
              </motion.div>

              {/* Change Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiMail />
                  Change Email
                </h2>
                <form onSubmit={handleChangeEmail} className="space-y-4">
                  {emailError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                      {emailError}
                    </div>
                  )}
                  {emailSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                      {emailSuccess}
                    </div>
                  )}
                  <Input
                    label="New Email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                    required
                  />
                  <Input
                    label="Confirm with Password"
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button type="submit" variant="primary">
                    <FiSave size={18} />
                    Change Email
                  </Button>
                </form>
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiGlobe />
                  Preferences
                </h2>
                <div className="space-y-4">
                  {preferencesSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                      {preferencesSuccess}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <Select
                      value={theme}
                      onChange={(value) => {
                        const newTheme = value as 'light' | 'dark';
                        setTheme(newTheme);
                        setPreferencesSuccess('Theme updated successfully');
                        setTimeout(() => setPreferencesSuccess(''), 3000);
                      }}
                      options={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <Select
                      value={language}
                      onChange={(value) => {
                        const newLanguage = value as 'en' | 'ru';
                        setLanguage(newLanguage);
                        setPreferencesSuccess('Language updated successfully');
                        setTimeout(() => setPreferencesSuccess(''), 3000);
                      }}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'ru', label: 'Russian' },
                      ]}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Delete Account */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card border-red-200 dark:border-red-800"
              >
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                  <FiTrash2 />
                  Danger Zone
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button onClick={() => setDeleteModalOpen(true)} variant="danger">
                  <FiTrash2 size={18} />
                  Delete Account
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletePassword('');
          setDeleteError('');
        }}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you absolutely sure? This action cannot be undone. This will permanently delete your account and all associated data.
          </p>
          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {deleteError}
            </div>
          )}
          <Input
            label="Confirm with Password"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password to confirm"
          />
          <div className="flex gap-3">
            <Button onClick={handleDeleteAccount} variant="danger" className="flex-1">
              Yes, Delete My Account
            </Button>
            <Button
              onClick={() => {
                setDeleteModalOpen(false);
                setDeletePassword('');
                setDeleteError('');
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
