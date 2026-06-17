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
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo-white.png" alt="RedAntz Studios" className="h-7 w-auto mx-auto mb-6 opacity-70" />
          <p className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-[#C81010] mb-1">Admin</p>
          <h1 className="font-display text-2xl text-white tracking-wide">Sign In</h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="admin@redantzstudios.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 focus:ring-1 focus:ring-red-900 transition-all"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 focus:ring-1 focus:ring-red-900 transition-all"
                style={{ fontSize: '16px' }}
              />
            </div>
            {error && (
              <p className="text-[0.75rem] text-red-400 bg-red-950 border border-red-900 rounded-lg px-3 py-2.5">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C81010] text-white text-[0.78rem] font-semibold tracking-[0.1em] uppercase py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 mt-1">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[0.62rem] text-gray-700 mt-6">
          redantzstudios.com Admin Panel
        </p>
      </div>
    </div>
  )
}
