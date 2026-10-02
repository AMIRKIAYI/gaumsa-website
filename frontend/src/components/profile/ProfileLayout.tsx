import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, LayoutDashboard, MessageCircle, Bot, 
  Settings, LogOut, ChevronRight, Calendar, BookOpen, Users, Clock
} from 'lucide-react';

const ProfileLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const profileLinks = [
    { path: '/profile/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile/chat', label: 'Community Chat', icon: MessageCircle },
    { path: '/profile/ai', label: 'AI Assistant', icon: Bot },
    { path: '/profile/settings', label: 'Settings', icon: Settings },
  ];

  const mainLinks = [
    { path: '/activities', label: 'Activities', icon: Calendar },
    { path: '/leadership', label: 'Leadership', icon: Users },
    { path: '/quran', label: 'Quran', icon: BookOpen },
    { path: '/prayer', label: 'Prayer Times', icon: Clock },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`lg:w-72 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary p-6 text-white text-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.full_name} className="w-20 h-20 rounded-full" />
                  ) : (
                    <span className="text-3xl font-bold">{user?.full_name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{user?.full_name}</h3>
                <p className="text-sm text-gau-msa-gold">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs">
                  {user?.role === 'admin' ? 'Administrator' : 'Student Member'}
                </span>
              </div>

              {/* Profile Navigation */}
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  My Profile
                </p>
                <div className="space-y-1">
                  {profileLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gau-msa-primary text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gau-msa-primary'
                        }`
                      }
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  Main Menu
                </p>
                <div className="space-y-1">
                  {mainLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gau-msa-primary text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gau-msa-primary'
                        }`
                      }
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden mb-4 flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md"
            >
              <ChevronRight className={`h-5 w-5 transition-transform ${isSidebarOpen ? 'rotate-90' : ''}`} />
              <span>Menu</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;