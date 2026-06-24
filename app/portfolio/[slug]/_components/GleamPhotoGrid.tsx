'use client'

import { useState, useMemo } from 'react'
import LightboxViewer from '@/components/gallery/LightboxViewer'
import type { PortfolioPhoto } from '@/lib/types'

interface Props {
  photos: PortfolioPhoto[]
}

export default function GleamPhotoGrid({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const slides = useMemo(() =>
    photos.map(p => ({ src: p.url, width: p.width || 1200, height: p.height || 800 })),
    [photos]
  )

  if (photos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '96px 0' }}>
        <p className="font-cormorant" style={{ color: '#ccc', fontSize: '1.5rem' }}>No photos yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="gleam-fs-gallery">
        <div className="gleam-masonry-3cols">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              className="gleam-gallery-item"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View photo ${i + 1}`}
            >
              <img
                src={photo.url}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      <LightboxViewer
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        slides={slides}
        onClose={() => setLightboxIndex(-1)}
      />
    </>
  )
}
