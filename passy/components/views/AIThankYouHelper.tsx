"use client"

import { useState } from "react"
import GlassCard from "@/components/atoms/GlassCard"

const GUESTS = [
    "Aunt Martha",
    "The Miller Family",
    "Sarah Jenkins",
    "Grandma Rose",
    "Uncle Bob",
    "Cousin Clara"
]

const TONES = ["Informal", "Formal", "Humorous"]

export default function AIThankYouHelper() {
    const [selectedGuest, setSelectedGuest] = useState(GUESTS[0])
    const [gift, setGift] = useState("Hand-knit bunny sweater and booties")
    const [tone, setTone] = useState("Informal")
    const [details, setDetails] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [note, setNote] = useState(`Thank you so much for the absolutely adorable hand-knit bunny sweater and booties! They are beyond precious and feel so incredibly soft. I can already imagine dressing the little one in them for our first stroll in the park this spring. Your thoughtfulness always warms my heart, and I'm so grateful to have you in our lives. Can't wait for you to meet the baby soon!`)

    const handleGenerate = () => {
        setIsGenerating(true)
        // Mock generation delay
        setTimeout(() => {
            setIsGenerating(false)
            // In a real app, this would call Gemini
            setNote(`Thank you so much for the absolutely adorable ${gift}! ${tone === 'Humorous' ? "The baby is going to look so funny and cute in it!" : "It's exactly what we needed."} ${details ? " Also, " + details : ""} Your thoughtfulness always warms my heart, and I'm so grateful to have you in our lives. Can't wait for you to meet the baby soon!`)
        }, 1500)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`Dear ${selectedGuest},\n\n${note}\n\nLove, Sarah & Baby`)
    }

    return (
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-10 py-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black leading-tight tracking-tight bg-gradient-to-r from-white to-primary/60 bg-clip-text text-transparent">AI Thank You Note Helper</h1>
                    <p className="text-white/50 text-lg font-normal">Draft heartfelt messages for your baby shower gifts in seconds.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-xl h-11 px-6 bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all text-white/80">
                        View Sent History
                    </button>
                    <button className="flex items-center justify-center rounded-xl h-11 px-6 bg-primary text-black text-sm font-bold shadow-[0_0_20px_rgba(209,186,227,0.3)] hover:scale-[1.02] transition-all">
                        Bulk Export (PDF)
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 grow items-stretch">
                {/* Left Panel: Personalization */}
                <div className="w-full lg:w-5/12">
                    <GlassCard className="p-8 rounded-3xl border-white/[0.08] flex flex-col gap-6 h-full">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            Personalize Your Message
                        </h2>

                        <div className="space-y-6">
                            {/* Guest Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Which guest sent this gift?</label>
                                <div className="relative">
                                    <select
                                        value={selectedGuest}
                                        onChange={(e) => setSelectedGuest(e.target.value)}
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    >
                                        {GUESTS.map(g => (
                                            <option key={g} value={g} className="bg-neutral-900">{g}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gift Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">What was the gift?</label>
                                <input
                                    type="text"
                                    value={gift}
                                    onChange={(e) => setGift(e.target.value)}
                                    placeholder="e.g. Handmade baby blanket"
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                />
                            </div>

                            {/* Tone Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Message Tone</label>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                                    {TONES.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={`py-2.5 rounded-xl text-sm font-bold transition-all ${tone === t ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Extra Details */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Additional Details (Optional)</label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Mention specific memories or plans..."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full bg-primary hover:brightness-110 text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(209,186,227,0.2)] mt-4 disabled:opacity-50"
                            >
                                <span className={`material-symbols-outlined ${isGenerating ? 'animate-spin' : 'fill-1'}`}>
                                    {isGenerating ? 'refresh' : 'auto_awesome'}
                                </span>
                                {isGenerating ? 'VETTING WITH AI...' : 'GENERATE MAGIC NOTE'}
                            </button>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Panel: Preview */}
                <div className="w-full lg:w-7/12 flex flex-col gap-4 relative">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white/90">
                            <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                            Draft Preview
                        </h2>
                        <div className="flex gap-1">
                            <button className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/30 hover:text-white">
                                <span className="material-symbols-outlined">zoom_in</span>
                            </button>
                            <button className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/30 hover:text-white">
                                <span className="material-symbols-outlined">palette</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center p-4 rounded-[40px] overflow-hidden group">
                        {/* Soft Glow Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,186,227,0.1)_0%,transparent_70%)]" />

                        {/* The Stationery Card */}
                        <div className="relative w-full max-w-[640px] aspect-[4/5] bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 md:p-16 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col transition-transform duration-700 group-hover:scale-[1.01]">
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -left-10 w-64 h-64 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-contain mix-blend-overlay" />
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-contain rotate-180 mix-blend-overlay" />

                            <div className="relative z-10 flex flex-col h-full justify-between font-handwritten italic">
                                <div>
                                    <div className="text-3xl md:text-4xl text-primary/80 mb-8 border-b border-white/5 pb-4 inline-block">
                                        Dear {selectedGuest},
                                    </div>
                                    <div className="text-2xl md:text-[28px] leading-relaxed text-white/90 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                                        {note}
                                    </div>
                                </div>
                                <div className="text-3xl md:text-4xl text-primary/80 mt-12 self-end">
                                    Love, Sarah & Baby
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-3 px-10 py-4 bg-primary text-black rounded-full font-bold shadow-[0_10px_25px_rgba(209,186,227,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-[20px]">content_copy</span>
                            Copy Message
                        </button>
                        <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-white active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">edit_note</span>
                            Edit
                        </button>
                        <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-white active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">send</span>
                            Share SMS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
