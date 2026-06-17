'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import type { PortfolioPhoto, ClientPhoto } from '@/lib/types'

type Photo = PortfolioPhoto | ClientPhoto

interface Props {
  photos: Photo[]
  onPhotoClick: (index: number) => void
  variant?: 'public' | 'client'
  favorites?: Set<string>
  selected?: Set<string>
  selectionMode?: boolean
  onToggleFav?: (id: string) => void
  onToggleSelect?: (id: string) => void
}

function PhotoCard({
  photo,
  index,
  onClick,
  variant,
  isFav,
  isSelected,
  selectionMode,
  onToggleFav,
  onToggleSelect,
}: {
  photo: Photo
  index: number
  onClick: (i: number) => void
  variant: 'public' | 'client'
  isFav?: boolean
  isSelected?: boolean
  selectionMode?: boolean
  onToggleFav?: (id: string) => void
  onToggleSelect?: (id: string) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })

  const aspect = photo.height / photo.width
  const paddingTop = `${(aspect * 100).toFixed(2)}%`

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded cursor-pointer group bg-gray-100 mb-1.5 break-inside-avoid"
      style={{ paddingTop }}
      onClick={() => {
        if (selectionMode && onToggleSelect) {
          onToggleSelect(photo.id)
        } else {
          onClick(index)
        }
      }}
    >
      {inView && (
        <>
          {/* Blur-up thumb */}
          {!loaded && (
            <img
              src={photo.thumb_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 pointer-events-none"
            />
          )}
          <Image
            src={photo.url}
            alt={'alt' in photo ? (photo as { alt?: string }).alt ?? '' : ''}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-[1.04]
              ${loaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
            onLoad={() => setLoaded(true)}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            {!selectionMode && (
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 w-12 h-12 rounded-full border border-white/70 bg-black/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            )}
          </div>

          {/* Client actions */}
          {variant === 'client' && (
            <>
              {/* Checkbox (selection mode) */}
              {selectionMode && (
                <div className="absolute top-2 left-2 z-10">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-[#C81010] border-[#C81010]' : 'bg-black/40 border-white/70'}`}>
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* Fav button */}
              {!selectionMode && onToggleFav && (
                <button
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm
                    flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); onToggleFav(photo.id) }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill={isFav ? '#C81010' : 'none'}
                    stroke={isFav ? '#C81010' : 'white'}
                    strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              )}
            </>
          )}

          {/* Selected border */}
          {isSelected && (
            <div className="absolute inset-0 border-2 border-[#C81010] rounded pointer-events-none" />
          )}
        </>
      )}
    </div>
  )
}

export default function MasonryGrid({
  photos,
  onPhotoClick,
  variant = 'public',
  favorites,
  selected,
  selectionMode,
  onToggleFav,
  onToggleSelect,
}: Props) {
  const handleClick = useCallback((i: number) => onPhotoClick(i), [onPhotoClick])

  return (
    <div className="px-[var(--px)] max-w-[var(--max-w)] mx-auto"
      style={{ columns: 'var(--cols, 3)', columnGap: '6px' }}
    >
      <style>{`
        @media (max-width: 900px) { :root { --cols: 2; } }
        @media (max-width: 540px) { :root { --cols: 1; } }
        @media (min-width: 901px) { :root { --cols: 3; } }
      `}</style>
      {photos.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={i}
          onClick={handleClick}
          variant={variant}
          isFav={favorites?.has(photo.id)}
          isSelected={selected?.has(photo.id)}
          selectionMode={selectionMode}
          onToggleFav={onToggleFav}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  )
}
