import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  LogOut,
  BookOpen,
  MessageCircle,
  Bot,
  Clock,
  Home,
  LayoutDashboard,
  ChevronDown,
  Calendar,
  Users,
  Settings,
} from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/activities', label: 'Activities', icon: Calendar },
    { href: '/leadership', label: 'Leadership', icon: Users },
    { href: '/quran', label: 'Quran', icon: BookOpen },
    { href: '/prayer', label: 'Prayer Times', icon: Clock },
  ];

  const profileLinks = [
    { path: '/profile/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile/chat', label: 'Chat', icon: MessageCircle },
    { path: '/profile/ai', label: 'AI Assistant', icon: Bot },
    { path: '/profile/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 md:top-[28px] left-0 right-0 z-50 transition-colors duration-300">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Logo size="md" className="flex-shrink-0" />

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-gau-msa-primary text-white hover:bg-gau-msa-secondary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </button>
            ))}

            <div className="relative ml-2">
              <button
                onClick={() =>
                  setIsProfileDropdownOpen(!isProfileDropdownOpen)
                }
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isProfileDropdownOpen ||
                  location.pathname.startsWith('/profile')
                    ? 'bg-gau-msa-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full ring-2 ring-gau-msa-primary/20"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isProfileDropdownOpen ||
                      location.pathname.startsWith('/profile')
                        ? 'bg-white/20 text-white'
                        : 'bg-gau-msa-primary text-white'
                    }`}
                  >
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium">My Profile</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full ring-2 ring-gau-msa-primary/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-sm font-bold">
                          {user?.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {user?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {profileLinks.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => handleNavigation(link.path)}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors duration-200 ${
                          location.pathname === link.path
                            ? 'bg-gau-msa-primary/10 text-gau-msa-primary'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold'
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-2 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`px-4 py-2.5 transition-all duration-200 flex items-center space-x-3 rounded-lg w-full text-left ${
                    isActive(link.href)
                      ? 'bg-gau-msa-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </button>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  My Profile
                </p>
              </div>

              {profileLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`px-4 py-2.5 transition-all duration-200 flex items-center space-x-3 rounded-lg w-full text-left ${
                    location.pathname === link.path
                      ? 'bg-gau-msa-primary/10 text-gau-msa-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </button>
              ))}

              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 mt-2">
                <div className="flex items-center space-x-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full ring-2 ring-gau-msa-primary/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-sm font-bold">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mx-4 px-4 py-2.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-3 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;