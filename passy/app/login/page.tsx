"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import GlassCard from "@/components/atoms/GlassCard"
import ThemeToggle from "@/components/atoms/ThemeToggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  const handleDemoAccess = () => {
    setLoading(true);
    // Directly navigate to dashboard as we have mocked the session there
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black bg-grid-white/[0.02] relative overflow-hidden font-sans">
      {/* Dynamic Background Orbs */}
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
            <h1 className="font-serif text-white text-4xl font-black tracking-tight mb-2">Welcome to <span className="lavender-glow">Passy</span></h1>
            <p className="text-gray-400 font-medium">Your AI-powered baby shower concierge</p>
          </div>
        </div>

        <GlassCard className="p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg group-focus-within:text-primary transition-colors">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                  placeholder="name@example.com"
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
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
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
              className="w-full h-14 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-xl shadow-white/5"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : "Sign In"}
            </button>
          </form>

          <div className="relative my-8 h-px bg-white/5">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0c0a0f] px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              or explore first
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full h-14 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 font-serif italic"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>Jump in with Demo Access</span>
          </button>

          <p className="text-center mt-8 text-xs text-gray-600 font-medium">
            Don&apos;t have an account? <span className="text-white hover:text-primary cursor-pointer transition-colors font-bold">Request an invite</span>
          </p>
        </GlassCard>

        <p className="text-center mt-8 text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
          &copy; 2024 Passy Project &bull; Handcrafted for Mommies
        </p>
      </div>
    </div>
  )
}
