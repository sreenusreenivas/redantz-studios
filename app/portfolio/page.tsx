import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/home/SiteHeader'
import PortfolioGrid from './_components/PortfolioGrid'
import type { Metadata } from 'next'
import type { Portfolio } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse our wedding, pre-wedding and portrait photography portfolio.',
}

const FILTER_CATEGORIES = [
  { id: 'all',         label: 'All Work' },
  { id: 'Wedding',     label: 'Weddings' },
  { id: 'Pre-Wedding', label: 'Pre-Wedding' },
  { id: 'Engagement',  label: 'Engagements' },
  { id: 'Event',       label: 'Events' },
  { id: 'Portrait',    label: 'Portraits' },
]

async function getPortfolios(): Promise<Portfolio[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function PortfolioListPage() {
  const portfolios = await getPortfolios()

  return (
    <div className="bg-white min-h-screen">
      <SiteHeader />

      {/* Banner */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-28 pb-10">
        <p className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C81010] mb-3">Our Work</p>
        <h1 className="font-display text-[clamp(3.5rem,8vw,6.5rem)] text-gray-900 leading-none mb-4">Portfolio</h1>
        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
          Every frame tells a story. Browse through our collection of weddings, portraits and moments captured across India.
        </p>
        <p className="text-[0.68rem] text-gray-300 uppercase tracking-widest mt-3">{portfolios.length} projects</p>
      </section>

      <PortfolioGrid portfolios={portfolios} categories={FILTER_CATEGORIES} />
    </div>
  )
}
