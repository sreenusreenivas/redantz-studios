'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Slide {
  image: string
  title: string
  subtitle: string
}

interface Props {
  slides: Slide[]
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="gleam-hero">
      <AnimatePresence>
        <motion.div
          key={current}
          className="gleam-slide"
          style={{ backgroundImage: `url('${slides[current].image}')` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="gleam-slide-overlay" />
          <div className="gleam-slider-caption">
            <h1 className="font-cormorant">{slides[current].title}</h1>
            <p>{slides[current].subtitle}</p>
            <Link href="#portfolio-grid" className="gleam-slider-btn">Explore Our Work</Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="gleam-slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`gleam-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
