// mockData.tsx

import { ReactNode } from 'react';
import SenderShipmentHistory from '../SenderShipmentHistory'; // ✅ Adjust path as needed

// 🎯 Carousel data interface and items
export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  actionLabel?: string;
}

export const mockItems: CarouselItem[] = [
  {
    id: 'promo1',
    title: 'We Move What Matters!',
    subtitle: 'Fast, reliable logistics solutions for businesses of all sizes.',
    imageUrl: '/BannerA.jpg',
    actionLabel: 'Use Now',
  },
  {
    id: 'rec1',
    title: 'From Point A to Anywhere.',
    subtitle: 'Local and nationwide delivery you can count on—on time, every time.',
    imageUrl: '/BannerB.jpg',
  },
  {
    id: 'service1',
    title: 'Smart Deliveries. Seamless Tracking.',
    subtitle: 'Real-time updates, flexible scheduling, and secure transport.',
    imageUrl: '/BannerC.jpg',
    actionLabel: 'Order Now',
  },
  {
    id: 'service2',
    title: 'Your Cargo, Our Priority.',
    subtitle: 'Dedicated logistics support from pickup to drop-off.',
    imageUrl: '/BannerD.jpg',
    actionLabel: 'Order Now',
  },
  {
    id: 'service3',
    title: 'Delivering More Than Just Packages.',
    subtitle: 'We deliver trust, speed, and peace of mind.',
    imageUrl: '/BannerE.jpg',
    actionLabel: 'Order Now',
  },
];


export interface ProgressItem {
  label: string;
  content: () => ReactNode;
}

export const progressItem: ProgressItem[] = [
  { label: 'In Progress', content: () => SenderShipmentHistory() },
  { label: 'Completed', content: () => SenderShipmentHistory() },
  { label: 'Pending', content: () => SenderShipmentHistory() },
  { label: 'Cancelled', content: () => SenderShipmentHistory() },
];