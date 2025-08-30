import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, User, Mail, Save, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await updateProfile(data);
    setIsLoading(false);
    
    if (result.success) {
      reset(data);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Profile Settings
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                    <input
                      type="text"
                      {...register('username', {
                        required: 'Username is required',
                        minLength: {
                          value: 3,
                          message: 'Username must be at least 3 characters',
                        },
                        maxLength: {
                          value: 30,
                          message: 'Username cannot exceed 30 characters',
                        },
                      })}
                      className="input-field pl-10"
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="input-field pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {user?.stats?.totalMessages || 0}
                  </div>
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">
                    Total Messages
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 dark:text-accent-400">
                    {user?.stats?.totalTokens || 0}
                  </div>
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">
                    Total Tokens
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                    {user?.stats?.lastActive ? new Date(user.stats.lastActive).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">
                    Last Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Account Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Key className="h-4 w-4" />
                  <span>Change Password</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Theme
                  </label>
                  <select className="input-field">
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Language
                  </label>
                  <select className="input-field">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
