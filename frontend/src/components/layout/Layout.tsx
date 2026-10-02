import React from 'react';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1 mt-[104px]"> {/* 40px (TopBar) + 64px (Navbar) */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;