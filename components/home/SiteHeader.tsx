'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/portfolio',  label: 'Portfolio' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] flex items-center justify-between h-16">
        <Link href="/">
          <img
            src={scrolled ? '/logo.png' : '/logo-white.png'}
            alt="RedAntz Studios"
            className="h-7 w-auto transition-all"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[0.72rem] font-medium tracking-[0.1em] uppercase transition-colors
                ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/75 hover:text-white'}
                ${pathname === href ? (scrolled ? 'text-gray-900' : 'text-white') : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact"
            className={`text-[0.7rem] font-semibold tracking-[0.12em] uppercase px-4 py-2 rounded-sm transition-all
              ${scrolled
                ? 'bg-[#C81010] text-white hover:bg-red-700'
                : 'border border-white/55 text-white hover:bg-white/10'}`}>
            Contact
          </Link>
        </nav>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={scrolled ? '#111' : 'white'} strokeWidth="2">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-[var(--px)] py-4 space-y-3">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700 py-2">{label}</Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}
            className="block text-sm font-semibold text-[#C81010] py-2">Contact</Link>
        </div>
      )}
    </header>
  )
}
