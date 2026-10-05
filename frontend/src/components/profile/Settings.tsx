import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../services/api';
import {
  Save,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Hash,
  BookOpen,
  GraduationCap,
  Phone,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '../ui/PageHeader';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Business Administration',
  'Education',
  'Islamic Studies',
  'Economics',
  'Finance and Accounting',
  'Communication Studies',
  'Journalism and Media',
  'Graphic Design',
  'Event Management',
  'Project Management',
  'Islamic Law',
  'Islamic Theology',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate Student'];

const Settings: React.FC = () => {
  const { user, token, setUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('gaumsa-notifications');
    return stored
      ? JSON.parse(stored)
      : { email: true, prayer: true, events: true, messages: true };
  });

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    reg_no: user?.reg_no || '',
    department: user?.department || '',
    year_of_study: user?.year_of_study || '',
    phone: user?.phone || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        reg_no: user.reg_no || '',
        department: user.department || '',
        year_of_study: user.year_of_study || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Save notification preferences to localStorage
  useEffect(() => {
    localStorage.setItem('gaumsa-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!profileData.reg_no.trim()) {
        setError('Registration number is required');
        setSaving(false);
        return;
      }
      if (!profileData.department.trim()) {
        setError('Department is required');
        setSaving(false);
        return;
      }
      if (!profileData.year_of_study.trim()) {
        setError('Year of study is required');
        setSaving(false);
        return;
      }

      const res = await api.updateProfile(token!, {
        reg_no: profileData.reg_no.trim(),
        department: profileData.department,
        year_of_study: profileData.year_of_study,
        phone: profileData.phone.trim() || undefined,
      });

      if (res.success) {
        if (setUser && user) {
          setUser({
            ...user,
            reg_no: profileData.reg_no.trim(),
            department: profileData.department,
            year_of_study: profileData.year_of_study,
            phone: profileData.phone.trim(),
            profile_completed: true,
          });
        }
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and preferences"
      />

      {/* Success */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-start space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-green-700 dark:text-green-300">
            {success}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* ==================== PROFILE ==================== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-colors">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <User className="h-4 w-4 md:h-5 md:w-5 text-gau-msa-primary dark:text-gau-msa-gold mr-2" />
          Profile Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={profileData.full_name}
                readOnly
                disabled
                className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
              />
              <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
                Contact registrar to change your name
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                readOnly
                disabled
                className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
              />
              <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Reg No */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Registration Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="reg_no"
                  required
                  value={profileData.reg_no}
                  onChange={handleChange}
                  placeholder="E101/702/23"
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 z-10" />
                <select
                  name="department"
                  required
                  value={profileData.department}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm appearance-none"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year of Study *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 z-10" />
                <select
                  name="year_of_study"
                  required
                  value={profileData.year_of_study}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm appearance-none"
                >
                  <option value="">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="0712345678"
                  inputMode="tel"
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-gau-msa-primary text-white px-4 md:px-6 py-2.5 md:py-2 rounded-lg hover:bg-gau-msa-secondary active:scale-95 transition-all flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ==================== APPEARANCE ==================== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-colors">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Shield className="h-4 w-4 md:h-5 md:w-5 text-gau-msa-primary dark:text-gau-msa-gold mr-2" />
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isDark ? (
              <Moon className="h-5 w-5 text-indigo-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 text-sm md:text-base">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Toggle dark theme for the application
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              isDark ? 'bg-gau-msa-primary' : 'bg-gray-300'
            }`}
            aria-label="Toggle theme"
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                isDark ? 'transform translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* ==================== NOTIFICATIONS ==================== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-colors">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Bell className="h-4 w-4 md:h-5 md:w-5 text-gau-msa-primary dark:text-gau-msa-gold mr-2" />
          Notification Settings
        </h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 capitalize text-sm md:text-base">
                {key} Notifications
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={() =>
                    setNotifications({ ...notifications, [key]: !value })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-gau-msa-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gau-msa-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;