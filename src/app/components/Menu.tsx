'use client'
import Sidebar from "./Sidebar";
//import AddressSearchMap from "./AddressSearchMap";
import ProfileCard from "./ProfileCard";
import SwiperTabs from "./SwiperTabs";
import DeliveryCard from "./DeliveryCard";
import VehicleSelector from "./VehicleSelector";
//import DeliveryFormCard from "./DeliveryFormCard";
import dynamic from 'next/dynamic';
import HomeDataCarousel from './HomeDataCarousel';
import LoginCard from "./LoginCard";
import Image from 'next/image';
import { Home, Map, Package, LogIn, User } from "lucide-react";

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
    imageUrl: '/Banner1.webp', // official Lalamove carousel banner
    actionLabel: 'Use Now',
  },
  {
    id: 'rec1',
    title: 'Recently Delivered: 📦',
    subtitle: 'Sent to Makati – 2 days ago',
    imageUrl: '/Banner1.webp', // official Lalamove carousel banner
  },
  {
    id: 'service1',
    title: 'Try Grocery – new service',
    subtitle: 'Order now and save ₱30',
    imageUrl: '/Banner1.webp', // official Lalamove carousel banner
    actionLabel: 'Order Now',
  },
];
  
  const progressitem = [
    { label: 'In Progress', content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="in_progress"
          />
        </div>
      )
    },
    { label: 'Completed', content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="completed"
          />
        </div>
      )
    },
    { label: 'Pending', content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="pending"
          />
        </div>
      )
    },
    { label: 'Cancelled', content: (
        <div>
          <DeliveryCard
            pickup="SM North EDSA, Quezon City"
            dropoff="Bonifacio Global City, Taguig"
            status="cancelled"
          />
        </div>
      )
    },
  ];

  const tabItems = [
    {
      label: 'Account',
      icon:(<User color="gray"/>),
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
    },{
      label: 'Home',
      icon:(<Home color="green"/>),
      content: (
        <div>
          <HomeDataCarousel items={mockItems} />
          <AddressSearchMap/>
          
          <VehicleSelector />
        </div>
      ),
    },
    {
      label: 'Map',
      icon:(<Map color="green"/>),
      content: (
        <div>
          <DeliveryMap />
        </div>
      ),
    },
    {
      label: 'Order',
      icon:(<Package color="green"/>),
      content: (
        <div>
          <SwiperTabs tabs={progressitem} />
        </div>
      ),
    },
    {
      label: 'Login',
      icon:(<LogIn color="green"/>),
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
        <Image src="/Logo.svg" className="h-[80%] w-auto" alt="1"/>
      </div>
      <Sidebar tabs={tabItems} />
    </div>
  );
}
