'use client';

import React from 'react';
import { useAITheme } from '@/context/AIThemeContext';

const vendors = [
    {
        id: 1,
        name: 'Wildflower & Ferns',
        category: 'Floral Design & Tablescapes',
        rating: 4.9,
        price: 450,
        availability: 'Open Aug-Sep',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
        match: true
    },
    {
        id: 2,
        name: 'The Rustic Whisk',
        category: 'Artisanal Bakery & Desserts',
        rating: 4.8,
        price: 220,
        availability: 'Limited',
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800',
        match: true
    },
    {
        id: 3,
        name: 'Oak Hollow Estate',
        category: 'Garden Venue & Catering',
        rating: 5.0,
        price: 1800,
        availability: 'Available',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
        match: true
    },
    {
        id: 4,
        name: 'Enchanted Events',
        category: 'Event Decoration & Styling',
        rating: 4.7,
        price: 600,
        availability: 'Weekends',
        image: 'https://images.unsplash.com/photo-1478812952316-dd2618a17402?auto=format&fit=crop&q=80&w=800',
        match: true
    },
    {
        id: 5,
        name: 'Lumina Portraits',
        category: 'Baby & Event Photography',
        rating: 4.9,
        price: 350,
        availability: 'High Demand',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=800',
        match: true
    }
];

const VendorMarketplace = () => {
    const { confirmedTheme } = useAITheme();

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary/60 text-xs font-bold tracking-widest uppercase">Planner</span>
                        <span className="text-white/20 text-xs">/</span>
                        <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Vendor Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-2">
                        Vendor Hub
                    </h1>
                    <p className="text-white/50 text-base max-w-xl">
                        Hand-picked for your {confirmedTheme ? (
                            <span className="text-primary font-bold">&quot;{confirmedTheme.themeName}&quot;</span>
                        ) : (
                            "baby shower"
                        )} theme.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover:bg-white/5 transition-all text-sm font-bold border border-white/10 group">
                    <span className="material-symbols-outlined text-lg group-hover:fill-1 transition-all">bookmark</span>
                    Saved Vendors
                </button>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button className="flex h-10 items-center justify-center gap-x-2 rounded-full bg-primary px-6 text-sm font-bold shadow-lg shadow-primary/20 whitespace-nowrap">
                    All Matches
                </button>
                {['Top Rated', 'Budget Friendly', 'Available Soon', 'New Arrivals'].map((label) => (
                    <button key={label} className="flex h-10 items-center justify-center gap-x-2 rounded-full glass px-6 text-sm font-medium hover:bg-white/5 transition-all whitespace-nowrap border border-white/10">
                        {label}
                    </button>
                ))}
            </div>

            {/* Vendor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="group flex flex-col glass rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${vendor.image})` }}
                            />

                            {/* Theme Match Badge */}
                            {vendor.match && (
                                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                    Matches Theme
                                </div>
                            )}

                            {/* Favorite Button */}
                            <button className="absolute top-4 right-4 size-10 glass rounded-full flex items-center justify-center text-white hover:bg-primary transition-all border border-white/10">
                                <span className="material-symbols-outlined text-xl">favorite</span>
                            </button>

                            {/* Hover Overlay Content */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                <p className="text-white text-xs font-medium translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    Trusted partner since 2023
                                </p>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-6 flex flex-col flex-1 gap-6">
                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                        {vendor.name}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg text-sm font-bold border border-white/10">
                                        <span className="material-symbols-outlined text-sm text-yellow-400 fill-1">star</span>
                                        <span>{vendor.rating}</span>
                                    </div>
                                </div>
                                <p className="text-white/40 text-sm font-medium">{vendor.category}</p>
                            </div>

                            <div className="flex gap-8 py-4 border-y border-white/5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase text-white/30 font-black tracking-widest">Starting At</span>
                                    <span className="text-lg font-display font-bold text-white">${vendor.price}</span>
                                </div>
                                <div className="flex flex-col gap-1 border-l border-white/5 pl-8">
                                    <span className="text-[10px] uppercase text-white/30 font-black tracking-widest">Availability</span>
                                    <span className={`text-sm font-bold ${vendor.availability === 'Available' ? 'text-green-400' : 'text-primary'}`}>
                                        {vendor.availability}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <button className="flex-1 bg-primary hover:bg-primary/80 text-white h-12 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                                    Book Now
                                </button>
                                <button className="size-12 glass flex items-center justify-center rounded-2xl hover:bg-white/5 transition-all border border-white/10 group">
                                    <span className="material-symbols-outlined text-white/60 group-hover:text-white group-hover:scale-110 transition-all">info</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Load More Skeleton */}
                <div className="glass rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-white/5 min-h-[400px] group cursor-pointer hover:border-primary/30 transition-all">
                    <div className="flex flex-col items-center gap-4 text-white/20 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-6xl group-hover:scale-110 transition-all">add_circle</span>
                        <p className="text-sm font-black uppercase tracking-widest">Explore More Vendors</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorMarketplace;
