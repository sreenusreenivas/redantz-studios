import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PortfolioEditForm from './_components/PortfolioEditForm'
import PhotoUploader from '@/components/admin/PhotoUploader'

async function getPortfolio(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('portfolios').select('*').eq('id', id).single()
  return data
}

async function getPhotos(portfolioId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolio_photos')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('display_order', { ascending: true })
  return data || []
}

export default async function AdminPortfolioDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [portfolio, photos] = await Promise.all([getPortfolio(id), getPhotos(id)])
  if (!portfolio) notFound()

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">
          <a href="/admin/portfolios" className="hover:text-red-400">Portfolios</a> · Edit
        </p>
        <h1 className="font-display text-3xl text-white tracking-wide">{portfolio.couple_names}</h1>
      </div>

      {/* Edit metadata */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 mb-5">Portfolio Details</p>
        <PortfolioEditForm portfolio={portfolio} />
      </section>

      {/* Photo management */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500">
            Photos · {photos.length}
          </p>
        </div>
        <PhotoUploader portfolioId={portfolio.id} />
        {photos.length > 0 && (
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square rounded-md overflow-hidden bg-gray-800">
                <img src={photo.thumb_url || photo.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[0.6rem] text-white/80 text-center px-1">{photo.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
