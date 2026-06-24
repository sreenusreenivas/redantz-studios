'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Portfolio } from '@/lib/types'

interface Category { id: string; label: string }
interface Props { portfolios: Portfolio[]; categories: Category[] }

export default function PortfolioGrid({ portfolios, categories }: Props) {
  const [active, setActive] = useState('all')

  const filtered = useMemo(() =>
    active === 'all' ? portfolios : portfolios.filter((p) => p.event_type === active),
    [portfolios, active]
  )

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-[4.5rem] bg-white border-b border-gray-100 z-40">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
          <div className="flex overflow-x-auto gap-1 py-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat) => {
              const count = cat.id === 'all'
                ? portfolios.length
                : portfolios.filter((p) => p.event_type === cat.id).length
              const isActive = active === cat.id
              return (
                <button key={cat.id} onClick={() => setActive(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}>
                  {cat.label}
                  <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-medium
                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {filtered.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}>
                <Link href={`/portfolio/${p.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                  {p.cover_image
                    ? <img src={p.cover_image} alt={p.couple_names}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    : <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="bg-white/90 text-gray-700 text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {p.event_type}
                    </span>
                  </div>
                  <div className="absolute bottom-0 p-5">
                    <p className="text-white font-semibold text-lg leading-snug">{p.couple_names}</p>
                    <p className="text-white/50 text-xs font-medium mt-1 uppercase tracking-widest">
                      {p.date}{p.location ? ` · ${p.location}` : ''}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="bg-white text-gray-900 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-md shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      View Gallery →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-300 font-light text-lg">No portfolios in this category yet</p>
          </div>
        )}
      </div>
    </>
  )
}
