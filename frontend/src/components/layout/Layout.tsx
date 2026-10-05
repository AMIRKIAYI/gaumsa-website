import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import AppSidebar from './AppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Listen for the custom event dispatched by PageHeader's Menu button
  useEffect(() => {
    const handler = () => setIsSidebarOpen(true);
    window.addEventListener('open-profile-sidebar', handler);
    return () => window.removeEventListener('open-profile-sidebar', handler);
  }, []);

  // Lock body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <TopBar />
      <Navbar />
      <main className="flex-1 pt-14 md:pt-[104px] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {children}
      </main>
      <Footer />

      {/* Global mobile sidebar — works on every page */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSidebar}
          ></div>

          {/* Sidebar Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-gray-800 h-full overflow-hidden shadow-2xl">
            <AppSidebar onClose={closeSidebar} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;