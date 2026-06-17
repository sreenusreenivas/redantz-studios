'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  count: number
  onDownload: () => void
  onFavorite: () => void
  onClear: () => void
}

export default function SelectionBar({ count, onDownload, onFavorite, onClear }: Props) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2*var(--px))] max-w-xl"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <div className="flex items-center justify-between gap-4 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3.5 shadow-2xl">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl text-white">{count}</span>
              <span className="text-[0.72rem] uppercase tracking-widest text-gray-400">selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onFavorite} className="flex items-center gap-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 text-[0.72rem] font-medium px-3 py-2 rounded-lg transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Favorite
              </button>
              <button onClick={onDownload} className="flex items-center gap-1.5 bg-[#C81010] text-white hover:bg-red-700 text-[0.72rem] font-medium px-3 py-2 rounded-lg transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
              <button onClick={onClear} className="flex items-center gap-1.5 bg-gray-800 text-gray-500 hover:bg-gray-700 text-[0.72rem] px-3 py-2 rounded-lg transition-colors">
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
