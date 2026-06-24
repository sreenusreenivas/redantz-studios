import type { Metadata } from 'next'
import { DM_Sans, Cormorant } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

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
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}
