'use client';
import { useEffect } from 'react';
import InstallPWAButton from './InstallPWAButton';
import Cookies from 'js-cookie';
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import SwiperTabs from "./SwiperTabs";
import DeliveryCard from "./DeliveryCard";
import dynamic from 'next/dynamic';
import HomeDataCarousel from './HomeDataCarousel';
import LoginCard from "./LoginCard";
import SignupCard from "./SignupCard";
import Image from 'next/image';
import { startTrackingLocation } from './ObtainLocation';
import {
  Home,
  Package,
  LogIn,
  User,
  Bike,
  Settings,
  LogOut,
  HelpCircle,
  UserPlus
} from "lucide-react";

import Rider from "./Rider/Rider";
import HelpPage from "./HelpPage";
import SettingsPage from "./SettingsPage";
import LogisticsForm from "./LogisticsForm";

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actionLabel?: string;
};

export default function Menu() {
  const isUserActive = (): boolean => {
    const token = Cookies.get("token");
    return !!token;
  };
startTrackingLocation(5);
useEffect(() => {
  if (window.location.hash === '#_=_') {
    if (history.replaceState) {
      history.replaceState(null, null, window.location.href.split('#')[0]);
    } else {
      window.location.hash = '';
    }
  }
}, []);
  const mockItems: CarouselItem[] = [
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

  const progressitem = [
    {
      label: 'In Progress',
      content: (
        <DeliveryCard
          pickup="SM North EDSA, Quezon City"
          dropoff="Bonifacio Global City, Taguig"
          status="in_progress"
          assignedDriver={<Rider />}
        >
          <DeliveryMap />
        </DeliveryCard>
      ),
    },
    {
      label: 'Completed',
      content: (
        <DeliveryCard
          pickup="SM North EDSA, Quezon City"
          dropoff="Bonifacio Global City, Taguig"
          status="completed"
        >
          <DeliveryMap />
        </DeliveryCard>
      ),
    },
    {
      label: 'Pending',
      content: (
        <DeliveryCard
          pickup="SM North EDSA, Quezon City"
          dropoff="Bonifacio Global City, Taguig"
          status="pending"
        >
          <DeliveryMap />
        </DeliveryCard>
      ),
    },
    {
      label: 'Cancelled',
      content: (
        <DeliveryCard
          pickup="SM North EDSA, Quezon City"
          dropoff="Bonifacio Global City, Taguig"
          status="cancelled"
        >
          <DeliveryMap />
        </DeliveryCard>
      ),
    },
  ];

  const tabItems = [
    {
      label: 'Account',
      role: '',
      icon: <User color="gray" />,
      content: (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <ProfileCard
            name="Juan Dela Cruz"
            email="juan@example.com"
            contactNumber="+63 912 345 6789"
            address="123 Mabini Street, Quezon City, PH"
            avatarUrl="https://i.pravatar.cc/100?img=12"
          />
        </div>
      ),
    },
    {
      label: 'Home',
      role: '',
      icon: <Home color="green" />,
      content: (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 space-y-6">
          <HomeDataCarousel items={mockItems} />
          <LogisticsForm />
        </div>
      ),
    },
    {
      label: 'Order',
      role: '',
      icon: <Package color="green" />,
      content: (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
            <SwiperTabs tabs={progressitem} />
          </div>
        </div>
      ),
    },
    {
      label: 'Rider',
      role: '',
      icon: <Bike color="green" />,
      content: (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <Rider />
        </div>
      ),
    },
    {
      label: 'Settings',
      role: '',
      icon: <Settings color="green" />,
      content: (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <SettingsPage />
        </div>
      ),
    },
    {
      label: 'Help Center',
      role: '',
      icon: <HelpCircle color="green" />,
      content: (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <HelpPage />
        </div>
      ),
    },
    ...(!isUserActive()
      ? [
          {
            label: 'Signup',
            role: '',
            icon: <UserPlus color="green" />,
            content: (
              <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
                <SignupCard />
              </div>
            ),
          },
        ]
      : []),
    {
      label: isUserActive() ? 'Logout' : 'Login',
      role: '',
      icon: isUserActive() ? <LogOut color="green" /> : <LogIn color="green" />,
      content: isUserActive() ? (
        <div className="p-6 text-center text-green-700 font-semibold">
          You are already logged in.
        </div>
      ) : (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
          <LoginCard />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <InstallPWAButton />

      {/* Logo Header */}
      <div className="h-[10vh] w-full flex items-center justify-center customgrad border-b-4 border-green-500 px-4">
        <Image
          src="/Logo.svg"
          className="h-[60%] md:h-[80%] w-auto"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </div>

      {/* Sidebar with tab content */}
      <Sidebar tabs={tabItems}/>
    </div>
  );
}
