import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/home/SiteHeader'
import GleamPhotoGrid from './_components/GleamPhotoGrid'
import GleamScrollTop from '../_components/GleamScrollTop'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolios').select('couple_names, event_type').eq('slug', params.slug).single()
    if (!data) return {}
    return {
      title: `${data.couple_names} — RedAntz Studios`,
      description: `${data.event_type} photography by RedAntz Studios`,
    }
  } catch { return {} }
}

async function getData(slug: string) {
  const supabase = await createClient()

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!portfolio) return null

  const [{ data: photos }, { data: allPortfolios }] = await Promise.all([
    supabase
      .from('portfolio_photos')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .order('display_order', { ascending: true }),
    supabase
      .from('portfolios')
      .select('id, slug, couple_names, cover_image')
      .eq('published', true)
      .order('created_at', { ascending: false }),
  ])

  const list = allPortfolios || []
  const idx = list.findIndex(p => p.id === portfolio.id)
  const prevPortfolio = idx > 0 ? list[idx - 1] : null
  const nextPortfolio = idx < list.length - 1 ? list[idx + 1] : null

  return { portfolio, photos: photos || [], prevPortfolio, nextPortfolio, allPortfolios: list }
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const data = await getData(params.slug)
  if (!data) notFound()

  const { portfolio, photos, prevPortfolio, nextPortfolio, allPortfolios } = data

  // Instagram strip — up to 8 portfolio cover images
  const instaImages: string[] = []
  if (allPortfolios.length > 0) {
    const covers = allPortfolios.map(p => p.cover_image).filter(Boolean) as string[]
    while (instaImages.length < 8 && covers.length > 0) instaImages.push(...covers)
    instaImages.splice(8)
  }

  const hasHero = Boolean(portfolio.cover_image)

  return (
    <div className="bg-white min-h-screen">
      <SiteHeader />

      {/* ── HERO BANNER ── header overlays it (transparent until scroll) */}
      {hasHero ? (
        <div className="gleam-detail-hero">
          <img
            src={portfolio.cover_image}
            alt={portfolio.couple_names}
            className="gleam-detail-hero-img"
          />
          <div className="gleam-detail-hero-overlay" />
          <div className="gleam-detail-hero-caption">
            <h1 className="font-cormorant">{portfolio.couple_names}</h1>
            {(portfolio.event_type || portfolio.date) && (
              <p>
                {[portfolio.event_type, portfolio.date].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* No cover image — push content below fixed header */
        <div className="pt-[4.5rem]" />
      )}

      {/* ── SECTION 1: Detail info ── */}
      <section style={{ marginBottom: '72px', paddingTop: '72px' }}>
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
          {/* If no hero, show the title here */}
          {!hasHero && (
            <h2
              className="font-cormorant"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 700,
                color: '#151515',
                lineHeight: 1.2,
                marginBottom: '32px',
              }}
            >
              {portfolio.couple_names}
            </h2>
          )}
          <div className="gleam-detail-cols">
            <p style={{ color: '#858585', lineHeight: 1.7, margin: 0 }}>
              {[portfolio.event_type, portfolio.date, portfolio.location].filter(Boolean).join(' · ')}
            </p>
            <p style={{ color: '#858585', lineHeight: 1.7, margin: 0 }}>
              {[
                portfolio.photographer && `Photographer: ${portfolio.photographer}`,
                photos.length > 0 && `${photos.length} photographs`,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Fullscreen 3-col masonry gallery ── */}
      <section style={{ marginBottom: '108px' }}>
        <GleamPhotoGrid photos={photos} />

        {/* Prev / Next navigation */}
        {(prevPortfolio || nextPortfolio) && (
          <div
            className="max-w-[var(--max-w)] mx-auto px-[var(--px)]"
            style={{ marginTop: '72px' }}
          >
            <div className="gleam-pn-row">

              {prevPortfolio ? (
                <Link href={`/portfolio/${prevPortfolio.slug}`} className="gleam-pn-nav">
                  {prevPortfolio.cover_image && (
                    <div className="gleam-pn-thumb">
                      <img src={prevPortfolio.cover_image} alt={prevPortfolio.couple_names} />
                    </div>
                  )}
                  <div className="gleam-pn-desc">
                    <h3 className="font-cormorant">← {prevPortfolio.couple_names}</h3>
                  </div>
                </Link>
              ) : <div />}

              {nextPortfolio ? (
                <Link href={`/portfolio/${nextPortfolio.slug}`} className="gleam-pn-nav gleam-pn-nav-right">
                  <div className="gleam-pn-desc">
                    <h3 className="font-cormorant">{nextPortfolio.couple_names} →</h3>
                  </div>
                  {nextPortfolio.cover_image && (
                    <div className="gleam-pn-thumb gleam-pn-thumb-right">
                      <img src={nextPortfolio.cover_image} alt={nextPortfolio.couple_names} />
                    </div>
                  )}
                </Link>
              ) : <div />}

            </div>
          </div>
        )}
      </section>

      {/* ── Instagram Strip ── */}
      {instaImages.length > 0 && (
        <div className="gleam-instagram">
          <div className="gleam-instagram-grid">
            {instaImages.map((src, i) => (
              <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="gleam-instagram-item">
                <img src={src} alt="" />
              </a>
            ))}
          </div>
          <div className="gleam-instagram-follow">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Follow Us!</a>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="gleam-footer">
        <div className="gleam-footer-inner">
          <div className="gleam-footer-grid">
            <div>
              <h5 className="font-cormorant gleam-footer-title">About Us</h5>
              <p className="gleam-footer-text">
                RedAntz Studios is a premium wedding &amp; portrait photography studio based in Visakhapatnam, India.
                We specialise in capturing authentic emotions and timeless memories.
              </p>
            </div>
            <div>
              <h5 className="font-cormorant gleam-footer-title">Contact</h5>
              <div className="gleam-footer-text">
                <p>Visakhapatnam, Andhra Pradesh, India</p>
                <p style={{ marginTop: '10px' }}>
                  <a href="mailto:hello@redantzstudios.com">hello@redantzstudios.com</a>
                </p>
              </div>
            </div>
            <div>
              <h5 className="font-cormorant gleam-footer-title">Quick Links</h5>
              <ul className="gleam-footer-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/portfolio">Portfolio</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="gleam-copyright">
            Copyright &copy; 2025, RedAntz Studios
          </div>
        </div>
      </footer>

      <GleamScrollTop />
    </div>
  )
}
