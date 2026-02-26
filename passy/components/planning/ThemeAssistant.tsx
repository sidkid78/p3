'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateTheme } from '@/app/actions/ai/generate-theme';
import { useAITheme } from '@/context/AIThemeContext';
import { useNavigation } from '@/lib/navigation';
import { Page } from '@/types/navigation';
import MoodBoard from './MoodBoard';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

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
    aiResponse: string;
}

const ThemeAssistant = () => {
    const { setConfirmedTheme } = useAITheme();
    const { navigate } = useNavigation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState<ThemeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleConfirmTheme = () => {
        if (theme) {
            setConfirmedTheme(theme);
            navigate(Page.GamePlanner);
        }

    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setError(null);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const result = await generateTheme(userMessage, history);

            setTheme(result);
            setMessages(prev => [...prev, { role: 'assistant', content: result.aiResponse }]);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-700">
            {/* Standardized Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">AI Studio</span>
                        <span className="text-white/20 text-xs">/</span>
                        <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Theme Assistant</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-2">
                        Theme Assistant
                    </h1>
                    <p className="text-white/50 text-base max-w-xl">
                        Design your dream celebration mood board with the power of Gemini AI.
                    </p>
                </div>
                {theme && (
                    <div className="bg-primary/5 border border-primary/30 px-5 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <span className="material-symbols-outlined text-primary text-xl lavender-glow">auto_awesome</span>
                        <span className="text-sm font-bold text-primary tracking-wide">Active Concept: {theme.themeName}</span>
                    </div>
                )}
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-320px)] min-h-[600px] overflow-hidden">

                {/* Left: Chat Interface */}
                <div className="flex flex-col w-full lg:w-[35%] rounded-3xl glass-panel overflow-hidden transition-all hover:border-white/20">
                    {/* Chat Header */}
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/40 rounded-full blur-md animate-pulse"></div>
                                <div className="size-10 rounded-full bg-black/40 border border-primary/30 relative z-10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                </div>
                                <span className="absolute bottom-0 right-0 size-3 bg-green-400 border-2 border-[#1a151d] rounded-full z-20 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-white font-display text-base font-bold tracking-wide">Gemini AI</h3>
                                <p className="text-primary/60 text-[10px] uppercase tracking-widest font-bold">Theme Expert</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-50">
                                <span className="material-symbols-outlined text-4xl text-primary">chat_bubble</span>
                                <p className="text-sm text-gray-400 max-w-[200px]">Describe the vibe or colors you want for your baby shower.</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col gap-2 max-w-[90%] ${msg.role === 'user' ? 'items-end ml-auto' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-linear-to-tr from-primary to-secondary-rose text-white shadow-lg shadow-primary/20 rounded-tr-sm'
                                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/5 bg-white/5">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Refine your theme..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 size-10 bg-primary rounded-xl text-white shadow-lg shadow-primary/40 flex items-center justify-center transform hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Mood Board Display */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {theme ? (
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-white text-xl font-display font-bold flex items-center gap-3">
                                    Generated Mood Board
                                    <span className="text-[10px] bg-white/5 border border-white/10 text-primary px-2 py-1 rounded-md uppercase tracking-widest font-bold">Concept Ready</span>
                                </h3>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">download</span> Export
                                    </button>
                                </div>
                            </div>

                            <MoodBoard theme={theme} />

                            {/* Call to action */}
                            <div className="mt-8 flex items-center gap-5 glass-panel p-6 rounded-3xl border-primary/20 bg-linear-to-r from-primary/10 to-transparent">
                                <div className="size-12 rounded-2xl bg-linear-to-br from-primary/30 to-secondary-rose/30 flex items-center justify-center border border-white/10 shadow-lg">
                                    <span className="material-symbols-outlined text-white">auto_awesome</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-white font-display leading-tight">Ready to finalize?</p>
                                    <p className="text-sm text-gray-400 font-light">Confirm this theme to start planning your event details.</p>
                                </div>
                                <button
                                    onClick={handleConfirmTheme}
                                    className="bg-linear-to-r from-primary to-secondary-rose text-white font-bold text-sm px-8 py-3 rounded-xl transform hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                >
                                    Confirm Theme
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel rounded-3xl border-dashed border-white/10">
                            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-white/20">photo_library</span>
                            </div>
                            <h3 className="text-xl text-white font-display font-bold mb-2">Build your mood board</h3>
                            <p className="text-gray-500 text-sm max-w-sm">
                                Describe your dream celebration in the chat to see a custom mood board instantly.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-secondary-rose/90 backdrop-blur-xl text-white text-sm font-bold rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                    <span className="material-symbols-outlined text-xl">error</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ThemeAssistant;
