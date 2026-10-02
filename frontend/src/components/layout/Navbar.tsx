import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, X, LogOut, BookOpen, MessageCircle, Bot, 
  Clock, Home, LayoutDashboard, ChevronDown, Calendar, Users, Settings
} from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="container-custom">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Logo size="sm" className="md:hidden" />
            <Logo size="md" className="hidden md:flex" />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-gau-msa-primary text-white'
                      : 'text-gray-700 hover:text-gau-msa-primary hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </button>
              ))}
              
              <div className="relative ml-2">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isProfileOpen || location.pathname.startsWith('/profile')
                      ? 'bg-gau-msa-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-gau-msa-primary/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-sm font-semibold">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium">My Profile</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {profileLinks.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => handleNavigation(link.path)}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Full Screen Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-white z-30 overflow-y-auto">
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-lg text-left ${
                  isActive(link.href)
                    ? 'bg-gau-msa-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </button>
            ))}

            <div className="border-t border-gray-100 my-3"></div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pb-2">
              My Profile
            </p>
            {profileLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-lg text-left ${
                  isActive(link.path)
                    ? 'bg-gau-msa-primary/10 text-gau-msa-primary'
                    : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </button>
            ))}

            <div className="border-t border-gray-100 my-3"></div>

            <div className="px-4 py-3 flex items-center space-x-3">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gau-msa-primary text-white flex items-center justify-center font-semibold">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;