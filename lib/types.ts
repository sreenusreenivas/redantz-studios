export interface Portfolio {
  id: string
  slug: string
  couple_names: string
  event_type: string
  date: string
  location: string
  cover_image: string | null
  photographer: string
  published: boolean
  created_at: string
  updated_at: string
  photos?: PortfolioPhoto[]
}

export interface PortfolioPhoto {
  id: string
  portfolio_id: string
  cloudinary_id: string
  url: string
  thumb_url: string
  width: number
  height: number
  category: string
  display_order: number
  created_at: string
}

export interface ClientGallery {
  id: string
  gallery_id: string
  couple_names: string
  event_type: string
  date: string
  location: string
  cover_image: string | null
  total_photos: number
  expires_at: string | null
  active: boolean
  created_at: string
  photos?: ClientPhoto[]
}

export interface ClientPhoto {
  id: string
  gallery_id: string
  cloudinary_id: string
  url: string
  thumb_url: string
  width: number
  height: number
  category: string
  display_order: number
  created_at: string
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

export type EventCategory =
  | 'all'
  | 'pre-wedding'
  | 'wedding'
  | 'reception'
  | 'haldi'
  | 'mehendi'
  | 'family'
  | 'candid'
  | 'portraits'
  | 'general'

export const WEDDING_CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'pre-wedding', label: 'Pre Wedding' },
  { id: 'wedding',     label: 'Wedding' },
  { id: 'reception',   label: 'Reception' },
  { id: 'haldi',       label: 'Haldi' },
  { id: 'mehendi',     label: 'Mehendi' },
  { id: 'family',      label: 'Family' },
  { id: 'candid',      label: 'Candid' },
]

export const PORTRAIT_CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'candid',    label: 'Candid' },
  { id: 'general',   label: 'General' },
]

export const EVENT_CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'ceremony', label: 'Ceremony' },
  { id: 'candid',   label: 'Candid' },
  { id: 'family',   label: 'Family' },
  { id: 'general',  label: 'General' },
]
