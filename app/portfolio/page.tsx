import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/home/SiteHeader'
import PortfolioGrid from './_components/PortfolioGrid'
import type { Metadata } from 'next'
import type { Portfolio } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Portfolio — RedAntz Studios',
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
      .from('portfolios').select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    return data || []
  } catch { return [] }
}

export default async function PortfolioListPage() {
  const portfolios = await getPortfolios()
  return (
    <div className="bg-white min-h-screen">
      <SiteHeader />
      <div className="pt-[4.5rem]">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-16 pb-10 border-b border-gray-100">
          <p className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-[#C81010] mb-3">Our Work</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-sm text-gray-400 font-medium hidden sm:block">{portfolios.length} projects</p>
          </div>
          <p className="text-gray-400 text-sm font-light max-w-lg mt-4 leading-relaxed">
            Every frame tells a story. Weddings, portraits and moments captured across India.
          </p>
        </div>
        <PortfolioGrid portfolios={portfolios} categories={FILTER_CATEGORIES} />
      </div>
    </div>
  )
}
