import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/home/SiteHeader'
import HeroSlider from './_components/HeroSlider'
import PortfolioGridGleam from './_components/PortfolioGridGleam'
import GleamScrollTop from './_components/GleamScrollTop'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Portfolio } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Portfolio — RedAntz Studios',
  description: 'Browse our wedding, pre-wedding and portrait photography portfolio.',
}

const SLIDE_COPY = [
  { title: 'Creative Photography Studio', subtitle: 'We capture emotions, tell stories, and create memories that last a lifetime.' },
  { title: 'Emotions & Happiness', subtitle: 'Every wedding is unique — we document yours with passion and artistry.' },
  { title: 'Unique Moments', subtitle: 'From intimate portraits to grand celebrations, every frame matters.' },
]

async function getPortfolios(): Promise<Portfolio[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolios').select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    return data || []
  } catch { return [] }
}

export default async function PortfolioListPage() {
  const portfolios = await getPortfolios()

  // Build hero slides from portfolio cover images
  const slides = portfolios.slice(0, 3).map((p, i) => ({
    image: p.cover_image || '/images/hero-bg.jpg',
    title: SLIDE_COPY[i]?.title ?? SLIDE_COPY[0].title,
    subtitle: SLIDE_COPY[i]?.subtitle ?? SLIDE_COPY[0].subtitle,
  }))
  if (slides.length === 0) {
    SLIDE_COPY.forEach(s => slides.push({ image: '/images/hero-bg.jpg', ...s }))
  }

  // Featured work (latest 3) for the blog-style section
  const featured = portfolios.slice(0, 3)

  // Instagram strip images (up to 8 portfolio covers, repeat if needed)
  const instaImages: string[] = []
  if (portfolios.length > 0) {
    const covers = portfolios.map(p => p.cover_image || '/images/hero-bg.jpg')
    while (instaImages.length < 8) instaImages.push(...covers)
    instaImages.splice(8)
  }

  return (
    <div className="bg-white">
      <SiteHeader />

      {/* ── HERO SLIDER ── (no pt-[4.5rem] — header overlays the slider) */}
      <HeroSlider slides={slides} />

      {/* ── SECTION 1: Studio Intro ── */}
      <section className="gleam-section">
        <div className="gleam-section-container">
          <div className="gleam-section-max">
            <h2 className="font-cormorant gleam-section-title">
              We&rsquo;re RedAntz, a passionate photography studio based in Visakhapatnam
            </h2>
            <p className="gleam-section-sub">
              We love capturing emotions and travelling to meet beautiful people. From intimate weddings to grand
              celebrations, pre-wedding shoots to portrait sessions — every frame is crafted with intention and love.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Portfolio Masonry Grid ── */}
      <section id="portfolio-grid" style={{ marginBottom: '108px' }}>
        <PortfolioGridGleam portfolios={portfolios} />
      </section>

      {/* ── SECTION 3: Parallax Testimonial ── */}
      <div
        className="gleam-parallax"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="gleam-parallax-inner">
          <h4 className="font-cormorant gleam-quote">
            &ldquo; The creativity and talent of the RedAntz team was absolutely amazing. They captured every emotion
            perfectly — our wedding album is a treasure we&rsquo;ll cherish forever. &rdquo;
          </h4>
          <div className="gleam-quote-name">Priya &amp; Arjun — Wedding Clients</div>
        </div>
      </div>

      {/* ── SECTION 4: Featured Work Intro ── */}
      <section className="gleam-section" style={{ paddingTop: '0' }}>
        <div className="gleam-section-container">
          <div className="gleam-section-max">
            <h2 className="font-cormorant gleam-section-title">Featured Work</h2>
            <p className="gleam-section-sub">
              A glimpse into our recent photography sessions — each one a unique story captured with artistry and care.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Featured Work 3-col ── */}
      {featured.length > 0 && (
        <section className="gleam-section-home15">
          <div className="gleam-blog-grid">
            {featured.map((p) => (
              <article key={p.id}>
                <Link href={`/portfolio/${p.slug}`} className="gleam-post-img-wrap">
                  <img
                    src={p.cover_image || '/images/hero-bg.jpg'}
                    alt={p.couple_names}
                  />
                </Link>
                <div>
                  <h2 className="font-cormorant gleam-article-title">
                    <Link href={`/portfolio/${p.slug}`}>{p.couple_names}</Link>
                  </h2>
                  <ul className="gleam-post-meta">
                    {p.date && <li>{p.date}</li>}
                    {p.event_type && <li className="gleam-meta-categ">{p.event_type}</li>}
                  </ul>
                  <p className="gleam-article-excerpt">
                    {p.location ? `A beautiful session in ${p.location}.` : 'A beautiful photography session.'}{' '}
                    Captured with love and artistic vision by RedAntz Studios.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION 6: CTA Bar ── */}
      <section className="gleam-cta">
        <div className="gleam-cta-inner">
          <h3 className="font-cormorant gleam-cta-title">
            We love meeting new people. If you want to work with us, send a message.
          </h3>
          <Link href="/contact" className="gleam-btn-round">Contact Us</Link>
        </div>
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

      {/* ── FOOTER ── */}
      <footer className="gleam-footer">
        <div className="gleam-footer-inner">
          <div className="gleam-footer-grid">
            {/* About */}
            <div>
              <h5 className="font-cormorant gleam-footer-title">About Us</h5>
              <p className="gleam-footer-text">
                RedAntz Studios is a premium wedding &amp; portrait photography studio based in Visakhapatnam, India.
                We specialise in capturing authentic emotions and timeless memories.
              </p>
            </div>
            {/* Contact */}
            <div>
              <h5 className="font-cormorant gleam-footer-title">Contact</h5>
              <div className="gleam-footer-text">
                <p>Visakhapatnam, Andhra Pradesh, India</p>
                <p style={{ marginTop: '10px' }}>
                  <a href="mailto:hello@redantzstudios.com">hello@redantzstudios.com</a>
                </p>
              </div>
            </div>
            {/* Quick Links */}
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
