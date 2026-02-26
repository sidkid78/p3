'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeResponse {
    themeName: string;
    description: string;
    colorPalette: string[];
    images: {
        title: string;
        prompt: string;
        aspect: string;
        url?: string;
    }[];
    tags: string[];
}

interface ThemeContextType {
    confirmedTheme: ThemeResponse | null;
    setConfirmedTheme: (theme: ThemeResponse | null) => void;
}

const AIThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AIThemeProvider = ({ children }: { children: ReactNode }) => {
    const [confirmedTheme, setConfirmedTheme] = useState<ThemeResponse | null>(null);

    return (
        <AIThemeContext.Provider value={{ confirmedTheme, setConfirmedTheme }}>
            {children}
        </AIThemeContext.Provider>
    );
};

export const useAITheme = () => {
    const context = useContext(AIThemeContext);
    if (context === undefined) {
        throw new Error('useAITheme must be used within an AIThemeProvider');
    }
    return context;
};
