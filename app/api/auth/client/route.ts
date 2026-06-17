import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { galleryId, password } = await req.json()

  if (!galleryId || !password) {
    return NextResponse.json({ error: 'galleryId and password required' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data: gallery, error } = await supabase
    .from('client_galleries')
    .select('id, password_hash, active, expires_at')
    .eq('gallery_id', galleryId)
    .single()

  if (error || !gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
  if (!gallery.active) return NextResponse.json({ error: 'Gallery is not active' }, { status: 403 })
  if (gallery.expires_at && new Date(gallery.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Gallery access has expired' }, { status: 403 })
  }

  const valid = await bcrypt.compare(password, gallery.password_hash)
  if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })

  return NextResponse.json({ ok: true })
}
