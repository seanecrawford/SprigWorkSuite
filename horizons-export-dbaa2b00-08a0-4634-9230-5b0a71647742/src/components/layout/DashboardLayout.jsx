import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const currentUser = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
    email: user?.email,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentUser={currentUser} />

      <div className="flex flex-col flex-1 transition-all duration-300 ml-0 md:ml-64 px-4 pt-4">
        <Header currentUser={currentUser} onSignOut={signOut} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
