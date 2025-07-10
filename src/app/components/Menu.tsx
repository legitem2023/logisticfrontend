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
import { Home, Package, LogIn, User , Bike, Settings, Hand, LogOut, HelpCircle } from "lucide-react";
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
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="in_progress"
            assignedDriver={()=>(<>Driver</>)}
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
      icon: (<HelpCircle color="green" />),
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
    {
      label: 'Logout',
      icon: (<LogOut color="green" />),
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
