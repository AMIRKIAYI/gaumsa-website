import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, MessageCircle, Bot, Clock, Users, 
  GraduationCap, Activity, Award, CreditCard,
  Play, ChevronRight, X
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // ✅ Reading progress state
  const [lastRead, setLastRead] = useState<any>(null);
  const [showReminder, setShowReminder] = useState(true);

  // ✅ Load reading progress on mount
  useEffect(() => {
    const stored = localStorage.getItem('lastReadProgress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only show if within last 30 days
        const daysSince = (Date.now() - new Date(parsed.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince <= 30) {
          setLastRead(parsed);
        }
      } catch (err) {
        console.error('Failed to parse progress:', err);
      }
    }
  }, []);

  const handleNavigation = (path: string) => navigate(path);

  const stats = [
    { icon: BookOpen, label: 'Quran Verses Read', value: '1,247', color: 'bg-emerald-500' },
    { icon: MessageCircle, label: 'Messages Sent', value: '89', color: 'bg-blue-500' },
    { icon: Bot, label: 'AI Questions', value: '34', color: 'bg-purple-500' },
    { icon: Clock, label: 'Prayer Reminders', value: '12', color: 'bg-amber-500' },
  ];

  const quickActions = [
    { icon: BookOpen, label: 'Read Quran', color: 'bg-emerald-500', path: '/quran' },
    { icon: MessageCircle, label: 'Community Chat', color: 'bg-blue-500', path: '/profile/chat' },
    { icon: Bot, label: 'Ask AI', color: 'bg-purple-500', path: '/profile/ai' },
    { icon: CreditCard, label: 'Ramadan Program', color: 'bg-gau-msa-gold', path: '/ramadan' },
  ];

  const recentActivities = [
    { icon: GraduationCap, title: 'Completed Quran Study Session', time: '2 hours ago' },
    { icon: Activity, title: 'Registered for Da\'awa Training', time: '5 hours ago' },
    { icon: Award, title: 'Earned Knowledge Badge', time: '1 day ago' },
  ];

  // Time ago helper
  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.full_name} className="w-16 h-16 rounded-full" />
            ) : (
              user?.full_name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.full_name}!</h1>
            <p className="text-gau-msa-gold mt-1">May Allah bless your day with knowledge and faith</p>
          </div>
        </div>
      </div>

      {/* ✅ CONTINUE READING REMINDER */}
      {lastRead && showReminder && (
        <div className="relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden">
          {/* Decorative background */}
          <div className="absolute -top-8 -right-8 text-9xl font-arabic opacity-10 select-none">
            ﷽
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              <div className="p-3 bg-white/20 backdrop-blur rounded-xl flex-shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                    Continue Reading
                  </span>
                  <span className="text-[10px] text-emerald-200">
                    • {timeAgo(lastRead.timestamp)}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold truncate">
                  {lastRead.surahEnglishName}
                </h3>
                <p className="text-sm text-emerald-100">
                  {lastRead.surahName}
                </p>
                <p className="text-xs text-emerald-200 mt-1">
                  You stopped at <strong className="text-white">Ayah {lastRead.ayahNumber}</strong> of {lastRead.totalAyahs}
                </p>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-emerald-900/30 rounded-full h-1.5 max-w-xs">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all"
                    style={{ width: `${(lastRead.ayahNumber / lastRead.totalAyahs) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`)}
              className="bg-white text-emerald-700 px-5 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all flex items-center space-x-2 shadow-lg group flex-shrink-0"
            >
              <Play className="h-5 w-5" />
              <span>Resume</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gau-msa-primary">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gau-msa-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(action.path)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:border-gau-msa-primary group"
            >
              <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-7 w-7 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gau-msa-primary mb-4">Recent Activity</h3>
        <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 hover:bg-white rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-gau-msa-primary/10 flex items-center justify-center">
                <activity.icon className="h-5 w-5 text-gau-msa-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className="text-xs text-gau-msa-primary font-semibold">View</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;