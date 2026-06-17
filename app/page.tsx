import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/home/SiteHeader'
import type { Portfolio } from '@/lib/types'

async function getRecentPortfolios(): Promise<Portfolio[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const portfolios = await getRecentPortfolios()

  return (
    <div className="bg-black min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt=""
            className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        </div>
        <div className="relative z-10 text-center text-white px-[var(--px)]">
          <p className="text-[0.68rem] font-medium tracking-[0.32em] uppercase text-white/55 mb-5">
            Visakhapatnam · India
          </p>
          <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-none tracking-wide mb-6">
            RedAntz<br />Studios
          </h1>
          <p className="text-[0.9rem] text-white/60 max-w-md mx-auto leading-relaxed mb-10">
            Premium wedding & portrait photography — every frame a story told with light.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/portfolio"
              className="bg-[#C81010] text-white text-[0.76rem] font-semibold tracking-[0.12em] uppercase px-7 py-3 rounded-sm hover:bg-red-700 transition-colors">
              View Portfolio
            </Link>
            <Link href="/contact"
              className="border border-white/40 text-white text-[0.76rem] font-semibold tracking-[0.12em] uppercase px-7 py-3 rounded-sm hover:bg-white/10 transition-colors">
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Work */}
      {portfolios.length > 0 && (
        <section className="bg-white py-20 px-[var(--px)]">
          <div className="max-w-[var(--max-w)] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-[#C81010] mb-2">Recent Work</p>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-gray-900 leading-none">Our Portfolio</h2>
              </div>
              <Link href="/portfolio"
                className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-gray-400 hover:text-gray-900 transition-colors hidden md:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolios.map((p) => (
                <Link key={p.id} href={`/portfolio/${p.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                  {p.cover_image && (
                    <img src={p.cover_image} alt={p.couple_names}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <p className="font-display text-xl text-white tracking-wide">{p.couple_names}</p>
                    <p className="text-[0.65rem] text-white/55 uppercase tracking-widest mt-1">
                      {p.event_type} · {p.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-black py-28 px-[var(--px)] text-center">
        <p className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C81010] mb-4">Let&apos;s Create Together</p>
        <h2 className="font-display text-[clamp(3rem,7vw,6rem)] text-white leading-none mb-6">
          Your Story.<br />Our Lens.
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Reach out to book your session. Limited slots available each season.
        </p>
        <Link href="/contact"
          className="inline-block bg-[#C81010] text-white text-[0.76rem] font-semibold tracking-[0.14em] uppercase px-10 py-4 rounded-sm hover:bg-red-700 transition-colors">
          Get in Touch
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-900 px-[var(--px)] py-8">
        <div className="max-w-[var(--max-w)] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/logo-white.png" alt="RedAntz Studios" className="h-6 w-auto opacity-50" />
          <p className="text-[0.65rem] text-gray-600 tracking-widest uppercase">
            © {new Date().getFullYear()} RedAntz Studios · Visakhapatnam
          </p>
        </div>
      </footer>
    </div>
  )
}
