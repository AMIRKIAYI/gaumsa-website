import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save, User, Bell, Shield, Moon, Sun } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    prayer: true,
    events: true,
    messages: true,
  });

  const [profileData, setProfileData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    department: '',
    year: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gau-msa-primary">Settings</h2>

      {/* Profile Settings */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="h-5 w-5 text-gau-msa-primary mr-2" />
          Profile Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study
              </label>
              <select
                value={profileData.year}
                onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-gau-msa-primary text-white px-6 py-2 rounded-lg hover:bg-gau-msa-secondary transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </form>
      </div>

      {/* Preferences */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Bell className="h-5 w-5 text-gau-msa-primary mr-2" />
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle dark theme for the application</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isDarkMode ? 'bg-gau-msa-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isDarkMode ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-gau-msa-primary mr-2" />
          Notification Settings
        </h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{key} Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setNotifications({ ...notifications, [key]: !value })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-gau-msa-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gau-msa-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;