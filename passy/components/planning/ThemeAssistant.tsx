'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/atoms/GlassCard';
import { generateTheme } from '@/app/actions/ai/generate-theme';
import MoodBoard from './MoodBoard';

interface ThemeResponse {
    themeName: string;
    description: string;
    colorPalette: string[];
    imagePrompts: {
        venue: string;
        invitation: string;
        cake: string;
    };
    tags: string[];
}

const ThemeAssistant = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState<ThemeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await generateTheme(input);
            setTheme(result);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-10 min-h-[600px] relative">
            <div className="bg-orb top-[-20%] left-[-10%] bg-primary opacity-30 blur-[120px]"></div>

            {!theme ? (
                <div className="flex flex-col items-center justify-center gap-10 py-12 lg:py-24 max-w-3xl mx-auto w-full text-center">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-serif text-5xl lg:text-7xl font-black text-white leading-tight">
                            Discover Your <br />
                            <span className="text-primary tracking-tighter lavender-glow">Perfect Theme</span>
                        </h1>
                        <p className="text-gray-400 text-xl leading-relaxed">
                            Tell me about the vibe you&apos;re envisioning, your favorite colors, or any inspiration you have. Let AI build the mood.
                        </p>
                    </div>

                    <GlassCard className="w-full p-2.5 rounded-3xl border border-white/10 shadow-2xl relative group focus-within:border-primary/50 transition-all">
                        <form onSubmit={handleGenerate} className="flex gap-3 h-20 items-center px-4">
                            <span className="material-symbols-outlined text-gray-500 group-focus-within:lavender-glow transition-colors">auto_awesome</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g. A whimsical lavender woodland with modern geometric accents..."
                                className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:outline-none text-lg"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={`h-14 px-8 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin">sync</span>
                                ) : (
                                    <>
                                        <span>Generate</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </GlassCard>

                    <div className="flex flex-wrap justify-center gap-3">
                        {['Whimsical', 'Boho Chic', 'Modern Minimalist', 'Rustic Charm'].map(hint => (
                            <button
                                key={hint}
                                onClick={() => setInput(hint)}
                                className="px-5 py-2 rounded-full border border-white/5 bg-white/5 text-gray-500 text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
                            >
                                {hint}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <p className="text-secondary-rose text-sm font-bold flex items-center gap-2 bg-secondary-rose/10 px-4 py-2 rounded-lg border border-secondary-rose/20">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setTheme(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Try another idea
                        </button>
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <span className="material-symbols-outlined text-sm lavender-glow">check_circle</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Generated Theme</span>
                        </div>
                    </div>
                    <MoodBoard theme={theme} />
                </div>
            )}
        </div>
    );
};

export default ThemeAssistant;
