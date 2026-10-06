import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Users,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Activity } from '../../types';
import PageHeader from '../ui/PageHeader';

const Activities: React.FC = () => {
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [selectedCategory, selectedStatus]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getActivities(selectedCategory, selectedStatus);
      if (res.success) {
        setActivities(res.data);
      } else {
        setError(res.error || 'Failed to load activities');
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setError('Failed to load activities. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async (activityId: string) => {
    if (!token) {
      alert('Please login first');
      return;
    }
    try {
      const res = await api.registerForActivity(token, activityId);
      if (res.success) {
        alert('Registered successfully!');
        loadActivities();
      } else {
        alert(res.error || 'Registration failed');
      }
    } catch (error) {
      alert('Error registering for activity');
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'mentorship', label: 'Mentorship', icon: '🤝' },
    { id: 'daawa', label: "Da'awa", icon: '🕌' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'community', label: 'Community', icon: '🤲' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'social', label: 'Social', icon: '💬' },
  ];

  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      mentorship: '🤝',
      daawa: '🕌',
      education: '📚',
      community: '🤲',
      sports: '⚽',
      social: '💬',
    };
    return icons[category] || '📋';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Activities & Events"
        subtitle="Join us in various programs to grow in faith and service"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-4 md:p-6 text-white shadow-lg">
        <h2 className="text-lg md:text-2xl font-bold">
          GAUMSA Activities & Events
        </h2>
        <p className="text-gau-msa-gold mt-1 text-xs md:text-base">
          Join us in various programs to grow in faith and service
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-6 transition-colors">
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all active:scale-95 ${
                    selectedCategory === category.id
                      ? 'bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all active:scale-95 ${
                    selectedStatus === status.id
                      ? 'bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary dark:border-gau-msa-gold"></div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <button
            onClick={loadActivities}
            className="mt-3 bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gau-msa-secondary dark:hover:opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Activities Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-xl md:text-2xl flex-shrink-0">
                        {getCategoryIcon(activity.category)}
                      </span>
                      <h3 className="text-sm md:text-lg font-bold text-gau-msa-primary dark:text-gau-msa-gold truncate">
                        {activity.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold flex-shrink-0 ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {activity.status.charAt(0).toUpperCase() +
                        activity.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3">
                    {activity.description}
                  </p>

                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                      <span className="truncate">{activity.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                      <span className="truncate">{activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                      <span className="truncate">
                        Coordinator: {activity.coordinator}
                      </span>
                    </div>
                    {activity.maxParticipants && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                        <span>
                          {activity.currentParticipants || 0}/
                          {activity.maxParticipants} participants
                        </span>
                      </div>
                    )}
                  </div>

                  {activity.status !== 'completed' && (
                    <button
                      onClick={() => handleRegister(activity.id)}
                      className="mt-4 w-full bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 px-4 py-2.5 md:py-2 rounded-lg hover:bg-gau-msa-secondary dark:hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm font-semibold"
                    >
                      <span>Register</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {activities.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No activities found for the selected filters.
              </p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-4 text-center transition-colors">
              <div className="text-xl md:text-3xl font-bold text-gau-msa-primary dark:text-gau-msa-gold">
                {activities.length}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400">
                Total Activities
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-4 text-center transition-colors">
              <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                {activities.filter((a) => a.status === 'ongoing').length}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400">
                Ongoing
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-4 text-center transition-colors">
              <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {activities.filter((a) => a.status === 'upcoming').length}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400">
                Upcoming
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-4 text-center transition-colors">
              <div className="text-xl md:text-3xl font-bold text-gau-msa-gold">
                {activities.reduce(
                  (sum, a) => sum + (a.currentParticipants || 0),
                  0
                )}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400">
                Total Participants
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Activities;