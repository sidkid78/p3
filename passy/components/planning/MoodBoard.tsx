'use client';

import React from 'react';
import GlassCard from '@/components/atoms/GlassCard';

interface MoodBoardProps {
    theme: {
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
    };
}

const MoodBoard: React.FC<MoodBoardProps> = ({ theme }) => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {theme.images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`group relative rounded-3xl overflow-hidden glass-panel border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${img.aspect === '16/10' ? 'md:col-span-2' : 'col-span-1'
                            }`}
                    >
                        <div
                            className={`w-full bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110 bg-white/5 flex items-center justify-center ${img.aspect === '16/10' ? 'aspect-[16/10]' : 'aspect-square'
                                }`}
                            style={img.url ? { backgroundImage: `url(${img.url})` } : {}}
                        >
                            {!img.url && (
                                <div className="flex flex-col items-center gap-2 opacity-20">
                                    <span className="material-symbols-outlined text-4xl">image_search</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{img.title}</span>
                                </div>
                            )}
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                            <p className="text-white text-xl font-display font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                {img.title}
                            </p>
                            <p className="text-primary/90 text-xs mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 font-medium line-clamp-2">
                                {img.prompt}
                            </p>
                        </div>

                        {/* Favorite Button */}
                        <button className="absolute top-4 right-4 size-10 bg-black/30 backdrop-blur-xl rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 border border-white/10 flex items-center justify-center hover:scale-110">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Color Palette & Tags Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Color Palette */}
                <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm lavender-glow">palette</span>
                            Harmonious Palette
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {theme.colorPalette.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1">
                                <div
                                    className="size-14 lg:size-16 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden"
                                    style={{ backgroundColor: color }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[10px] font-mono text-gray-500 group-hover:text-primary transition-colors">{color}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Concept Tags */}
                <GlassCard className="p-6 flex flex-col gap-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-accent-rose">style</span>
                        Design Tokens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {theme.tags.map(tag => (
                            <span
                                key={tag}
                                className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl uppercase tracking-wider hover:bg-primary/20 transition-all cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default MoodBoard;
