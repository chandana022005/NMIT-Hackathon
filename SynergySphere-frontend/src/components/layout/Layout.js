import React from 'react';
import { Outlet } from 'react-router-dom';
import DesktopSidebar from './DesktopSidebar';
import MobileBottomNav from './MobileBottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="md:ml-64">
        <main className="pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
