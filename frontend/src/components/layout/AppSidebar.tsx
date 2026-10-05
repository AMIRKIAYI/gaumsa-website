import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  MessageCircle,
  Bot,
  Settings,
  LogOut,
  Calendar,
  BookOpen,
  Users,
  Clock,
  BookMarked,
  Moon,
  X,
} from 'lucide-react';

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileLinks = [
    { path: '/profile/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile/chat', label: 'Community Chat', icon: MessageCircle },
    { path: '/profile/ai', label: 'AI Assistant', icon: Bot },
    { path: '/profile/settings', label: 'Settings', icon: Settings },
  ];

  const mainLinks = [
    { path: '/quran', label: 'Quran', icon: BookOpen },
    { path: '/hadiths', label: 'Hadiths', icon: BookMarked },
    { path: '/nawawi40', label: "Nawawi's 40", icon: BookMarked },
    { path: '/athkar', label: 'Athkar', icon: Moon },
    { path: '/prayer', label: 'Prayer Times', icon: Clock },
    { path: '/activities', label: 'Activities', icon: Calendar },
    { path: '/leadership', label: 'Leadership', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrator'
      : user?.role === 'registrar'
      ? 'Registrar'
      : 'Student Member';

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 relative h-full transition-colors">
      {/* Close button (mobile only) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10 bg-white/90 dark:bg-gray-800/90"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Profile Header — gradient stays the same (already dark-friendly) */}
      <div className="bg-gradient-to-br from-gau-msa-primary to-gau-msa-secondary p-5 md:p-6 text-white text-center relative overflow-hidden">
        <div className="absolute -top-4 -right-4 text-7xl font-arabic opacity-10 select-none pointer-events-none">
          ﷽
        </div>
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 overflow-hidden ring-2 ring-white/30">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-bold">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base md:text-lg truncate">
            {user?.full_name}
          </h3>
          <p className="text-xs md:text-sm text-gau-msa-gold truncate">
            {user?.email}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[11px] md:text-xs">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Navigation — scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 md:p-4">
        {/* My Profile */}
        <p className="text-[10px] md:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 md:mb-3 px-3">
          My Profile
        </p>
        <div className="space-y-1">
          {profileLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-gau-msa-primary text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold'
                }`
              }
            >
              <link.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 my-3 md:my-4"></div>

        {/* Islamic Content */}
        <p className="text-[10px] md:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 md:mb-3 px-3">
          Islamic Content
        </p>
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-gau-msa-primary text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold'
                }`
              }
            >
              <link.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 my-3 md:my-4"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;