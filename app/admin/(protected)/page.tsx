import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()
  const [{ count: portfolios }, { count: clients }, { count: photos }] = await Promise.all([
    supabase.from('portfolios').select('*', { count: 'exact', head: true }),
    supabase.from('client_galleries').select('*', { count: 'exact', head: true }),
    supabase.from('portfolio_photos').select('*', { count: 'exact', head: true }),
  ])
  return {
    portfolios: portfolios ?? 0,
    clients: clients ?? 0,
    photos: photos ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-10">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">Dashboard</p>
        <h1 className="font-display text-3xl text-white tracking-wide">Overview</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Portfolios" value={stats.portfolios} href="/admin/portfolios" />
        <StatCard label="Client Galleries" value={stats.clients} href="/admin/clients" />
        <StatCard label="Total Photos" value={stats.photos} href="/admin/portfolios" />
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-600 mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction href="/admin/portfolios/new" label="New Portfolio" desc="Upload a new wedding or portrait project" />
          <QuickAction href="/admin/clients/new" label="New Client Gallery" desc="Create a private gallery for a client" />
          <QuickAction href="/admin/portfolios" label="Manage Portfolios" desc="Edit, publish or delete portfolios" />
          <QuickAction href="/admin/clients" label="Manage Clients" desc="View and update client gallery access" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-2 hover:border-gray-700 transition-colors group">
      <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">{label}</span>
      <span className="font-display text-4xl text-white">{value.toLocaleString()}</span>
    </Link>
  )
}

function QuickAction({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href}
      className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-gray-700 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-red-950 flex items-center justify-center transition-colors flex-shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 group-hover:text-[#C81010] transition-colors">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-[0.7rem] text-gray-500">{desc}</p>
      </div>
    </Link>
  )
}
