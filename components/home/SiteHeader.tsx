'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Only go transparent on the homepage over the dark hero
  const transparent = pathname === '/' && !scrolled && !open

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${transparent
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_1px_20px_rgba(0,0,0,0.05)]'
      }`}>
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] flex items-center justify-between h-[4.5rem]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src={transparent ? '/logo-white.png' : '/logo.png'}
            alt="RedAntz Studios"
            className="h-7 w-auto transition-opacity duration-300"
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`relative text-[0.8rem] font-medium tracking-wide transition-colors duration-200 group
                  ${transparent
                    ? active ? 'text-white' : 'text-white/60 hover:text-white'
                    : active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
                  }`}>
                {label}
                {/* Active indicator dot */}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C81010] transition-all duration-200
                  ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-100'}`} />
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact"
            className={`text-[0.75rem] font-bold px-5 py-2 rounded-md transition-all duration-300
              ${transparent
                ? 'border border-white/40 text-white hover:bg-white hover:text-gray-900'
                : 'bg-[#C81010] text-white hover:bg-red-700'
              }`}>
            Book a Session
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className={`md:hidden p-2 -mr-2 rounded-md transition-colors
            ${transparent ? 'hover:bg-white/10' : 'hover:bg-gray-50'}`}
          onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={transparent ? '#fff' : '#333'} strokeWidth="1.8" strokeLinecap="round">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="17" x2="21" y2="17" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-[var(--px)] py-6 space-y-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                  ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C81010]" />}
                {label}
              </Link>
            )
          })}
          <div className="pt-4">
            <Link href="/contact" onClick={() => setOpen(false)}
              className="block bg-[#C81010] text-white text-sm font-bold text-center px-4 py-3.5 rounded-lg hover:bg-red-700 transition-colors">
              Book a Session
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
