'use client';

import React, { useState, useEffect } from 'react';
import { generateGames, GameRecommendation } from '@/app/actions/ai/generate-games';
import { useAITheme } from '@/context/AIThemeContext';
import GameCard from '@/components/planning/GameCard';

const GamePlannerView = () => {
    const { confirmedTheme } = useAITheme();
    const [themeName, setThemeName] = useState(confirmedTheme?.themeName || 'Boho Forest Adventure');
    const [energyLevel, setEnergyLevel] = useState(3);
    const [guestCount, setGuestCount] = useState('Medium (15-30)');
    const [games, setGames] = useState<GameRecommendation[]>([]);
    const [aiTip, setAiTip] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const energyLabels = ["Very Chill", "Chill", "Mid-Energy", "Active", "High Energy"];

    const handleUpdateSuggestions = async () => {
        setIsLoading(true);
        try {
            const result = await generateGames(themeName, energyLevel, guestCount);
            setGames(result.games);
            setAiTip(result.aiTip);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleUpdateSuggestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="flex flex-col gap-10 animate-in fade-in duration-700">
            {/* Standardized Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">Planner</span>
                        <span className="text-white/20 text-xs">/</span>
                        <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Game Selection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-2">
                        Game Selection
                    </h1>
                    <p className="text-white/50 text-base max-w-xl">
                        Tailor the perfect atmosphere with AI-curated games designed for your specific baby shower theme and guest list.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <aside className="w-full lg:w-[380px] lg:sticky lg:top-10">
                    <div className="glass-card border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            <h3 className="text-xl font-semibold text-white">Planning Filters</h3>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Theme Alignment</label>
                                <select
                                    title="Theme Alignment"
                                    value={themeName}
                                    onChange={(e) => setThemeName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 text-white cursor-pointer appearance-none transition-all"
                                >
                                    <option className="bg-[#0F0C11]">Boho Forest Adventure</option>
                                    <option className="bg-[#0F0C11]">Celestial Dream</option>
                                    <option className="bg-[#0F0C11]">Under the Sea</option>
                                    <option className="bg-[#0F0C11]">Little Honey Bee</option>
                                    <option className="bg-[#0F0C11]">Safari Voyage</option>
                                    {confirmedTheme && themeName !== confirmedTheme.themeName && (
                                        <option className="bg-[#0F0C11]">{confirmedTheme.themeName}</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Energy Level</label>
                                    <span className="text-[10px] font-bold text-primary px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-full">
                                        {energyLabels[energyLevel - 1]}
                                    </span>
                                </div>
                                <input
                                    title="Energy Level"
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={energyLevel}
                                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-3 px-1 text-[10px] uppercase tracking-wider text-white/40 font-bold">
                                    <span>Chill</span>
                                    <span>Active</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Guest Count</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {['Small (1-15)', 'Medium (15-30)', 'Large (30+)'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setGuestCount(size)}
                                            className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${guestCount === size
                                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(165,61,245,0.3)]'
                                                : 'border-white/10 bg-white/5 text-white/70 hover:border-primary/50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleUpdateSuggestions}
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-primary to-secondary-rose text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(165,61,245,0.4)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                            >
                                <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : ''}`}>
                                    {isLoading ? 'sync' : 'auto_awesome'}
                                </span>
                                {isLoading ? 'Generating...' : 'Update Suggestions'}
                            </button>
                        </div>
                    </div>

                    {aiTip && (
                        <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-start gap-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">AI Tip</p>
                                <p className="text-sm text-white/60 leading-relaxed font-light">
                                    {aiTip}
                                </p>
                            </div>
                        </div>
                    )}
                </aside>

                <div className="flex-1 w-full">
                    {isLoading && games.length === 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12 opacity-50">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-96 glass-card rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
                            {games.map((game, idx) => (
                                <GameCard key={idx} game={game} />
                            ))}
                        </div>
                    )}

                    {!isLoading && games.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button className="flex items-center gap-3 px-10 py-4 glass-panel text-white font-bold rounded-full hover:bg-white/10 transition-all border-white/20">
                                Load More Games
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamePlannerView;
