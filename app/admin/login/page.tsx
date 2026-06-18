'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false) }
    else { router.push('/admin'); router.refresh() }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] border-r border-white/5 p-10">
        <img src="/logo-white.png" alt="RedAntz Studios" className="h-8 w-auto opacity-80" />
        <div>
          <p className="text-white/20 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Admin Panel</p>
          <p className="text-white/60 text-2xl font-light leading-snug">
            Manage your studio,<br />portfolios & clients.
          </p>
        </div>
        <p className="text-white/15 text-xs">© {new Date().getFullYear()} RedAntz Studios</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <img src="/logo-white.png" alt="RedAntz Studios" className="h-7 w-auto brightness-0 invert opacity-50 mb-6" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-white/30 font-light mb-8">Access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                Email address
              </label>
              <input type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="admin@redantzstudios.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                style={{ fontSize: '16px' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                Password
              </label>
              <input type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-all"
                style={{ fontSize: '16px' }} />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-900/40 rounded-lg px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#C81010] text-white text-sm font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 mt-2 flex items-center justify-center gap-2">
              {loading
                ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Signing in…</>
                : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
