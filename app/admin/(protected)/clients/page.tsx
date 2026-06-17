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
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">Manage</p>
          <h1 className="font-display text-3xl text-white tracking-wide">Client Galleries</h1>
        </div>
        <Link href="/admin/clients/new"
          className="bg-[#C81010] text-white text-[0.72rem] font-semibold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Gallery
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-3xl mb-2 text-gray-700">No client galleries yet</p>
          <Link href="/admin/clients/new" className="text-[#C81010] text-sm hover:underline">+ New Gallery</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => {
            const expired = c.expires_at && new Date(c.expires_at) < new Date()
            return (
              <div key={c.id}
                className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4 px-4 py-3.5 hover:border-gray-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{c.couple_names}</p>
                  <p className="text-[0.68rem] text-gray-500 truncate">
                    {c.event_type} · {c.date} · {c.total_photos} photos
                  </p>
                  {c.expires_at && (
                    <p className={`text-[0.62rem] ${expired ? 'text-red-500' : 'text-gray-600'}`}>
                      {expired ? 'Expired' : 'Expires'} {new Date(c.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {/* Status badge */}
                <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-1 rounded-full
                  ${c.active && !expired ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-600'}`}>
                  {expired ? 'Expired' : c.active ? 'Active' : 'Inactive'}
                </span>
                {/* Gallery ID */}
                <span className="text-[0.6rem] text-gray-700 font-mono hidden md:block">{c.gallery_id}</span>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/clients/${c.id}`}
                    className="text-[0.68rem] text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-md transition-colors">
                    Edit
                  </Link>
                  <Link href={`/client/${c.gallery_id}`} target="_blank"
                    className="text-[0.68rem] text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-md transition-colors">
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
