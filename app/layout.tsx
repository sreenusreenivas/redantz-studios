import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'RedAntz Studios | Wedding & Portrait Photography',
    template: '%s | RedAntz Studios',
  },
  description:
    'RedAntz Studios — premium wedding, pre-wedding and portrait photography based in Visakhapatnam, India.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://redantzstudios.com',
    siteName: 'RedAntz Studios',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
