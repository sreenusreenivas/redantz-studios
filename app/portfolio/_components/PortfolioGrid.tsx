'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Portfolio } from '@/lib/types'

interface Category { id: string; label: string }

interface Props {
  portfolios: Portfolio[]
  categories: Category[]
}

export default function PortfolioGrid({ portfolios, categories }: Props) {
  const [active, setActive] = useState('all')

  const filtered = useMemo(() =>
    active === 'all' ? portfolios : portfolios.filter((p) => p.event_type === active),
    [portfolios, active]
  )

  return (
    <>
      {/* Filter tabs */}
      <div className="border-y border-gray-100 sticky top-16 bg-white z-40">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] flex overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? portfolios.length
              : portfolios.filter((p) => p.event_type === cat.id).length
            const isActive = active === cat.id
            return (
              <button key={cat.id} onClick={() => setActive(cat.id)}
                className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-3.5 text-[0.7rem] font-medium tracking-widest uppercase transition-colors whitespace-nowrap
                  ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                {cat.label}
                <span className={`text-[0.58rem] px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-red-50 text-[#C81010]' : 'bg-gray-100 text-gray-400'}`}>
                  {count}
                </span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C81010] rounded-t" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}>
            {filtered.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.44, ease: [0.25, 0.46, 0.45, 0.94] }}>
                <Link href={`/portfolio/${p.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                  {p.cover_image
                    ? <img src={p.cover_image} alt={p.couple_names}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                    : <div className="w-full h-full bg-gray-200" />
                  }
                  {/* Type badge */}
                  <span className="absolute top-3 left-3 text-[0.58rem] font-bold tracking-[0.14em] uppercase bg-[#C81010] text-white px-2 py-1 rounded-sm">
                    {p.event_type}
                  </span>
                  {/* Gradient + info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <p className="font-display text-[clamp(1rem,2vw,1.4rem)] text-white tracking-wide leading-tight mb-1">
                      {p.couple_names}
                    </p>
                    <p className="text-[0.62rem] text-white/55 uppercase tracking-widest">
                      {p.date} · {p.location}
                    </p>
                  </div>
                  {/* View overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 bg-white text-gray-900 text-[0.68rem] font-bold tracking-[0.14em] uppercase px-4 py-2 rounded-sm">
                      View Gallery
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <p className="font-display text-3xl mb-2">No portfolios yet</p>
            <p className="text-sm">Check back soon.</p>
          </div>
        )}
      </div>
    </>
  )
}
