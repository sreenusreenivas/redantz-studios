import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { createServiceClient } from '@/lib/supabase/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const portfolioId = formData.get('portfolioId') as string
  const category = (formData.get('category') as string) || 'ceremony'
  const mode = (formData.get('mode') as string) || 'portfolio'

  if (!file || !portfolioId) {
    return NextResponse.json({ error: 'file and portfolioId required' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const folder = mode === 'client'
    ? `redantz-studios/clients/${portfolioId}`
    : `redantz-studios/portfolios/${portfolioId}`

  const uploadResult = await new Promise<{ public_id: string; secure_url: string; width: number; height: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (err, result) => {
        if (err || !result) reject(err)
        else resolve(result as { public_id: string; secure_url: string; width: number; height: number })
      }
    )
    stream.end(buffer)
  })

  const thumbUrl = cloudinary.url(uploadResult.public_id, {
    width: 40, quality: 'auto', fetch_format: 'auto', crop: 'scale',
  })

  const table = mode === 'client' ? 'client_photos' : 'portfolio_photos'
  const foreignKey = mode === 'client' ? 'gallery_id' : 'portfolio_id'

  const { data: photo, error } = await supabase
    .from(table)
    .insert({
      [foreignKey]: portfolioId,
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      thumb_url: thumbUrl,
      width: uploadResult.width,
      height: uploadResult.height,
      category,
      display_order: 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(photo)
}
