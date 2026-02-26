'use client';

import React, { useState } from 'react';

type RsvpChoice = 'accept' | 'decline' | null;

const DigitalInvitation = () => {
    const [rsvpChoice, setRsvpChoice] = useState<RsvpChoice>(null);
    const [guestCount, setGuestCount] = useState('');
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Invitation Card */}
            <div className="rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_64px_0_rgba(0,0,0,0.5)]">

                {/* Hero Image */}
                <div className="relative h-56 bg-linear-to-br from-primary/40 via-secondary-rose/30 to-purple-900/60 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-32 rounded-full bg-white/10 blur-3xl absolute top-0 left-1/3" />
                        <div className="size-24 rounded-full bg-primary/20 blur-2xl absolute bottom-0 right-1/4" />
                        {/* Decorative orbs mimicking the spec */}
                        <div className="size-20 rounded-full bg-pink-400/30 blur-xl absolute top-4 left-1/4" />
                        <div className="size-16 rounded-full bg-purple-400/30 blur-xl absolute bottom-6 right-1/3" />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <span className="bg-primary/90 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                            Baby Shower
                        </span>
                    </div>
                </div>

                {/* Invitation Body */}
                <div className="p-8 flex flex-col items-center text-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white leading-tight mb-3">
                            Welcome Baby Thompson
                        </h1>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                            You are cordially invited to celebrate the upcoming arrival of our little one.
                            Join us for an afternoon of joy, laughter, and new beginnings.
                        </p>
                    </div>

                    {/* Event Info Row */}
                    <div className="flex items-center justify-center gap-8 w-full py-5 border-t border-b border-white/5">
                        <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-primary/60 text-lg">calendar_today</span>
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Date</span>
                            <span className="text-sm font-bold text-white">Oct 24, 2024</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-primary/60 text-lg">schedule</span>
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Time</span>
                            <span className="text-sm font-bold text-white">2:00 PM – 5:00 PM</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-primary/60 text-lg">person</span>
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Host</span>
                            <span className="text-sm font-bold text-white">Sarah Johnson</span>
                        </div>
                    </div>

                    {/* RSVP Section */}
                    {!submitted ? (
                        <form onSubmit={handleConfirm} className="w-full flex flex-col gap-4">
                            <p className="text-white font-bold text-base">Will you be attending?</p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRsvpChoice('accept')}
                                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all ${rsvpChoice === 'accept'
                                        ? 'bg-primary text-black shadow-lg shadow-primary/30'
                                        : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-base">favorite</span>
                                    Joyfully Accept
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRsvpChoice('decline')}
                                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all ${rsvpChoice === 'decline'
                                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                                        : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-base">cancel</span>
                                    Decline
                                </button>
                            </div>

                            {rsvpChoice === 'accept' && (
                                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-lg">group</span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Total number of guests"
                                            value={guestCount}
                                            onChange={e => setGuestCount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-3.5 text-white/20 text-lg">edit</span>
                                        <input
                                            type="text"
                                            placeholder="Send a note to the parents (optional)"
                                            value={note}
                                            onChange={e => setNote(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!rsvpChoice}
                                className="w-full h-12 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Confirm RSVP
                            </button>
                        </form>
                    ) : (
                        <div className="w-full py-8 flex flex-col items-center gap-3 animate-in fade-in duration-500">
                            <div className="size-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">
                                    {rsvpChoice === 'accept' ? 'celebration' : 'sentiment_neutral'}
                                </span>
                            </div>
                            <p className="text-white font-bold text-lg">
                                {rsvpChoice === 'accept' ? 'See you there!' : 'We&apos;ll miss you!'}
                            </p>
                            <p className="text-white/40 text-sm">
                                {rsvpChoice === 'accept'
                                    ? 'Your RSVP has been confirmed. We can\'t wait to celebrate with you.'
                                    : 'Thank you for letting us know. We\'ll be thinking of you!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Cards: Gift Registry + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gift Registry */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">redeem</span>
                        </div>
                        <h3 className="font-bold text-white text-base">Gift Registry</h3>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">
                        Your presence is the greatest gift of all. However, if you wish to honor us with a gift, we have registered at the following stores.
                    </p>
                    <div className="flex gap-3 mt-auto">
                        <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-bold hover:bg-white/10 hover:border-primary/30 transition-all">
                            <span className="material-symbols-outlined text-sm">storefront</span>
                            Amazon
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-bold hover:bg-white/10 hover:border-primary/30 transition-all">
                            <span className="material-symbols-outlined text-sm">local_mall</span>
                            Target
                        </button>
                    </div>
                </div>

                {/* Location */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                        </div>
                        <h3 className="font-bold text-white text-base">Location</h3>
                    </div>
                    {/* Map placeholder */}
                    <div className="w-full h-28 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-linear-to-br from-slate-800/60 to-slate-900/80" />
                        <div className="absolute inset-0 map-grid-pattern opacity-20" />
                        <span className="material-symbols-outlined text-primary text-2xl relative z-10 drop-shadow-lg">location_on</span>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">The Thompson Residence</p>
                        <p className="text-white/40 text-xs mt-0.5">123 Maple Avenue, Springfield, IL 62704</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all mt-auto">
                        <span className="material-symbols-outlined text-sm">directions</span>
                        Get Directions
                    </button>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-white/20 text-xs pb-4">
                © 2024 Passy Invitations. All rights reserved.
            </p>
        </div>
    );
};

export default DigitalInvitation;
