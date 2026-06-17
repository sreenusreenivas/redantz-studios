import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export default cloudinary

// Build an optimized URL with transformations
export function optimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
) {
  const { width = 1200, quality = 'auto' } = options
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality,
    width,
    crop: 'limit',
    secure: true,
  })
}

// Tiny blur-up thumbnail (~40px wide)
export function thumbUrl(publicId: string) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    width: 40,
    crop: 'scale',
    secure: true,
  })
}
