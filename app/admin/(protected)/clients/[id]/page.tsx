import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ClientGalleryEditForm from './_components/ClientGalleryEditForm'
import PhotoUploader from '@/components/admin/PhotoUploader'

async function getGallery(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('client_galleries').select('*').eq('id', id).single()
  return data
}

async function getPhotos(galleryId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('client_photos')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('display_order', { ascending: true })
  return data || []
}

export default async function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const gallery = await getGallery(id)
  if (!gallery) notFound()
  const photos = await getPhotos(gallery.id)

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C81010] mb-1">
          <a href="/admin/clients" className="hover:text-red-400">Client Galleries</a> · Edit
        </p>
        <h1 className="font-display text-3xl text-white tracking-wide">{gallery.couple_names}</h1>
        <p className="text-[0.7rem] text-gray-600 mt-1">
          Gallery URL: <a href={`/client/${gallery.gallery_id}`} target="_blank"
            className="text-gray-500 hover:text-gray-300">/client/{gallery.gallery_id}</a>
        </p>
      </div>

      {/* Edit form */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 mb-5">Gallery Settings</p>
        <ClientGalleryEditForm gallery={gallery} />
      </section>

      {/* Photos */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500">
            Photos · {photos.length}
          </p>
        </div>
        <PhotoUploader portfolioId={gallery.id} mode="client" />
        {photos.length > 0 && (
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square rounded-md overflow-hidden bg-gray-800">
                <img src={photo.thumb_url || photo.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
