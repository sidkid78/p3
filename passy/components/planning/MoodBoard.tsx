'use client';

import React from 'react';
import GlassCard from '@/components/atoms/GlassCard';

interface MoodBoardProps {
    theme: {
        themeName: string;
        description: string;
        colorPalette: string[];
        imagePrompts: {
            venue: string;
            invitation: string;
            cake: string;
        };
        tags: string[];
    };
}

const MoodBoard: React.FC<MoodBoardProps> = ({ theme }) => {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-serif font-black text-white tracking-tight">{theme.themeName}</h2>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">{theme.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Color Palette */}
                <GlassCard className="lg:col-span-1 p-6 flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm lavender-glow">palette</span>
                        Color Palette
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {theme.colorPalette.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group transform hover:-translate-y-1 transition-transform">
                                <div
                                    className="size-16 rounded-2xl shadow-lg border border-white/10"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-[10px] font-mono text-gray-500 group-hover:text-primary transition-colors">{color}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {theme.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                                {tag}
                            </span>
                        ))}
                    </div>
                </GlassCard>

                {/* Visual Inspiration Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="material-symbols-outlined text-4xl text-gray-700 group-hover:lavender-glow transition-colors">home</span>
                            <p className="absolute bottom-4 left-4 right-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Venue</p>
                        </div>
                        <p className="text-[10px] text-gray-500 italic px-2 line-clamp-2">{theme.imagePrompts.venue}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-secondary-rose/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="material-symbols-outlined text-4xl text-gray-700 group-hover:text-secondary-rose transition-colors">cake</span>
                            <p className="absolute bottom-4 left-4 right-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Cake</p>
                        </div>
                        <p className="text-[10px] text-gray-500 italic px-2 line-clamp-2">{theme.imagePrompts.cake}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="material-symbols-outlined text-4xl text-gray-700 group-hover:text-purple-400 transition-colors">mail</span>
                            <p className="absolute bottom-4 left-4 right-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Invitation</p>
                        </div>
                        <p className="text-[10px] text-gray-500 italic px-2 line-clamp-2">{theme.imagePrompts.invitation}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-white/5 pt-8">
                <button className="h-12 px-6 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors">
                    Export Palette
                </button>
                <button className="h-12 px-8 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                    Apply to Event
                </button>
            </div>
        </div>
    );
};

export default MoodBoard;
