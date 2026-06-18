import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/home/SiteHeader'
import type { Portfolio } from '@/lib/types'

async function getRecentPortfolios(): Promise<Portfolio[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolios').select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)
    return data || []
  } catch { return [] }
}

export default async function HomePage() {
  const portfolios = await getRecentPortfolios()

  return (
    <div className="bg-white">
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Full-bleed background */}
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt=""
            className="w-full h-full object-cover object-center" />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Content — bottom aligned */}
        <div className="relative z-10 w-full max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-20 pt-[7rem]">
          <p className="text-[0.68rem] font-semibold tracking-[0.35em] uppercase text-[#C81010] mb-5">
            Visakhapatnam, India
          </p>
          <h1 className="text-white leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: 'clamp(3.2rem, 8vw, 7rem)', fontWeight: 800 }}>
            Capturing Moments<br />That Last Forever
          </h1>
          <p className="text-white/60 font-light leading-relaxed mb-10 max-w-sm"
            style={{ fontSize: '0.95rem' }}>
            Premium wedding & portrait photography.<br />
            Every frame crafted with intention and light.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/portfolio"
              className="bg-white text-gray-900 text-sm font-bold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-colors">
              View Portfolio
            </Link>
            <Link href="/contact"
              className="border border-white/30 text-white text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors">
              Book a Session
            </Link>
          </div>

          {/* Stats — inline at bottom */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
            {[['8+', 'Years'], ['500+', 'Weddings'], ['50K+', 'Photos']].map(([num, label]) => (
              <div key={label}>
                <p className="text-white font-bold text-xl">{num}</p>
                <p className="text-white/40 text-xs font-medium mt-0.5 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT PORTFOLIO ── */}
      <section className="py-24 px-[var(--px)] bg-white">
        <div className="max-w-[var(--max-w)] mx-auto">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-[#C81010] mb-3">
                Selected Work
              </p>
              <h2 className="text-gray-900 tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 700 }}>
                Recent Portfolio
              </h2>
            </div>
            <Link href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors group flex-shrink-0">
              View all projects
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* 3-col equal grid */}
          {portfolios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolios.map((p) => (
                <Link key={p.id} href={`/portfolio/${p.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt={p.couple_names}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  {/* Event type badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 text-gray-800 text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {p.event_type}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="absolute bottom-0 p-5">
                    <p className="text-white font-bold text-lg leading-snug">{p.couple_names}</p>
                    <p className="text-white/50 text-xs font-medium mt-1 uppercase tracking-widest">
                      {p.date}{p.location ? ` · ${p.location}` : ''}
                    </p>
                  </div>
                  {/* Hover button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg shadow-2xl translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      View Gallery →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="col-span-3 text-center py-20 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-gray-300 font-light">Portfolios coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 px-[var(--px)] bg-gray-50 border-y border-gray-100">
        <div className="max-w-[var(--max-w)] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C81010" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: 'Premium Quality',
                desc: 'Every image is meticulously edited to ensure the highest standard of quality.'
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C81010" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title: 'Timely Delivery',
                desc: 'Your gallery will be delivered within the agreed timeframe, every time.'
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C81010" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                title: 'Personal Touch',
                desc: 'We take time to understand your story before we start shooting.'
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1.5">{title}</p>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK WITH US ── */}
      <section className="py-24 px-[var(--px)] bg-white">
        <div className="max-w-[var(--max-w)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — editorial headline */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.35em] uppercase text-[#C81010] mb-6">
                Work With Us
              </p>
              <h2 className="text-gray-900 leading-[1.1] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800 }}>
                Let&apos;s Create<br />Something You&apos;ll<br />
                <span className="text-[#C81010]">Treasure Forever.</span>
              </h2>
              <p className="text-gray-400 font-light leading-relaxed mb-10 max-w-sm"
                style={{ fontSize: '0.95rem' }}>
                We limit our sessions each season to ensure every client receives our full creative attention. Secure your date before it&apos;s gone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-7 py-3.5 rounded-lg hover:bg-[#C81010] transition-colors group">
                  Book a Session
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/portfolio"
                  className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-7 py-3.5 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors">
                  View Our Work
                </Link>
              </div>
            </div>

            {/* Right — process steps card */}
            <div className="relative">
              {/* Decorative red line */}
              <div className="absolute -left-6 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-[#C81010]/30 to-transparent hidden lg:block" />

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 space-y-0">
                {/* Booking badge */}
                <div className="flex items-center justify-between mb-8">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">How It Works</p>
                  <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[0.62rem] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Now Booking 2026
                  </span>
                </div>

                {/* Steps */}
                {[
                  { n: '01', title: 'Consultation', desc: 'Free 30-min call to discuss your vision, venue & style.' },
                  { n: '02', title: 'Shoot Day', desc: 'We arrive early, stay late, and capture every real moment.' },
                  { n: '03', title: 'Your Gallery', desc: 'Fully edited, delivered online within 7–10 business days.' },
                ].map(({ n, title, desc }, i, arr) => (
                  <div key={n} className={`flex gap-5 ${i < arr.length - 1 ? 'pb-6 mb-6 border-b border-gray-100' : ''}`}>
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[0.65rem] font-bold text-[#C81010] tracking-wide">{n}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 px-[var(--px)] py-8">
        <div className="max-w-[var(--max-w)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="RedAntz Studios" className="h-6 w-auto" />
          <p className="text-xs text-gray-300 font-medium">
            © {new Date().getFullYear()} RedAntz Studios · Visakhapatnam, India
          </p>
          <div className="flex items-center gap-4">
            <Link href="/portfolio" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Portfolio</Link>
            <Link href="/contact" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
