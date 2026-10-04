import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  MessageCircle,
  Bot,
  Clock,
  Users,
  GraduationCap,
  Activity,
  Award,
  CreditCard,
  Play,
  ChevronRight,
  X,
  BookMarked,
  Moon,
  Calendar,
  Settings,
  Shield,
} from 'lucide-react';
import PageHeader from '../ui/PageHeader';

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
        const days =
          (Date.now() - new Date(parsed.timestamp).getTime()) /
          (1000 * 60 * 60 * 24);
        if (days <= 30) setLastRead(parsed);
      } catch {}
    }
  }, []);

  const handleNavigation = (path: string) => navigate(path);

  // ==================== MAIN FEATURES ====================
  const mainFeatures = [
    {
      icon: BookOpen,
      label: 'Read Quran',
      description: 'Read, listen & reflect',
      color: 'from-emerald-500 to-emerald-700',
      path: '/quran',
    },
    {
      icon: BookMarked,
      label: 'Hadiths',
      description: 'Sayings of the Prophet ﷺ',
      color: 'from-amber-500 to-amber-700',
      path: '/hadiths',
    },
    {
      icon: Moon,
      label: 'Athkar & Duas',
      description: 'Daily remembrance',
      color: 'from-indigo-500 to-indigo-700',
      path: '/athkar',
    },
    {
      icon: Clock,
      label: 'Prayer Times',
      description: 'Daily prayer schedule',
      color: 'from-blue-500 to-blue-700',
      path: '/prayer',
    },
    {
  icon: BookMarked,
  label: "Nawawi's 40",
  description: 'Listen to 40 Hadith',
  color: 'from-amber-600 to-amber-800',
  path: '/nawawi40',
},
  ];

  // ==================== COMMUNITY ====================
  const communityFeatures = [
    {
      icon: MessageCircle,
      label: 'Community Chat',
      description: 'Connect with members',
      color: 'bg-blue-500',
      path: '/profile/chat',
    },
    {
      icon: Bot,
      label: 'AI Assistant',
      description: 'Ask Islamic questions',
      color: 'bg-purple-500',
      path: '/profile/ai',
    },
    {
      icon: Calendar,
      label: 'Activities',
      description: 'Events & programs',
      color: 'bg-orange-500',
      path: '/activities',
    },
    {
      icon: Users,
      label: 'Leadership',
      description: 'Meet the team',
      color: 'bg-teal-500',
      path: '/leadership',
    },
  ];

  // ==================== ACCOUNT ====================
  const accountFeatures = [
    {
      icon: CreditCard,
      label: 'Ramadan Program',
      description: 'Register & pay',
      color: 'bg-gau-msa-gold',
      path: '/ramadan',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage profile',
      color: 'bg-gray-500',
      path: '/profile/settings',
    },
  ];

  // ==================== ADMIN ====================
  const isAdmin = user?.role === 'admin' || user?.role === 'registrar';
  const adminFeatures = isAdmin
    ? [
        {
          icon: Shield,
          label: 'Registrar',
          description: 'Manage members',
          color: 'bg-red-500',
          path: '/registrar',
        },
        {
          icon: CreditCard,
          label: 'Ramadan Admin',
          description: 'Verify payments',
          color: 'bg-green-600',
          path: '/admin/ramadan',
        },
      ]
    : [];

  // ==================== RECENT ACTIVITY ====================
  const recentActivities = [
    {
      icon: GraduationCap,
      title: 'Completed Quran Study Session',
      time: '2 hours ago',
    },
    {
      icon: Activity,
      title: "Registered for Da'awa Training",
      time: '5 hours ago',
    },
    {
      icon: Award,
      title: 'Earned Knowledge Badge',
      time: '1 day ago',
    },
  ];

  const timeAgo = (ts: string) => {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div className="space-y-5 md:space-y-8">
      {/* ==================== PAGE HEADER WITH BACK BUTTON ==================== */}
      <PageHeader
        title="Dashboard"
        subtitle="Your Islamic learning hub"
      />

      {/* ==================== WELCOME BANNER ==================== */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-4 md:p-6 text-white shadow-lg overflow-hidden relative">
        {/* Decorative pattern */}
        <div className="absolute -top-4 -right-4 text-8xl font-arabic opacity-10 select-none pointer-events-none">
          ﷽
        </div>

        <div className="relative flex items-center space-x-3 md:space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center text-lg md:text-2xl flex-shrink-0 overflow-hidden ring-2 ring-white/30">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              user?.full_name?.charAt(0) || 'U'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base md:text-2xl font-bold truncate">
              Welcome, {user?.full_name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-xs md:text-sm text-gau-msa-gold mt-0.5">
              May Allah bless your day with knowledge and faith
            </p>
          </div>
        </div>
      </div>

      {/* ==================== CONTINUE READING ==================== */}
      {lastRead && showReminder && (
        <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-4 text-white shadow-lg overflow-hidden">
          <div className="absolute -top-6 -right-6 text-7xl font-arabic opacity-10 select-none pointer-events-none">
            ﷽
          </div>

          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-emerald-100 font-semibold">
                Continue Reading • {timeAgo(lastRead.timestamp)}
              </p>
              <p className="font-bold text-sm md:text-lg truncate mt-0.5">
                {lastRead.surahEnglishName}
              </p>
              <p className="text-[11px] md:text-xs text-emerald-100 truncate">
                Ayah {lastRead.ayahNumber} of {lastRead.totalAyahs}
              </p>
              <div className="mt-2 w-full bg-emerald-900/30 rounded-full h-1">
                <div
                  className="bg-white h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${(lastRead.ayahNumber / lastRead.totalAyahs) * 100}%`,
                  }}
                />
              </div>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`
                )
              }
              className="bg-white text-emerald-700 p-2.5 md:px-4 md:py-2 rounded-lg font-semibold flex items-center space-x-1 flex-shrink-0 shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4" />
              <span className="hidden md:inline">Resume</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== ISLAMIC CONTENT ==================== */}
      <div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gau-msa-primary flex items-center space-x-2">
            <span>Islamic Content</span>
          </h3>
          <span className="text-[10px] md:text-xs text-gray-400">
            Tap to explore
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {mainFeatures.map((feature, i) => (
            <button
              key={i}
              onClick={() => handleNavigation(feature.path)}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-left"
            >
              {/* Colored gradient strip */}
              <div
                className={`h-1 w-full bg-gradient-to-r ${feature.color}`}
              ></div>

              <div className="p-4 md:p-5">
                <div
                  className={`w-11 h-11 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <p className="font-bold text-gray-800 text-sm md:text-base mb-0.5">
                  {feature.label}
                </p>
                <p className="text-[11px] md:text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== COMMUNITY ==================== */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gau-msa-primary mb-3 md:mb-4">
          Community
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {communityFeatures.map((feature, i) => (
            <button
              key={i}
              onClick={() => handleNavigation(feature.path)}
              className="group bg-white rounded-2xl border border-gray-100 p-4 md:p-5 text-left hover:shadow-lg hover:border-gau-msa-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}
              >
                <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800 text-sm md:text-base">
                {feature.label}
              </p>
              <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== MY ACCOUNT ==================== */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gau-msa-primary mb-3 md:mb-4">
          My Account
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {accountFeatures.map((feature, i) => (
            <button
              key={i}
              onClick={() => handleNavigation(feature.path)}
              className="group bg-white rounded-2xl border border-gray-100 p-4 md:p-5 text-left hover:shadow-lg hover:border-gau-msa-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}
              >
                <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800 text-sm md:text-base">
                {feature.label}
              </p>
              <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== ADMIN TOOLS (conditional) ==================== */}
      {adminFeatures.length > 0 && (
        <div>
          <h3 className="text-base md:text-lg font-semibold text-red-600 mb-3 md:mb-4 flex items-center space-x-2">
            <Shield className="h-4 w-4 md:h-5 md:w-5" />
            <span>Admin Tools</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {adminFeatures.map((feature, i) => (
              <button
                key={i}
                onClick={() => handleNavigation(feature.path)}
                className="group bg-white rounded-2xl border border-red-100 p-4 md:p-5 text-left hover:shadow-lg hover:border-red-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  {feature.label}
                </p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================== RECENT ACTIVITY ==================== */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gau-msa-primary mb-3 md:mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {recentActivities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 md:p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gau-msa-primary/10 flex items-center justify-center flex-shrink-0">
                <activity.icon className="h-4 w-4 md:h-5 md:w-5 text-gau-msa-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-800 truncate">
                  {activity.title}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;