'use client';

import React from 'react';
import { useNavigation } from '@/lib/navigation';
import { Page } from '@/types/navigation';

interface NavItemProps {
  icon: string;
  label: string;
  page: Page;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all cursor-pointer group relative overflow-hidden ${active
        ? 'bg-primary/20 text-text-main border border-primary/30 shadow-[0_0_15px_rgba(165,61,245,0.1)]'
        : 'hover:bg-primary/[0.05] text-gray-500 hover:text-text-main border border-transparent'
        }`}
    >
      {active && (
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent pointer-events-none" />
      )}
      <span className={`material-symbols-outlined text-[22px] transition-all duration-300 ${active ? 'lavender-glow scale-110' : 'group-hover:text-primary group-hover:scale-105'}`}>
        {icon}
      </span>
      <p className={`text-sm tracking-wide transition-all ${active ? 'font-bold' : 'font-medium'}`}>{label}</p>
      {active && (
        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      )}
    </div>
  );
};

const Sidebar = () => {
  const { page, navigate } = useNavigation();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', page: Page.Dashboard },
    { icon: 'auto_awesome', label: 'AI Theme Assistant', page: Page.ThemeAssistant },
    { icon: 'group', label: 'Guest Manager', page: Page.Guests },
    { icon: 'checklist', label: 'Checklist', page: Page.Tasks },
    { icon: 'account_balance_wallet', label: 'Budget Tracker', page: Page.Budget },
    { icon: 'photo_library', label: 'Photo Gallery', page: Page.Vendors },
  ];

  return (
    <aside className="w-72 flex flex-col glass-panel h-full p-6 overflow-y-auto border-r border-panel-border transition-colors duration-300">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-primary/10 rounded-2xl p-2.5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
          <span className="material-symbols-outlined text-primary text-2xl">child_care</span>
        </div>
        <div className="flex flex-col">
          <h1 className="font-display text-text-main text-xl font-bold tracking-tight">Passy</h1>
          <p className="text-primary opacity-60 text-[10px] font-black uppercase tracking-[0.2em]">Baby Shower Pro</p>
        </div>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.page}
            {...item}
            active={page === item.page}
            onClick={() => navigate(item.page)}
          />
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-panel-border flex flex-col gap-4">
        <button
          onClick={() => navigate(Page.Settings)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl h-12 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:animate-spin">add</span>
          <span>New Event</span>
        </button>
        <div
          onClick={() => navigate(Page.Settings)}
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all cursor-pointer group ${page === Page.Settings ? 'bg-primary/10 text-text-main' : 'text-gray-500 hover:text-text-main hover:bg-primary/5'
            }`}
        >
          <span className={`material-symbols-outlined ${page === Page.Settings ? 'text-primary' : 'group-hover:text-primary'}`}>settings</span>
          <p className="text-sm font-medium">Settings</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
