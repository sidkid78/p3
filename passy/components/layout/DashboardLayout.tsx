import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden relative z-10 bg-bg-main text-text-main font-display transition-colors duration-300">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="orb top-[-10%] left-[-5%] w-[400px] h-[400px] animate-pulse bg-primary" />
        <div className="orb bottom-[-10%] right-[-5%] w-[400px] h-[400px] animate-pulse bg-secondary-rose" />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <Header />
        <div className="max-w-7xl mx-auto p-6 lg:p-12 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
