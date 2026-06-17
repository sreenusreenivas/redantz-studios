'use client'

import { useRef, useEffect } from 'react'

interface Category { id: string; label: string }

interface Props {
  categories: Category[]
  active: string
  onChange: (id: string) => void
  counts?: Record<string, number>
}

export default function CategoryNav({ categories, active, onChange, counts }: Props) {
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = navRef.current?.querySelector(`[data-id="${active}"]`) as HTMLElement
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div
        ref={navRef}
        className="flex overflow-x-auto scrollbar-hide max-w-[var(--max-w)] mx-auto px-[var(--px)]"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => {
          const isActive = cat.id === active
          const count = counts?.[cat.id]
          return (
            <button
              key={cat.id}
              data-id={cat.id}
              onClick={() => onChange(cat.id)}
              className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-4 text-[0.72rem] font-medium tracking-widest uppercase transition-colors whitespace-nowrap
                ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {cat.label}
              {count !== undefined && (
                <span className={`text-[0.58rem] px-1.5 py-0.5 rounded-full border
                  ${isActive
                    ? 'bg-red-50 text-[#C81010] border-red-200'
                    : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  {count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C81010] rounded-t" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
