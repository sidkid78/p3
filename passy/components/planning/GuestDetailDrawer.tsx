'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Guest {
    id: string;
    name: string;
    email: string;
    rsvp: 'confirmed' | 'pending' | 'declined';
    diet: string;
    phone?: string;
    plusOne?: boolean;
    plusOneName?: string;
    notes?: string;
}

interface GuestDetailDrawerProps {
    guest: Guest | null;
    isOpen: boolean;
    onClose: () => void;
}

const GuestDetailDrawer: React.FC<GuestDetailDrawerProps> = ({ guest, isOpen, onClose }) => {
    if (!guest) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f0814]/90 backdrop-blur-3xl border-l border-white/10 z-70 shadow-2xl p-8 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div className="size-12 rounded-xl glass flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <button onClick={onClose} className="size-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Header Info */}
                            <div className="space-y-2">
                                <h2 className="text-3xl font-display font-black text-white">{guest.name}</h2>
                                <p className="text-white/40 text-sm font-medium">{guest.email}</p>
                            </div>

                            {/* Status Section */}
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 glass rounded-2xl border border-white/5">
                                    <p className="text-[10px] uppercase text-white/30 font-black tracking-widest mb-2">RSVP Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${guest.rsvp === 'confirmed' ? 'bg-emerald-400' :
                                            guest.rsvp === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
                                            }`} />
                                        <span className="text-sm font-bold text-white capitalize">{guest.rsvp}</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 glass rounded-2xl border border-white/5">
                                    <p className="text-[10px] uppercase text-white/30 font-black tracking-widest mb-2">Dietary</p>
                                    <span className="text-sm font-bold text-white">{guest.diet}</span>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                                        <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">call</span>
                                        <span className="text-sm text-white/80">{guest.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                                        <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">mail</span>
                                        <span className="text-sm text-white/80">{guest.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Plus One Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80">Plus One</h3>
                                <div className="p-4 glass rounded-2xl border border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-white">Plus One Invited</span>
                                        <span className="text-xs text-white/40">{guest.plusOneName || 'No guest listed'}</span>
                                    </div>
                                    <div className={`size-8 rounded-lg flex items-center justify-center ${guest.plusOne ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/20'}`}>
                                        <span className="material-symbols-outlined text-lg">{guest.plusOne ? 'group' : 'person_off'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80">Guest Notes</h3>
                                <div className="p-4 glass rounded-2xl border border-white/5 min-h-[100px]">
                                    <p className="text-sm text-white/60 leading-relaxed italic">
                                        &quot;{guest.notes || 'No special requests or notes from this guest.'}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                            <button className="flex-1 px-6 h-12 glass rounded-xl text-sm font-bold hover:bg-white/5 border border-white/10 transition-all">
                                Edit Details
                            </button>
                            <button className="px-6 h-12 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-bold transition-all border border-primary/20">
                                Send Message
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GuestDetailDrawer;
