'use client';

import React from 'react';

import ThemeToggle from '@/components/atoms/ThemeToggle';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-panel-bg backdrop-blur-xl border-b border-panel-border px-10 py-4 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="material-symbols-outlined opacity-60 lg:hidden hover:text-primary transition-colors p-2 -ml-2 rounded-lg hover:bg-primary/5 active:scale-95"
        >
          menu
        </button>
        <h2 className="text-text-main text-lg font-bold tracking-tight font-display">Passy Dashboard</h2>
      </div>
      <div className="flex items-center gap-8">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-xl">search</span>
          <input
            className="w-80 h-11 pl-12 pr-4 rounded-xl border border-panel-border bg-primary/[0.03] text-sm text-text-main focus:ring-2 focus:ring-primary/30 transition-all placeholder:opacity-40"
            placeholder="Search ideas or guests..."
            type="text"
          />
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <button className="relative size-11 flex items-center justify-center rounded-xl bg-primary/[0.03] border border-panel-border hover:bg-primary/[0.08] transition-colors">
            <span className="material-symbols-outlined opacity-60">notifications</span>
            <span className="absolute top-3 right-3.5 size-2 bg-primary rounded-full ring-4 ring-bg-main transition-all"></span>
          </button>
          <div className="h-11 w-11 rounded-xl border border-primary/40 overflow-hidden shadow-lg shadow-primary/10">
            <img
              alt="Profile"
              className="object-cover size-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMmY7cavXOzK46DErJTcoV2yosQ_7S7KWdjYM98J3bovGR231_9zaptxPfVTEQKq4t4bI7Pvj32h9lXm-IuGmsYfiqe2kkicpbAfguuSOC6W_lTanvKna6un-prDsBNfm_ojF1_wnUP18rtX-EnbYG090VBTZoyG1SALmVDYX5mYrsiGHWKb8VbTpGgGNMui_PrEokzdhRVgDvesCLhZ7k4tJCVDI6FDDQ_n2g5zLENXBBHQcD5hpE-WcVPEzIkWJq9qhC9W9YgPs"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
