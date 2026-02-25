"use client";

import Link from "next/link";
import ThemeToggle from "@/components/atoms/ThemeToggle";

export default function LandingPage() {
    return (
        <div className="font-display bg-bg-main text-text-main overflow-x-hidden min-h-screen flex flex-col relative selection:bg-primary selection:text-white transition-colors duration-300 uppercase-none">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full filter blur-[100px] orb animate-pulse bg-primary" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full filter blur-[100px] orb animate-pulse bg-blue-500" style={{ animationDuration: '10s' }}></div>
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full filter blur-[100px] orb animate-pulse bg-secondary-rose" style={{ animationDuration: '12s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-4 z-50 px-4 sm:px-10 lg:px-20 mt-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-linear-to-br from-primary to-purple-800 flex items-center justify-center shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined text-white text-[20px]">child_care</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Passy</h2>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity" href="#">Features</a>
                            <a className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity" href="#">Pricing</a>
                            <a className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity" href="#">About</a>
                        </div>
                        {/* Auth CTA */}
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link className="hidden sm:block text-sm font-medium opacity-70 hover:opacity-100 transition-opacity" href="/login">
                                Log In
                            </Link>
                            <Link href="/login" className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-5 rounded-full shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Wrapper */}
            <main className="relative z-10 flex-grow flex flex-col">
                {/* Hero Section */}
                <section className="relative pt-20 pb-16 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="max-w-4xl w-full text-center flex flex-col gap-8 items-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(165,61,245,0.6)]"></span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">AI Powered Planning</span>
                        </div>
                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Plan the Perfect <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary/80 to-primary glow-text">Baby Shower</span> with AI
                        </h1>
                        {/* Subheadline */}
                        <p className="text-lg md:text-xl opacity-70 max-w-2xl font-light leading-relaxed">
                            The simplest and smartest way to celebrate. From themes to games, let our AI handle the details so you can enjoy the moment.
                        </p>
                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                            <Link href="/login" className="group relative flex items-center justify-center gap-2 bg-primary text-white h-14 px-8 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all overflow-hidden active:scale-95">
                                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                                <span>Start Planning for Free</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                            <button className="flex items-center justify-center gap-2 glass-button h-14 px-10 rounded-full font-bold text-lg active:scale-95">
                                <span className="material-symbols-outlined scale-110">play_circle</span>
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        {/* Visual Placeholder */}
                        <div className="mt-16 w-full max-w-5xl glass-panel rounded-3xl p-3 overflow-hidden shadow-2xl border-primary/5">
                            <div className="relative w-full aspect-16/7 bg-black/5 rounded-2xl overflow-hidden group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-screen transition-transform duration-1000 group-hover:scale-105"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiynCDoSB0tTlrltqr7_nRepOgwYJ4dWZdBSUI9_PlvQVFJhM7sY7tu7iVj-I6UBTxLxI6y6719CTFeEx4s5ZBwKUbMCbJiSewxF3sLusT3ZehUV-PmGfq1w4wvdtvLRpZUPnemahHetvyJ11P16DsiLbC43HhRDEhPRYdlq6zaz2-caBnVEnG8YqZJugvnOe4Du-enopA_3IeahlBA1folXO9VkrsJyzqa6e3NEhIQyyZQu7F_7nfc9JNvGthrycexjm2e4rhYrw')" }}
                                ></div>
                                <div className="absolute inset-0 bg-linear-to-t from-bg-main via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-end h-full">
                                    <div className="glass-panel p-6 rounded-2xl max-w-lg w-full transform translate-y-4 opacity-95 shadow-xl">
                                        <div className="flex items-center gap-4 mb-4 border-b border-primary/5 pb-4">
                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                                                <span className="material-symbols-outlined">smart_toy</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-24 bg-primary/20 rounded-full"></div>
                                                <div className="h-2 w-16 bg-primary/10 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-primary/5 rounded-full"></div>
                                            <div className="h-2 w-3/4 bg-primary/5 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="relative py-20 px-6 sm:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Magical Features</h2>
                            <p className="opacity-60 max-w-2xl mx-auto text-lg leading-relaxed font-light">Experience the future of party planning with our intelligent tools designed to make every moment sparkle.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/5">
                                <div className="size-14 rounded-2xl bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    <span className="material-symbols-outlined text-3xl text-primary animate-pulse">auto_awesome</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">AI Theme Assistant</h3>
                                <p className="opacity-60 leading-relaxed font-light text-sm">
                                    Generate unique themes instantly tailored to your taste. From "Cosmic Jungle" to "Vintage Tea Party", get mood boards in seconds.
                                </p>
                            </div>
                            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 group hover:shadow-xl hover:shadow-secondary-rose/5">
                                <div className="size-14 rounded-2xl bg-linear-to-br from-pink-500/10 to-rose-500/10 border border-secondary-rose/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary-rose/10 transition-all">
                                    <span className="material-symbols-outlined text-3xl text-secondary-rose">videogame_asset</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">Personalized Games</h3>
                                <p className="opacity-60 leading-relaxed font-light text-sm">
                                    Curated fun for every guest list to keep the energy high. Our AI suggests games based on guest age range and party vibe.
                                </p>
                            </div>
                            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 group hover:shadow-xl hover:shadow-emerald-500/5">
                                <div className="size-14 rounded-2xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                                    <span className="material-symbols-outlined text-3xl text-emerald-500/70">savings</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">Smart Budgeting</h3>
                                <p className="opacity-60 leading-relaxed font-light text-sm">
                                    Track expenses without the stress and stay on target. Real-time cost estimation helps you allocate funds where they matter most.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-20 px-6 sm:px-12 text-center">
                    <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-primary/5 to-transparent pointer-events-none"></div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 relative z-10 tracking-tight">Ready to host the perfect shower?</h2>
                        <Link href="/login" className="relative z-10 bg-primary text-white hover:bg-primary/90 text-base font-bold h-14 px-10 rounded-full shadow-xl shadow-primary/20 transition-all inline-flex items-center transform hover:scale-105 active:scale-95">
                            Get Started for Free
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-primary/5 bg-panel-bg backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-[14px]">child_care</span>
                            </div>
                            <span className="text-lg font-bold">Passy</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            <a className="opacity-60 hover:opacity-100 hover:text-primary transition-all text-sm font-medium" href="#">Privacy Policy</a>
                            <a className="opacity-60 hover:opacity-100 hover:text-primary transition-all text-sm font-medium" href="#">Terms of Service</a>
                            <a className="opacity-60 hover:opacity-100 hover:text-primary transition-all text-sm font-medium" href="#">Contact Us</a>
                        </div>
                        <div className="flex gap-6">
                            <span className="material-symbols-outlined text-xl opacity-40 hover:opacity-100 cursor-pointer transition-all hover:text-primary">camera_alt</span>
                            <span className="material-symbols-outlined text-xl opacity-40 hover:opacity-100 cursor-pointer transition-all hover:text-primary">flutter_dash</span>
                            <span className="material-symbols-outlined text-xl opacity-40 hover:opacity-100 cursor-pointer transition-all hover:text-primary">public</span>
                        </div>
                    </div>
                    <div className="mt-8 text-center opacity-40 text-xs font-medium tracking-widest uppercase">
                        © 2024 Passy. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
