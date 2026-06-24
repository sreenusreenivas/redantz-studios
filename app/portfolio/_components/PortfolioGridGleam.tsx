'use client'

import Link from 'next/link'
import type { Portfolio } from '@/lib/types'

interface Props { portfolios: Portfolio[] }

export default function PortfolioGridGleam({ portfolios }: Props) {
  return (
    <section style={{ paddingBottom: '108px' }}>
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">

        {portfolios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '96px 0' }}>
            <p className="font-cormorant" style={{ color: '#ccc', fontSize: '1.5rem', fontWeight: 400 }}>
              No portfolios yet
            </p>
          </div>
        ) : (
          <div className="gleam-port-masonry">
            {portfolios.map((p) => (
              <div key={p.id} className="gleam-port-masonry-item" style={{ marginBottom: '30px' }}>

                {/* Image with hover overlay + plus icon */}
                <Link href={`/portfolio/${p.slug}`} className="gleam-img-wrap" style={{ display: 'block', marginBottom: '0' }}>
                  {p.cover_image ? (
                    <img src={p.cover_image} alt={p.couple_names} />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '3/4', background: '#e5e5e5' }} />
                  )}
                  <div className="gleam-overlay" />
                  <div className="gleam-plus" />
                </Link>

                {/* Caption below image */}
                <div style={{ textAlign: 'center', padding: '20px 8px 32px' }}>
                  <h3 className="font-cormorant" style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    margin: '0 0 6px',
                    lineHeight: 1.2,
                    letterSpacing: '0.02em',
                  }}>
                    <Link href={`/portfolio/${p.slug}`} className="gleam-caption-link">
                      {p.couple_names}
                    </Link>
                  </h3>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    <li style={{
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#858585',
                    }}>
                      {p.event_type}
                    </li>
                    {p.location && (
                      <>
                        <li style={{ display: 'inline-block', margin: '0 8px', color: '#ccc' }}>·</li>
                        <li style={{
                          display: 'inline-block',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: '#858585',
                        }}>
                          {p.location}
                        </li>
                      </>
                    )}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
