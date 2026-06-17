'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  coupleNames: string
  subtitle: string
  date: string
  location: string
  coverImage: string
  photographer?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fade: any = { hidden: { opacity: 0, y: 20 }, show: (i: number) => ({
  opacity: 1, y: 0,
  transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
})}

export default function GalleryHero({ coupleNames, subtitle, date, location, coverImage, photographer }: Props) {
  return (
    <section className="relative h-screen min-h-[580px] flex items-center justify-center overflow-hidden bg-black">
      {/* Ken-Burns bg */}
      <div className="absolute inset-0">
        <Image
          src={coverImage}
          alt={coupleNames}
          fill
          priority
          className="object-cover animate-kenBurns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/65" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-[var(--px)] py-6">
        <Link href="/">
          <img src="/logo-white.png" alt="RedAntz Studios" className="h-8 w-auto" />
        </Link>
        <Link href="/portfolio"
          className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-white border border-white/45 px-4 py-2 rounded-sm hover:bg-white/10 transition-all">
          Portfolio
        </Link>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center text-white px-[var(--px)] flex flex-col items-center gap-3">
        <motion.p
          custom={0} variants={fade} initial="hidden" animate="show"
          className="text-[0.68rem] font-medium tracking-[0.28em] uppercase text-white/65">
          {subtitle}
        </motion.p>
        <motion.h1
          custom={1} variants={fade} initial="hidden" animate="show"
          className="font-display text-[clamp(3rem,9vw,8rem)] leading-none tracking-wide drop-shadow-2xl">
          {coupleNames}
        </motion.h1>
        <motion.div
          custom={2} variants={fade} initial="hidden" animate="show"
          className="flex items-center gap-3 text-[0.76rem] tracking-[0.14em] uppercase text-white/70">
          <span>{date}</span>
          <span className="opacity-40">·</span>
          <span>{location}</span>
        </motion.div>
        {photographer && (
          <motion.p
            custom={3} variants={fade} initial="hidden" animate="show"
            className="text-[0.65rem] tracking-widest uppercase text-white/38">
            {photographer}
          </motion.p>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#gallery"
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
        <span className="text-[0.58rem] tracking-[0.2em] uppercase text-white/45">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.a>
    </section>
  )
}
