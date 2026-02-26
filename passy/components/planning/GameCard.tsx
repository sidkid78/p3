'use client';

import React from 'react';
import type { GameRecommendation } from '@/app/actions/ai/generate-games';

interface GameCardProps {
    game: GameRecommendation;
}

const tagStyles = {
    popular: 'text-lavender-glow bg-lavender-glow/10 border-lavender-glow/20',
    theme: 'text-rose-glow bg-rose-glow/10 border-rose-glow/20',
    creative: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    sweet: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const GameCard: React.FC<GameCardProps> = ({ game }) => {
    return (
        <div className="glass-card glowing-border rounded-2xl overflow-hidden group transition-all duration-300 hover:border-primary/40">
            <div className="h-56 w-full relative overflow-hidden">
                {game.url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url("${game.url}")` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl opacity-20">sports_esports</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-t from-deep-charcoal via-deep-charcoal/20 to-transparent" />
            </div>


            <div className="p-8 -mt-10 relative">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${tagStyles[game.tagType]}`}>
                            {game.vibe}
                        </span>
                        <h4 className="text-2xl font-display font-bold mt-3 text-white">{game.title}</h4>
                    </div>
                    <button className="bg-white/5 backdrop-blur-xl border border-white/10 p-2.5 rounded-full hover:bg-rose-glow/20 hover:text-rose-glow transition-all">
                        <span className="material-symbols-outlined text-lg">favorite</span>
                    </button>
                </div>

                <p className="text-sm text-white/70 leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">
                    {game.description}
                </p>

                <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-8">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">inventory_2</span> Materials Needed
                    </h5>
                    <p className="text-xs text-white/60 leading-relaxed">
                        {game.materials.join(', ')}.
                    </p>
                </div>

                <button className="w-full py-4 bg-linear-to-r from-primary to-secondary-rose text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(165,61,245,0.3)]">
                    View Rules
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default GameCard;
