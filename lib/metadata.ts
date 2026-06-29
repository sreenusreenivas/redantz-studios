import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.redantzstudios.com'

export const siteConfig = {
  name: 'RedAntz Studios',
  title: 'RedAntz Studios | Wedding & Portrait Photography',
  description:
    'RedAntz Studios — Premium wedding photography, cinematography and creative production. Based in Visakhapatnam, India.',
  url: siteUrl,
  ogImage: '/images/hero-bg.jpg',
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s | RedAntz Studios',
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: 'Premium wedding photography, cinematography and creative production.',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: 'Premium wedding photography, cinematography and creative production.',
    images: [siteConfig.ogImage],
  },
}
