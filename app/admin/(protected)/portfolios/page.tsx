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
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#C81010] mb-2">Manage</p>
          <h1 className="text-2xl font-bold text-white">Portfolios</h1>
        </div>
        <Link href="/admin/portfolios/new"
          className="flex items-center gap-2 bg-[#C81010] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Portfolio
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-xl">
          <p className="text-white/20 text-lg font-light mb-4">No portfolios yet</p>
          <Link href="/admin/portfolios/new" className="text-[#C81010] text-sm font-medium hover:underline">
            + Create your first portfolio
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {portfolios.map((p) => (
            <div key={p.id}
              className="group bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.06] hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                {p.cover_image
                  ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{p.couple_names}</p>
                <p className="text-white/30 text-xs font-light truncate mt-0.5">
                  {p.event_type}{p.date ? ` · ${p.date}` : ''}{p.location ? ` · ${p.location}` : ''}
                </p>
              </div>
              <PublishToggle id={p.id} published={p.published} />
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/portfolios/${p.id}`}
                  className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-all">
                  Edit
                </Link>
                <Link href={`/portfolio/${p.slug}`} target="_blank"
                  className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-all">
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
