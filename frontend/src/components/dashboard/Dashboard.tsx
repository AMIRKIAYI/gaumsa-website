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
  const [lastRead, setLastRead] = useState<any>(null);
  const [showReminder, setShowReminder] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('lastReadProgress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const days = (Date.now() - new Date(parsed.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        if (days <= 30) setLastRead(parsed);
      } catch {}
    }
  }, []);

  const handleNavigation = (path: string) => navigate(path);

  const stats = [
    { icon: BookOpen, label: 'Quran Read', value: '1,247', color: 'bg-emerald-500' },
    { icon: MessageCircle, label: 'Messages', value: '89', color: 'bg-blue-500' },
    { icon: Bot, label: 'AI Questions', value: '34', color: 'bg-purple-500' },
    { icon: Clock, label: 'Reminders', value: '12', color: 'bg-amber-500' },
  ];

  const quickActions = [
    { icon: BookOpen, label: 'Read Quran', color: 'bg-emerald-500', path: '/quran' },
    { icon: MessageCircle, label: 'Chat', color: 'bg-blue-500', path: '/profile/chat' },
    { icon: Bot, label: 'Ask AI', color: 'bg-purple-500', path: '/profile/ai' },
    { icon: CreditCard, label: 'Ramadan', color: 'bg-gau-msa-gold', path: '/ramadan' },
  ];

  const recentActivities = [
    { icon: GraduationCap, title: 'Completed Quran Study Session', time: '2 hours ago' },
    { icon: Activity, title: 'Registered for Da\'awa Training', time: '5 hours ago' },
    { icon: Award, title: 'Earned Knowledge Badge', time: '1 day ago' },
  ];

  const timeAgo = (ts: string) => {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div className="space-y-4 md:space-y-6 px-1">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-4 md:p-6 text-white">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center text-lg md:text-2xl flex-shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.full_name?.charAt(0) || 'U'
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-2xl font-bold truncate">
              Welcome, {user?.full_name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-xs md:text-sm text-gau-msa-gold mt-0.5">
              May Allah bless your day
            </p>
          </div>
        </div>
      </div>

      {/* Continue Reading */}
      {lastRead && showReminder && (
        <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-4 text-white shadow-lg overflow-hidden">
          <div className="absolute -top-6 -right-6 text-7xl font-arabic opacity-10 select-none">
            ﷽
          </div>

          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-emerald-100">
                Continue Reading • {timeAgo(lastRead.timestamp)}
              </p>
              <p className="font-bold text-sm md:text-lg truncate">
                {lastRead.surahEnglishName}
              </p>
              <p className="text-[11px] md:text-xs text-emerald-100 truncate">
                Ayah {lastRead.ayahNumber} of {lastRead.totalAyahs}
              </p>
              <div className="mt-2 w-full bg-emerald-900/30 rounded-full h-1">
                <div
                  className="bg-white h-1 rounded-full"
                  style={{ width: `${(lastRead.ayahNumber / lastRead.totalAyahs) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => navigate(`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`)}
              className="bg-white text-emerald-700 p-2.5 md:px-4 md:py-2 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 shadow-md"
            >
              <Play className="h-4 w-4" />
              <span className="hidden md:inline">Resume</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] md:text-sm text-gray-500 truncate">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gau-msa-primary">{stat.value}</p>
              </div>
              <div className={`w-9 h-9 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gau-msa-primary mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleNavigation(action.path)}
              className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center hover:shadow-lg hover:border-gau-msa-primary active:scale-95 transition-all group"
            >
              <div className={`w-11 h-11 md:w-14 md:h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-700">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gau-msa-primary mb-3">
          Recent Activity
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 md:p-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gau-msa-primary/10 flex items-center justify-center flex-shrink-0">
                <activity.icon className="h-4 w-4 md:h-5 md:w-5 text-gau-msa-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-800 truncate">
                  {activity.title}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;