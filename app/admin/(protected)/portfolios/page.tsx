import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PublishToggle from './_components/PublishToggle'

async function getPortfolios() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolios')
    .select('id, slug, couple_names, event_type, date, location, published, cover_image, created_at')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function AdminPortfoliosPage() {
  const portfolios = await getPortfolios()

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">Manage</p>
          <h1 className="font-display text-3xl text-white tracking-wide">Portfolios</h1>
        </div>
        <Link href="/admin/portfolios/new"
          className="bg-[#C81010] text-white text-[0.72rem] font-semibold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Portfolio
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <p className="font-display text-3xl mb-2 text-gray-700">No portfolios yet</p>
          <p className="text-sm mb-6">Create your first portfolio to get started.</p>
          <Link href="/admin/portfolios/new" className="text-[#C81010] text-sm hover:underline">+ New Portfolio</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {portfolios.map((p) => (
            <div key={p.id}
              className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4 px-4 py-3.5 hover:border-gray-700 transition-colors">
              {/* Cover thumb */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                {p.cover_image
                  ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-700" />
                }
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{p.couple_names}</p>
                <p className="text-[0.68rem] text-gray-500 truncate">
                  {p.event_type} · {p.date} · {p.location}
                </p>
              </div>
              {/* Published toggle */}
              <PublishToggle id={p.id} published={p.published} />
              {/* Actions */}
              <div className="flex items-center gap-2 ml-2">
                <Link href={`/admin/portfolios/${p.id}`}
                  className="text-[0.68rem] text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-md transition-colors">
                  Edit
                </Link>
                <Link href={`/portfolio/${p.slug}`} target="_blank"
                  className="text-[0.68rem] text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-md transition-colors">
                  View ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
