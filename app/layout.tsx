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
  keywords: [
    'golf lessons South Jersey',
    'affordable golf coaching NJ',
    'golf instructor Marlton',
    'beginner golf lessons NJ',
    'Pine Valley caddie coach',
    'KP Golf Training',
  ],
  openGraph: {
    title: 'KP Golf Training | Affordable Golf Lessons in South Jersey',
    description:
      'Honest, judgment-free golf coaching from someone who\'s spent years looping at Tavistock and Pine Valley. Starting at $39.99.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KP Golf Training',
    description: 'Affordable golf lessons in South Jersey. Book your first session today.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0a0f0a] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
