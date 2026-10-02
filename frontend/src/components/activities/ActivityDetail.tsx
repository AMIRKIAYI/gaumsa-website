import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Users, Clock, Share2, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Activity } from '../../types';

const ActivityDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }
  }, [id]);

  const loadActivity = async (activityId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all activities and find the one with matching ID
      const res = await api.getActivities();
      if (res.success) {
        const found = res.data.find((a: Activity) => a.id === activityId);
        if (found) {
          setActivity(found);
        } else {
          setError('Activity not found');
        }
      } else {
        setError(res.error || 'Failed to load activity');
      }
    } catch (error) {
      console.error('Error loading activity:', error);
      setError('Failed to load activity. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (!activity) return;

    setRegistering(true);
    try {
      const res = await api.registerForActivity(token, activity.id);
      if (res.success) {
        alert('Successfully registered for this activity! 🎉');
        // Refresh activity data to update participant count
        loadActivity(activity.id);
      } else {
        alert(res.error || 'Registration failed');
      }
    } catch (error) {
      alert('Error registering for activity');
    }
    setRegistering(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity?.title || 'GAUMSA Activity',
        text: `Join us for ${activity?.title}! ${activity?.description}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-gau-msa-primary" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Activity Not Found</h3>
        <p className="text-gray-500 mb-4">{error || 'The activity you are looking for does not exist.'}</p>
        <button
          onClick={() => navigate('/activities')}
          className="bg-gau-msa-primary text-white px-6 py-2 rounded-lg hover:bg-gau-msa-secondary transition-colors"
        >
          Back to Activities
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/activities')}
          className="flex items-center space-x-2 text-gau-msa-primary hover:text-gau-msa-secondary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Activities</span>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl">
                {activity.category === 'education' && '📚'}
                {activity.category === 'mentorship' && '🤝'}
                {activity.category === 'daawa' && '🕌'}
                {activity.category === 'community' && '🤲'}
                {activity.category === 'sports' && '⚽'}
                {activity.category === 'social' && '💬'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gau-msa-primary">{activity.title}</h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base">{activity.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(activity.status)}`}>
            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 my-6 p-4 bg-gray-50 rounded-xl">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="h-5 w-5 text-gau-msa-primary flex-shrink-0" />
              <span>{activity.date}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Clock className="h-5 w-5 text-gau-msa-primary flex-shrink-0" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="h-5 w-5 text-gau-msa-primary flex-shrink-0" />
              <span>{activity.location}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-700">
              <User className="h-5 w-5 text-gau-msa-primary flex-shrink-0" />
              <span>Coordinator: <span className="font-medium">{activity.coordinator}</span></span>
            </div>
            {activity.maxParticipants && (
              <div className="flex items-center space-x-3 text-gray-700">
                <Users className="h-5 w-5 text-gau-msa-primary flex-shrink-0" />
                <span>
                  <span className="font-medium">{activity.currentParticipants || 0}</span>
                  <span className="text-gray-400"> / {activity.maxParticipants}</span>
                  <span className="ml-2 text-sm text-gray-400">participants</span>
                </span>
              </div>
            )}
            {activity.maxParticipants && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-gau-msa-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(((activity.currentParticipants || 0) / activity.maxParticipants) * 100, 100)}%` 
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {activity.status !== 'completed' && (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="bg-gau-msa-primary text-white px-6 py-3 rounded-lg hover:bg-gau-msa-secondary transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registering ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Register Now</span>
                  <span className="text-gau-msa-gold">→</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={handleShare}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">About This Activity</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-400">Category</span>
              <p className="font-medium text-gray-700 capitalize">{activity.category}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-400">Status</span>
              <p className="font-medium text-gray-700 capitalize">{activity.status}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-400">Spots Available</span>
              <p className="font-medium text-gray-700">
                {activity.maxParticipants 
                  ? `${activity.maxParticipants - (activity.currentParticipants || 0)} spots left`
                  : 'Unlimited spots'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;