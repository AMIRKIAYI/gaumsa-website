import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../layout/AppSidebar';

const ProfileLayout: React.FC = () => {
  return (
    <div className="container-custom py-4 md:py-8">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Desktop-only sidebar */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-[120px] h-[calc(100vh-140px)] transition-colors">
            <AppSidebar />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-colors">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;