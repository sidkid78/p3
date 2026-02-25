'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    console.log('ThemeToggle rendering with theme:', theme);

    return (
        <button
            onClick={toggleTheme}
            className="size-11 flex items-center justify-center rounded-xl bg-primary/[0.03] border border-panel-border hover:bg-primary/[0.08] transition-all transform active:scale-90 group relative overflow-hidden"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="relative size-6">
                <span className={`material-symbols-outlined absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'} text-primary`}>
                    dark_mode
                </span>
                <span className={`material-symbols-outlined absolute inset-0 transition-all duration-500 ${theme === 'light' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'} text-amber-500`}>
                    light_mode
                </span>
            </div>
        </button>
    );
};

export default ThemeToggle;
