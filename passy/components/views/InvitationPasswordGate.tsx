'use client';

import React, { useState } from 'react';

type AccessState = 'locked' | 'error' | 'unlocked';

const InvitationPasswordGate = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [accessState, setAccessState] = useState<AccessState>('locked');
    const [isShaking, setIsShaking] = useState(false);

    // Demo: correct password is "babyshower"
    const CORRECT_PASSWORD = 'babyshower';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            setAccessState('unlocked');
        } else {
            setAccessState('error');
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setAccessState('locked');
            }, 700);
        }
    };

    if (accessState === 'unlocked') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
                <div className="relative flex flex-col items-center gap-6 max-w-sm text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
                        <div className="relative size-20 rounded-full bg-black/60 border border-primary/40 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-4xl">lock_open</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white">Welcome!</h1>
                    <p className="text-white/50 text-base">You now have access to the invitation details.</p>
                    <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                        <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Event Details</p>
                        <p className="text-white font-bold text-lg">Baby Shower – Baby Thompson</p>
                        <p className="text-white/60 text-sm">Saturday, June 15th at 2:00 PM</p>
                        <p className="text-white/60 text-sm flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-primary/60">location_on</span>
                            123 Willow Creek, San Francisco
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">

            {/* Glass card */}
            <div className={`w-full max-w-[480px] bg-[rgba(40,25,51,0.55)] backdrop-blur-2xl border rounded-2xl p-8 flex flex-col items-center shadow-[0_8px_48px_0_rgba(0,0,0,0.7)] transition-all duration-200 ${isShaking ? 'animate-shake border-rose-500/50' : 'border-white/10'
                }`}>

                {/* Shield Icon */}
                <div className="mb-6 flex items-center justify-center relative">
                    <div className="absolute size-24 bg-primary/25 blur-2xl rounded-full" />
                    <div className="relative size-20 bg-black/70 rounded-full flex items-center justify-center border border-primary/40">
                        <span className="material-symbols-outlined text-primary text-4xl">security</span>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-white font-display font-bold text-3xl leading-tight text-center mb-3">
                    This Invitation is Protected
                </h1>
                <p className="text-white/50 text-sm leading-relaxed text-center mb-8 px-4">
                    Please enter the password provided by the host to view the details.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="flex flex-col gap-1.5 w-full">
                        <label htmlFor="inv-password" className="text-white/70 text-sm font-medium ml-1">
                            Password
                        </label>
                        <div className={`flex items-center w-full rounded-xl border bg-white/3 transition-all duration-300 ${accessState === 'error'
                            ? 'border-rose-500/60 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                            : 'border-white/10 focus-within:border-primary/60 focus-within:shadow-[0_0_10px_rgba(165,61,245,0.15)]'
                            }`}>
                            <input
                                id="inv-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="flex-1 bg-transparent border-none text-white text-base placeholder:text-white/20 p-4 h-14 focus:outline-none focus:ring-0"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="pr-4 text-white/30 hover:text-white/70 transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                        {accessState === 'error' && (
                            <p className="text-rose-400 text-xs ml-1 animate-in fade-in duration-200">
                                Incorrect password. Please try again.
                            </p>
                        )}
                    </div>

                    {/* Hint */}
                    <p className="text-white/20 text-xs text-center">
                        Hint: try <span className="text-primary/50 font-mono">babyshower</span>
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!password}
                        className="w-full h-14 rounded-xl bg-linear-to-r from-primary to-purple-400 text-white text-base font-bold tracking-wide shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Access Invitation
                    </button>
                </form>

                {/* Contact Host */}
                <div className="mt-8">
                    <a
                        href="#"
                        className="text-white/30 hover:text-primary text-sm font-medium transition-colors border-b border-transparent hover:border-primary/40 pb-0.5"
                    >
                        Contact Host
                    </a>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-10 text-white/15 text-xs font-medium tracking-widest uppercase text-center">
                © 2024 Passy. All Rights Reserved.
            </p>
        </div>
    );
};

export default InvitationPasswordGate;
