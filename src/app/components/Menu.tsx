'use client'
import Sidebar from "./Sidebar";
import SwiperTabs from "./SwiperTabs";
import DeliveryCard from "./DeliveryCard";
import VehicleSelector from "./VehicleSelector";
import DeliveryFormCard from "./DeliveryFormCard";
import dynamic from 'next/dynamic';
import HomeDataCarousel from './HomeDataCarousel';



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
    imageUrl: 'https://images.unsplash.com/photo-1606813909327-d22fdf0f84f6?auto=format&fit=crop&w=800&q=80', // delivery promo image
    actionLabel: 'Use Now',
  },
  {
    id: 'rec1',
    title: 'Recently Delivered: 📦',
    subtitle: 'Sent to Makati – 2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1591016200450-78fc5f85a1e5?auto=format&fit=crop&w=800&q=80', // package delivery
  },
  {
    id: 'service1',
    title: 'Try Grocery – new service',
    subtitle: 'Order now and save ₱30',
    imageUrl: 'https://images.unsplash.com/photo-1586201375771-83865001e17b?auto=format&fit=crop&w=800&q=80', // groceries
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
      label: 'Home',
      content: (
        <div>
          <HomeDataCarousel items={mockItems} />
          <DeliveryFormCard />
          <VehicleSelector />
        </div>
      ),
    },
    {
      label: 'Map',
      content: (
        <div>
          <DeliveryMap />
        </div>
      ),
    },
    {
      label: 'Order',
      content: (
        <div>
          <SwiperTabs tabs={progressitem} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="customgrad h-[70px] w-full flex items-center justify-center">
        <img src="/Logo.svg" className="h-[80%] w-auto" />
      </div>
      <Sidebar tabs={tabItems} />
    </div>
  );
}
