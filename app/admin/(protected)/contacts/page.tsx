import { createClient } from '@/lib/supabase/server'

async function getSubmissions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-white/5 text-white/30 border-white/10',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function AdminContactsPage() {
  const submissions = await getSubmissions()
  const newCount = submissions.filter(s => s.status === 'new').length

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#C81010] mb-2">Manage</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Contact Enquiries</h1>
            {newCount > 0 && (
              <span className="bg-[#C81010] text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                {newCount} new
              </span>
            )}
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-xl">
          <p className="text-white/20 text-lg font-light">No enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s.id}
              className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-6 py-5 hover:bg-white/[0.06] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <p className="text-white font-semibold text-sm">{s.name}</p>
                    <span className={`text-[0.58rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[s.status] || STATUS_STYLES.new}`}>
                      {s.status}
                    </span>
                    {s.event_type && (
                      <span className="text-[0.58rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-white/30">
                        {s.event_type}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/30 font-light">
                    <a href={`mailto:${s.email}`} className="hover:text-white/60 transition-colors">{s.email}</a>
                    {s.phone && <span>· {s.phone}</span>}
                    {s.event_date && <span>· {new Date(s.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`mailto:${s.email}?subject=Re: Your enquiry — RedAntz Studios`}
                    className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-md transition-all">
                    Reply ↗
                  </a>
                  <p className="text-[0.65rem] text-white/20 hidden lg:block">
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="text-white/40 text-xs font-light leading-relaxed border-t border-white/[0.05] pt-3 line-clamp-2">
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
