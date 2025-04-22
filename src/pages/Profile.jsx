import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, darkMode, toggleDarkMode, credit } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (!formData.currentPassword) {
        toast.error('Current password is required');
        return;
      }
    }
    
    // Mock update for now - would connect to backend
    toast.success('Profile updated successfully');
    
    // Reset password fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 px-4 pb-12"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Account Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage your profile and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* User Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Account Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Credits</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">{credit}</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Member Since</div>
                <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mt-1">2023</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Plan</div>
                <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mt-1">Free</div>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <form onSubmit={handleSubmit} className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-neutral-800 dark:text-neutral-100 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
          
          {/* Preferences */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100">Dark Mode</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Switch between light and dark theme
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    darkMode ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100">Email Notifications</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Receive updates and promotional emails
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-200 dark:bg-neutral-700"
                >
                  <span className="sr-only">Toggle notifications</span>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="card p-6 border-red-200 dark:border-red-900/50">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100">Delete Account</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      // Handle account deletion
                      toast.info("Account deletion would be processed here");
                    }
                  }}
                  className="btn-danger text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile; 