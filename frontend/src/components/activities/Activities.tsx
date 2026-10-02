import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Users, Clock, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Activity } from '../../types';

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
    { id: 'all', label: 'All Activities', icon: '📋' },
    { id: 'mentorship', label: 'Mentorship', icon: '🤝' },
    { id: 'daawa', label: 'Da\'awa', icon: '🕌' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'community', label: 'Community', icon: '🤲' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'social', label: 'Social', icon: '💬' }
  ];

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      mentorship: '🤝',
      daawa: '🕌',
      education: '📚',
      community: '🤲',
      sports: '⚽',
      social: '💬'
    };
    return icons[category] || '📋';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadActivities} 
          className="mt-3 bg-gau-msa-primary text-white px-4 py-2 rounded-lg hover:bg-gau-msa-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">GAUMSA Activities & Events</h2>
        <p className="text-gau-msa-gold mt-1">Join us in various programs to grow in faith and service</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gau-msa-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status.id
                      ? 'bg-gau-msa-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                  <h3 className="text-lg font-bold text-gau-msa-primary">{activity.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(activity.status)}`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gau-msa-primary" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gau-msa-primary" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gau-msa-primary" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gau-msa-primary" />
                  <span>Coordinator: {activity.coordinator}</span>
                </div>
                {activity.maxParticipants && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gau-msa-primary" />
                    <span>{activity.currentParticipants || 0}/{activity.maxParticipants} participants</span>
                  </div>
                )}
              </div>

              {activity.status !== 'completed' && (
                <button
                  onClick={() => handleRegister(activity.id)}
                  className="mt-4 w-full bg-gau-msa-primary text-white px-4 py-2 rounded-lg hover:bg-gau-msa-secondary transition-colors duration-300 flex items-center justify-center space-x-2"
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
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <p className="text-gray-500">No activities found for the selected filters.</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-3xl font-bold text-gau-msa-primary">{activities.length}</div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">
            {activities.filter(a => a.status === 'ongoing').length}
          </div>
          <div className="text-sm text-gray-600">Ongoing</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {activities.filter(a => a.status === 'upcoming').length}
          </div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-3xl font-bold text-gau-msa-gold">
            {activities.reduce((sum, a) => sum + (a.currentParticipants || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Participants</div>
        </div>
      </div>
    </div>
  );
};

export default Activities;