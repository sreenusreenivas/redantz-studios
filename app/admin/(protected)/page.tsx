import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()
  const [{ count: portfolios }, { count: clients }, { count: photos }] = await Promise.all([
    supabase.from('portfolios').select('*', { count: 'exact', head: true }),
    supabase.from('client_galleries').select('*', { count: 'exact', head: true }),
    supabase.from('portfolio_photos').select('*', { count: 'exact', head: true }),
  ])
  return { portfolios: portfolios ?? 0, clients: clients ?? 0, photos: photos ?? 0 }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#C81010] mb-2">Overview</p>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Portfolios', value: stats.portfolios, href: '/admin/portfolios', icon: '◻' },
          { label: 'Client Galleries', value: stats.clients, href: '/admin/clients', icon: '◻' },
          { label: 'Total Photos', value: stats.photos, href: '/admin/portfolios', icon: '◻' },
        ].map(({ label, value, href }) => (
          <Link key={label} href={href}
            className="group bg-white/[0.04] border border-white/[0.07] rounded-xl p-6 hover:bg-white/[0.07] hover:border-white/10 transition-all">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">{label}</p>
            <p className="text-4xl font-bold text-white">{value.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/20 mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { href: '/admin/portfolios/new', label: 'New Portfolio', desc: 'Upload a new project', primary: true },
            { href: '/admin/clients/new', label: 'New Client Gallery', desc: 'Create a private gallery', primary: false },
            { href: '/admin/portfolios', label: 'Manage Portfolios', desc: 'Edit, publish or delete', primary: false },
            { href: '/admin/clients', label: 'Manage Clients', desc: 'View and update access', primary: false },
          ].map(({ href, label, desc, primary }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all
                ${primary
                  ? 'bg-[#C81010]/10 border-[#C81010]/20 hover:bg-[#C81010]/15'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${primary ? 'bg-[#C81010]/20' : 'bg-white/5'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={primary ? '#C81010' : 'rgba(255,255,255,0.3)'} strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">{label}</p>
                <p className="text-xs text-white/30 font-light">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
