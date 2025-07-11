// lib/seoConfig.ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adiviso Logistic - We move what matters',
  description: 'Adiviso Logistic is a modern logistics platform connecting senders, couriers, and recipients with real-time delivery tracking, seamless route management, and smart geolocation services.',
  manifest: '/manifest.json',
  keywords: [
    'Adiviso',
    'Logistics',
    'Delivery',
    'Courier Service',
    'Shipping',
    'Real-time Tracking',
    'Transport',
    'Route Optimization',
    'Pickup and Dropoff',
    'Philippine Logistics',
  ],
  authors: [{ name: 'Robert Marquez', url: 'https://github.com/robertmarquez' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
  metadataBase: new URL('https://logisticfrontend.vercel.app'),
  other: {
    'format-detection': 'telephone=no',
    'viewport': 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no',
    'theme-color': '#0F172A',
    'msapplication-TileColor': '#0F172A',
  },
  openGraph: {
    type: 'website',
    title: 'Adiviso Logistic - We move what matters',
    description: 'Adiviso connects deliveries with precision and speed. Monitor real-time routes, schedule pickups, and streamline logistics with ease.',
    url: 'https://logisticfrontend.vercel.app',
    siteName: 'Adiviso',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Adiviso - Real-time Delivery and Logistics Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adiviso Logistic - We move what matters',
    description: 'Real-time delivery management and logistics made simple and reliable with Adiviso.',
    images: ['/og-image.jpg'],
    creator: '@advisologistics',
  },
}
