'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import CategoryNav from '@/components/gallery/CategoryNav'
import MasonryGrid from '@/components/gallery/MasonryGrid'
import SkeletonGrid from '@/components/gallery/SkeletonGrid'
import LightboxViewer from '@/components/gallery/LightboxViewer'
import SelectionBar from '@/components/gallery/SelectionBar'
import BackToTop from '@/components/gallery/BackToTop'
import type { ClientGallery, ClientPhoto } from '@/lib/types'

const PAGE_SIZE = 24

/* ── Client Login ── */
function ClientLogin({
  galleryId,
  meta,
  onSuccess,
}: {
  galleryId: string
  meta: ClientGallery | null
  onSuccess: () => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryId, password }),
    })
    if (res.ok) {
      localStorage.setItem(`cg_auth_${galleryId}`, 'true')
      onSuccess()
    } else {
      const { error: msg } = await res.json()
      setError(msg || 'Incorrect password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="RedAntz Studios" className="h-8 w-auto mx-auto mb-6" />
          <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-[#C81010] mb-1">Client Gallery</p>
          {meta && (
            <>
              <h1 className="font-display text-2xl text-gray-900 tracking-wide">{meta.couple_names}</h1>
              <p className="text-[0.68rem] text-gray-400 uppercase tracking-widest mt-0.5">
                {meta.event_type} · {meta.date}
              </p>
            </>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Gallery Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••••"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-red-50 transition-all"
                style={{ fontSize: '16px' }}
              />
            </div>
            {error && (
              <p className="text-[0.75rem] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C81010] text-white text-[0.78rem] font-semibold tracking-[0.1em] uppercase py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Access Gallery'}
            </button>
          </form>
          <p className="text-center text-[0.62rem] text-gray-300 mt-5 flex items-center justify-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            This gallery is private and password protected
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Main Gallery ── */
export default function ClientGalleryPage({ params }: { params: { galleryId: string } }) {
  const { galleryId } = params
  const supabase = createClient()
  const AUTH_KEY = `cg_auth_${galleryId}`
  const FAV_KEY = `rz_fav_${galleryId}`

  const [authenticated, setAuthenticated] = useState(false)
  const [meta, setMeta] = useState<ClientGallery | null>(null)
  const [photos, setPhotos] = useState<ClientPhoto[]>([])
  const [categories, setCategories] = useState([{ id: 'all', label: 'All' }])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavOnly, setShowFavOnly] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selected, setSelected] = useState(new Set<string>())
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')) } catch { return new Set() }
  })

  // Check local auth on mount
  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === 'true') setAuthenticated(true)
  }, [AUTH_KEY])

  // Load gallery metadata (always, even if not authenticated — for login screen)
  useEffect(() => {
    supabase.from('client_galleries')
      .select('id,gallery_id,couple_names,event_type,date,location,cover_image,total_photos,expires_at')
      .eq('gallery_id', galleryId)
      .eq('active', true)
      .single()
      .then(({ data }) => { if (data) setMeta(data as ClientGallery) })
  }, [galleryId])

  // Load photos when authenticated
  useEffect(() => {
    if (!authenticated || !meta) return
    setLoading(true)
    supabase.from('client_photos')
      .select('*')
      .eq('gallery_id', meta.id)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        const ph = data || []
        setPhotos(ph)
        // Build category tabs from unique categories
        const unique = Array.from(new Set(ph.map((p) => p.category)))
        setCategories([
          { id: 'all', label: 'All' },
          ...unique.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
        ])
        setLoading(false)
      })
  }, [authenticated, meta])

  // Persist favorites
  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites)))
  }, [favorites, FAV_KEY])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: photos.length }
    photos.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return counts
  }, [photos])

  const filteredPhotos = useMemo(() => {
    let list = photos
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter((p) => p.category.toLowerCase().includes(q))
    }
    if (showFavOnly) list = list.filter((p) => favorites.has(p.id))
    return list
  }, [photos, activeCategory, searchQuery, showFavOnly, favorites])

  const visiblePhotos = filteredPhotos.slice(0, visibleCount)

  const lightboxSlides = useMemo(() =>
    filteredPhotos.map((p) => ({ src: p.url, width: p.width, height: p.height, download: p.url })),
    [filteredPhotos]
  )

  const toggleFav = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <ClientLogin galleryId={galleryId} meta={meta} onSuccess={() => setAuthenticated(true)} />
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] flex items-center justify-between py-3.5">
          <a href="/"><img src="/logo.png" alt="RedAntz Studios" className="h-7 w-auto" /></a>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#C81010] text-white text-[0.68rem] font-semibold uppercase tracking-widest px-3.5 py-2 rounded-md hover:bg-red-700 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Download All</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-400 text-[0.68rem] uppercase tracking-widest px-3 py-2 rounded-md hover:border-gray-400 hover:text-gray-600 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
        {meta && (
          <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-5 border-t border-gray-50">
            <p className="text-[0.68rem] text-gray-300 uppercase tracking-widest mb-1">Welcome,</p>
            <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-gray-900 tracking-wide mb-2">
              {meta.couple_names}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-[0.72rem] text-gray-400">
              <span className="text-gray-600 font-medium">{meta.event_type}</span>
              <span className="text-gray-200">·</span>
              <span>{meta.date}</span>
              <span className="text-gray-200">·</span>
              <span><strong className="text-gray-900">{meta.total_photos.toLocaleString()}</strong> Photos</span>
              {meta.location && <><span className="text-gray-200">·</span><span>{meta.location}</span></>}
            </div>
            {meta.expires_at && (
              <p className="text-[0.65rem] text-gray-300 mt-2 flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Gallery access expires {new Date(meta.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        )}
      </header>

      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <CategoryNav
          categories={categories}
          active={activeCategory}
          onChange={(id) => { setActiveCategory(id); setVisibleCount(PAGE_SIZE); setSelected(new Set()) }}
          counts={categoryCounts}
        />
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-2.5 flex items-center gap-2 flex-wrap border-t border-gray-50">
          {/* Search */}
          <div className="relative flex-1 min-w-[140px] max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE) }}
              placeholder="Search…"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-[0.78rem] text-gray-700 outline-none focus:border-gray-300 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-base hover:text-gray-600">×</button>
            )}
          </div>
          {/* Favorites */}
          <button
            onClick={() => setShowFavOnly((v) => !v)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-[0.7rem] font-medium transition-colors
              ${showFavOnly ? 'bg-red-50 border-red-200 text-[#C81010]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill={showFavOnly ? '#C81010' : 'none'}
              stroke={showFavOnly ? '#C81010' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="hidden sm:inline">Favorites{favorites.size > 0 ? ` (${favorites.size})` : ''}</span>
          </button>
          {/* Select */}
          <button
            onClick={() => { setSelectionMode((v) => !v); setSelected(new Set()) }}
            className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-[0.7rem] font-medium transition-colors
              ${selectionMode ? 'bg-red-50 border-red-200 text-[#C81010]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span className="hidden sm:inline">{selectionMode ? 'Cancel' : 'Select'}</span>
          </button>
        </div>
      </div>

      {/* Gallery */}
      <section className="py-6">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] mb-4 flex items-center justify-between">
          <span className="text-[0.68rem] text-gray-300 uppercase tracking-widest">
            {filteredPhotos.length} photos
            {showFavOnly && ' · Favorites'}
            {searchQuery && ` · "${searchQuery}"`}
          </span>
          {selectionMode && selected.size > 0 && (
            <span className="text-[0.68rem] text-[#C81010]">{selected.size} selected</span>
          )}
        </div>

        {loading
          ? <SkeletonGrid count={12} />
          : (
            <>
              <MasonryGrid
                photos={visiblePhotos}
                onPhotoClick={setLightboxIndex}
                variant="client"
                favorites={favorites}
                selected={selected}
                selectionMode={selectionMode}
                onToggleFav={toggleFav}
                onToggleSelect={toggleSelect}
              />
              {visibleCount < filteredPhotos.length && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="border border-gray-200 text-gray-400 text-[0.72rem] font-medium uppercase tracking-widest px-10 py-3.5 rounded-sm hover:border-gray-400 hover:text-gray-700 transition-colors">
                    Load more · {filteredPhotos.length - visibleCount} remaining
                  </button>
                </div>
              )}
            </>
          )
        }
      </section>

      <LightboxViewer
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        slides={lightboxSlides}
        onClose={() => setLightboxIndex(-1)}
        withDownload
      />

      <SelectionBar
        count={selected.size}
        onDownload={() => alert(`Downloading ${selected.size} photos`)}
        onFavorite={() => {
          setFavorites((prev) => { const next = new Set(prev); selected.forEach((id) => next.add(id)); return next })
          setSelected(new Set())
        }}
        onClear={() => setSelected(new Set())}
      />

      <BackToTop />
    </div>
  )
}
