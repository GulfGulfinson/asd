import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Bell, Lock } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-4 w-4 mr-2 inline" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bell className="h-4 w-4 mr-2 inline" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Lock className="h-4 w-4 mr-2 inline" />
            Security
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>
          <div className="card-body">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user ? `${user.firstName} ${user.lastName}` : ''}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="input"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Learning Preferences</h3>
          </div>
          <div className="card-body">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select className="input">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select className="input">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Learning Goal (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  min="5"
                  max="120"
                  className="input"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Daily Reminders</h4>
                  <p className="text-sm text-gray-500">Get reminded to complete your daily lesson</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">New Lesson Alerts</h4>
                  <p className="text-sm text-gray-500">Be notified when new lessons are available</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>

              <div className="flex justify-end">
                <button className="btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          </div>
          <div className="card-body">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input type="password" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input type="password" className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input type="password" className="input" />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 