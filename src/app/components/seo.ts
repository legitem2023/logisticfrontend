// lib/seoConfig.ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-Crowd - Your Ultimate Marketplace',
  description: 'Discover top products and deals on E-Crowd. Shop smarter and faster with our user-friendly platform.',
  manifest: '/manifest.json',
  keywords: 'E-Crowd, online shopping, best deals, marketplace, e-commerce, crowd, legitem, ecrowd',
  authors: [{ name: 'E-Crowd Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Note: 'shrink-to-fit' is not available in the viewport object
    // We'll add it separately in the 'other' field
  },
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://new-client-legitem.vercel.app'),
  other: {
    'format-detection': 'telephone=no',
    // Adding shrink-to-fit for Safari
    'viewport': 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no'
  },
  openGraph: {
    type: 'website',
    title: 'Adiviso Logistic - We move what matters',
    description: 'Discover top products and deals on E-Crowd.',
    url: 'https://new-client-legitem.vercel.app',
    siteName: 'E-Crowd',
    images: [
      {
        url: '/Logo.svg',
        width: 1200,
        height: 630,
        alt: 'E-Crowd Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Crowd - Your Ultimate Marketplace',
    description: 'Discover top products and deals on E-Crowd.',
    images: ['/image/Crowd.svg'],
  },
}
