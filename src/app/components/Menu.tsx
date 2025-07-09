'use client'

import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import SwiperTabs from "./SwiperTabs";
import DeliveryCard from "./DeliveryCard";
import VehicleSelector from "./VehicleSelector";
import dynamic from 'next/dynamic';
import HomeDataCarousel from './HomeDataCarousel';
import LoginCard from "./LoginCard";
import Image from 'next/image';
import { Home, Package, LogIn, User , Bike, Settings, Hand } from "lucide-react";
import Rider from "./Rider/Rider";
import HelpPage from "./HelpPage";
import SettingsPage from "./SettingsPage";

const AddressSearchMap = dynamic(() => import('./AddressSearchMap'), {
  ssr: false,
});

const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
});

type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actionLabel?: string;
};

export default function Menu() {
  const mockItems: CarouselItem[] = [
    {
      id: 'promo1',
      title: '₱50 off on your next delivery',
      subtitle: 'Use code: LALA50',
      imageUrl: '/Banner1.webp',
      actionLabel: 'Use Now',
    },
    {
      id: 'rec1',
      title: 'Recently Delivered: 📦',
      subtitle: 'Sent to Makati – 2 days ago',
      imageUrl: '/Banner1.webp',
    },
    {
      id: 'service1',
      title: 'Try Grocery – new service',
      subtitle: 'Order now and save ₱30',
      imageUrl: '/Banner1.webp',
      actionLabel: 'Order Now',
    },
  ];

  const progressitem = [
    {
      label: 'In Progress',
      content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="in_progress"
          >
            <DeliveryMap />
          </DeliveryCard>
        </div>
      )
    },
    {
      label: 'Completed',
      content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="completed"
          >
            <DeliveryMap />
          </DeliveryCard>
        </div>
      )
    },
    {
      label: 'Pending',
      content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="pending"
          >
            <DeliveryMap />
          </DeliveryCard>
        </div>
      )
    },
    {
      label: 'Cancelled',
      content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="cancelled"
          >
            <DeliveryMap />
          </DeliveryCard>
        </div>
      )
    },
  ];

  const tabItems = [
    {
      label: 'Account',
      icon: (<User color="gray" />),
      content: (
        <div>
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
      icon: (<Home color="green" />),
      content: (
        <div>
          <HomeDataCarousel items={mockItems} />
          <AddressSearchMap />
          <VehicleSelector />
        </div>
      ),
    },
    {
      label: 'Order',
      icon: (<Package color="green" />),
      content: (
        <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">
          <SwiperTabs tabs={progressitem} />
        </div>
      ),
    },
    {
      label: 'Rider',
      icon: (<Bike color="green" />),
      content: (
        <div>
          <Rider/>
        </div>
      ),
    },
    {
      label: 'Settings',
      icon: (<Settings color="green" />),
      content: (
        <div>
          <SettingsPage/>
        </div>
      ),
    },
    {
      label: 'Help Center',
      icon: (<Hand color="green" />),
      content: (
        <div>
          <HelpPage/>
        </div>
      ),
    },
    {
      label: 'Login',
      icon: (<LogIn color="green" />),
      content: (
        <div>
          <LoginCard/>
        </div>
      ),
    },


    
  ];

  return (
    <div className="h-[98vh]">
      <div className="h-[10vh] w-full flex items-center justify-center customgrad border-b-4 border-green-500">
        <Image src="/Logo.svg" className="h-[80%] w-auto" alt="Logo" width={100} height={100} />
      </div>
      <Sidebar tabs={tabItems} />
    </div>
  );
}
