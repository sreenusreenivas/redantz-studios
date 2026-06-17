'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import GalleryHero from '@/components/gallery/GalleryHero'
import CategoryNav from '@/components/gallery/CategoryNav'
import MasonryGrid from '@/components/gallery/MasonryGrid'
import SkeletonGrid from '@/components/gallery/SkeletonGrid'
import LightboxViewer from '@/components/gallery/LightboxViewer'
import BackToTop from '@/components/gallery/BackToTop'
import type { Portfolio, PortfolioPhoto } from '@/lib/types'
import { WEDDING_CATEGORIES } from '@/lib/types'

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createClient()

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: p } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (p) {
        setPortfolio(p)
        const { data: ph } = await supabase
          .from('portfolio_photos')
          .select('*')
          .eq('portfolio_id', p.id)
          .order('display_order', { ascending: true })
        setPhotos(ph || [])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: photos.length }
    photos.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return counts
  }, [photos])

  const filteredPhotos = useMemo(() =>
    activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory),
    [photos, activeCategory]
  )

  const lightboxSlides = useMemo(() =>
    filteredPhotos.map((p) => ({ src: p.url, width: p.width, height: p.height })),
    [filteredPhotos]
  )

  if (!loading && !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-display text-4xl text-gray-300 mb-2">Not Found</p>
          <a href="/portfolio" className="text-sm text-[#C81010]">← Back to Portfolio</a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {portfolio && (
        <GalleryHero
          coupleNames={portfolio.couple_names}
          subtitle={portfolio.event_type}
          date={portfolio.date}
          location={portfolio.location}
          coverImage={portfolio.cover_image || '/images/hero-bg.jpg'}
          photographer={portfolio.photographer}
        />
      )}

      {/* Stats bar */}
      {portfolio && (
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-3 flex items-center gap-5 flex-wrap">
            <Stat num={photos.length} label="Photos" />
            <Divider />
            <Stat num={WEDDING_CATEGORIES.length - 1} label="Categories" />
            <Divider />
            <span className="text-[0.65rem] text-gray-400 uppercase tracking-widest">{portfolio.date}</span>
            <Divider className="hidden md:block" />
            <span className="text-[0.65rem] text-gray-400 uppercase tracking-widest hidden md:block">
              {portfolio.photographer}
            </span>
          </div>
        </div>
      )}

      {/* Category nav */}
      <CategoryNav
        categories={WEDDING_CATEGORIES}
        active={activeCategory}
        onChange={(id) => { setActiveCategory(id); setLightboxIndex(-1) }}
        counts={categoryCounts}
      />

      {/* Gallery */}
      <section className="py-8 pb-20" id="gallery">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] mb-5 flex items-center justify-between">
          <span className="text-[0.68rem] text-gray-300 uppercase tracking-widest">
            {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' && ` · ${WEDDING_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
          </span>
        </div>

        {loading
          ? <SkeletonGrid count={12} />
          : <MasonryGrid photos={filteredPhotos} onPhotoClick={setLightboxIndex} />
        }
      </section>

      <LightboxViewer
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        slides={lightboxSlides}
        onClose={() => setLightboxIndex(-1)}
      />

      <BackToTop />
    </div>
  )
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-lg text-gray-900">{num}</span>
      <span className="text-[0.62rem] text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function Divider({ className = '' }: { className?: string }) {
  return <span className={`w-px h-4 bg-gray-200 ${className}`} />
}
