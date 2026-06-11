import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KP Golf Training | Affordable Golf Lessons in South Jersey',
  description:
    'Real-world golf coaching from an experienced caddie at Tavistock & Pine Valley. Affordable 1-on-1 lessons in South Jersey — beginners to mid-handicaps welcome.',
  icons: {
        icon: 'https://assets.cdn.filesafe.space/R0DbCDcJdSd6Bd4e4qwT/media/6917e128286c472a0cf05f55.png',
    apple: 'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a2accd9983b31ac4a45bd9d.jpeg',
  },
  openGraph: {
    title: 'KP Golf Training | Affordable Golf Lessons in South Jersey',
    description:
      "Honest, judgment-free golf coaching from someone who's spent years looping at Tavistock and Pine Valley. Starting at $39.99.",
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a2accd9983b31ac4a45bd9d.jpeg',
        width: 1200,
        height: 630,
        alt: 'KP Golf Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KP Golf Training | Affordable Golf Lessons in South Jersey',
    description:
      "Honest, judgment-free golf coaching from someone who's spent years looping at Tavistock and Pine Valley. Starting at $39.99.",
    images: [
      'https://assets.cdn.filesafe.space/tJprKZVdMbjamSREyAWg/media/6a2accd9983b31ac4a45bd9d.jpeg',
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
