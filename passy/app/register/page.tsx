"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import GlassCard from "@/components/atoms/GlassCard"
import ThemeToggle from "@/components/atoms/ThemeToggle"
import Link from "next/link"

export default function RegisterPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    zip_code: zipCode,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black bg-grid-white/[0.02] relative overflow-hidden font-sans">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="w-full max-w-[480px] p-6 relative z-10 animate-in fade-in zoom-in duration-700">
                    <GlassCard className="p-10 border border-white/10 shadow-2xl text-center">
                        <div className="bg-emerald-500/20 rounded-2xl p-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/20 inline-block mb-6">
                            <span className="material-symbols-outlined text-emerald-400 text-4xl">mark_email_read</span>
                        </div>
                        <h2 className="text-white text-3xl font-serif font-black mb-4">Check your email</h2>
                        <p className="text-gray-400 mb-8">We&apos;ve sent a confirmation link to <span className="text-white font-bold">{email}</span>. Please click it to activate your account.</p>
                        <Link href="/login" className="text-primary hover:text-primary-light font-bold transition-colors">
                            Back to Login
                        </Link>
                    </GlassCard>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black bg-grid-white/[0.02] relative overflow-hidden font-sans">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-rose/10 blur-[100px] rounded-full" />

            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-[480px] p-6 relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center gap-4 mb-10">
                    <div className="bg-primary/20 rounded-2xl p-4 border border-primary/30 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined lavender-glow text-4xl">child_care</span>
                    </div>
                    <div className="text-center">
                        <h1 className="font-serif text-white text-4xl font-black tracking-tight mb-2">Join <span className="lavender-glow">Passy</span></h1>
                        <p className="text-gray-400 font-medium">Start planning your perfect baby shower</p>
                    </div>
                </div>

                <GlassCard className="p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <form onSubmit={handleRegister} className="space-y-4 relative z-10">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg group-focus-within:text-primary transition-colors">person</span>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-12 bg-white/3 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    placeholder="Sarah Jenkins"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg group-focus-within:text-primary transition-colors">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-white/3 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    placeholder="sarah@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Zip Code</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg group-focus-within:text-primary transition-colors">location_on</span>
                                    <input
                                        type="text"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                        className="w-full h-12 bg-white/3 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                        placeholder="94103"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg group-focus-within:text-primary transition-colors">lock</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 bg-white/3 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary-rose/10 border border-secondary-rose/20 text-secondary-rose text-xs font-bold animate-in slide-in-from-top-2">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-xl shadow-white/5 mt-4"
                        >
                            {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : "Create Account"}
                        </button>
                    </form>

                    <div className="relative z-10">
                        <p className="text-center mt-8 text-xs text-gray-600 font-medium font-sans">
                            Already have an account? <Link href="/login" className="text-white hover:text-primary cursor-pointer transition-colors font-bold">Sign in</Link>
                        </p>
                    </div>
                </GlassCard>

                <p className="text-center mt-8 text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
                    &copy; 2024 Passy Project &bull; Handcrafted for Mommies
                </p>
            </div>
        </div>
    )
}
