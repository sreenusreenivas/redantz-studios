import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getClients() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('client_galleries')
    .select('id, gallery_id, couple_names, event_type, date, total_photos, active, expires_at, created_at')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function AdminClientsPage() {
  const clients = await getClients()

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#C81010] mb-2">Manage</p>
          <h1 className="text-2xl font-bold text-white">Client Galleries</h1>
        </div>
        <Link href="/admin/clients/new"
          className="flex items-center gap-2 bg-[#C81010] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Gallery
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-xl">
          <p className="text-white/20 text-lg font-light mb-4">No client galleries yet</p>
          <Link href="/admin/clients/new" className="text-[#C81010] text-sm font-medium hover:underline">
            + Create your first gallery
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((c) => {
            const expired = c.expires_at && new Date(c.expires_at) < new Date()
            const isActive = c.active && !expired
            return (
              <div key={c.id}
                className="group bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.06] hover:border-white/10 transition-all">
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-white/15'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm truncate">{c.couple_names}</p>
                    <span className={`text-[0.58rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0
                      ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/25'}`}>
                      {expired ? 'Expired' : c.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs font-light mt-0.5">
                    {c.event_type}{c.date ? ` · ${c.date}` : ''} · {c.total_photos} photos
                    {c.expires_at && <span className={expired ? ' · text-red-400' : ''}>
                      {expired ? ` · Expired ${new Date(c.expires_at).toLocaleDateString()}` : ` · Expires ${new Date(c.expires_at).toLocaleDateString()}`}
                    </span>}
                  </p>
                </div>
                <span className="text-[0.62rem] text-white/15 font-mono hidden lg:block">{c.gallery_id}</span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/clients/${c.id}`}
                    className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-all">
                    Edit
                  </Link>
                  <Link href={`/client/${c.gallery_id}`} target="_blank"
                    className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-all">
                    View ↗
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
