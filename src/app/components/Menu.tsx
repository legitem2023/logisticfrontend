'use client';
import { use, useEffect, useState } from 'react';
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
import DriverDashboard from "./Rider/DriverDashboard";
import SenderDashboard from "./Sender/SenderDashboard";
import ReceiverView from "./Receiver/ReceiverView";
import RiderView from "./Rider/RiderView";
import Image from 'next/image';
import { startWatchingLocation } from './ObtainLocation';
import LogisticsHomePage from './LogisticsHomePage';
import {
  Home,
  Package,
  LogIn,
  User,
  Bike,
  PackageCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  ClipboardCheck,
  HelpCircle,
  UserPlus,
  Truck,
  Navigation
} from "lucide-react";

import Rider from "./Rider/Rider";
import HelpPage from "./HelpPage";
import SettingsPage from "./SettingsPage";
import LogisticsForm from "./Sender/LogisticsForm";
import { capitalize, decryptToken } from '../../../utils/decryptToken';
import { useMutation, useSubscription } from '@apollo/client';
import { LocationTracking } from '../../../graphql/subscription';
import { LOCATIONTRACKING } from '../../../graphql/mutation';
import Loading from './ui/Loading';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actionLabel?: string;
};

export default function Menu() {
  const [useRole,setRole] = useState();
  const [useID,setID] = useState();
  const [LocationTracker] = useMutation(LOCATIONTRACKING, {
    onCompleted: (data) => {
      console.log(data,"HowsData?");
    },
  });
  const {data, loading, error} = useSubscription(LocationTracking);

useEffect(() => {
  if (useID) {
    const stopWatching = startWatchingLocation((location) => {
      LocationTracker({
        variables: {
          input: {
            accuracy: location.accuracy,
            batteryLevel: location.batteryLevel,
            heading: location.heading,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            timestamp: location.timestamp,
            userID: useID
          }
        }
      });
    });

    return () => stopWatching && stopWatching(); // cleanup
  }
}, [useID]);



  const isUserActive = (): boolean => {
    const token = Cookies.get("token");
    return !!token;
  };
// startWatchingLocation();

  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string; // expose in env as NEXT_PUBLIC_*

        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setRole(payload.role);
          setID(payload.id);
        }
      } catch (err) {
        console.error('Error getting role:', err);
        setRole(null); // fallback
      }
    };

    getRole();
  }, []);

console.log(useID,"<<");
 

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
      label: 'Home',
      role: '',
      icon: <Home color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <HomeDataCarousel items={mockItems} />
          <LogisticsHomePage/>
        </div>
      ),
    },
    {
      label:'Assigned Deliveries',
      role: 'Rider',
      icon: <ClipboardCheck color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <DriverDashboard/>
        </div>
      ),
    },
    {
      label:'Receiver View',
      role: 'Receiver',
      icon: <PackageCheck color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <ReceiverView/>
        </div>
      ),
    },
    {
      label:'RiderView View',
      role: 'Rider',
      icon: <Navigation color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <RiderView/>
        </div>
      ),
    },


    
    {
      label:'SenderDashboard',
      role: 'Sender',
      icon: <LayoutDashboard color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <SenderDashboard/>
        </div>
      ),
    },
    {
      label: 'Create Delivery',
      role: 'Sender',
      icon: <Truck color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <LogisticsForm />
        </div>
      ),
    },
    {
      label: 'Order',
      role: 'Sender',
      icon: <Package color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
            <SwiperTabs tabs={progressitem} />
          </div>
        </div>
      ),
    },
    {
      label: 'Rider',
      role: 'Sender',
      icon: <Bike color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <Rider />
        </div>
      ),
    },
    {
      label: 'Settings',
      role: '',
      icon: <Settings color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
          <SettingsPage />
        </div>
      ),
    },
    {
      label: 'Help Center',
      role: '',
      icon: <HelpCircle color="green" />,
      content: (
        <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
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
              <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
                <SignupCard />
              </div>
            ),
          },
        ]
      : []),

    ...(!isUserActive()
      ? [
          {
            label: 'Login',
            role: '',
            icon: <LogIn color="green" />,
            content: (
              <div className="px-1 sm:px-1 md:px-1 lg:px-1 py-1 space-y-1">
                <LoginCard />
              </div>
            ),
          },
        ]
      : [])
  ];
  // if(loading) return <Loading lines={4} />
  // if(error) return <div>Error: {error.message}</div>
  console.log(data,"<---")
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <InstallPWAButton />

      {/* Logo Header */}
      <div className="h-[80px] w-full flex items-center justify-center customgrad border-b-4 border-green-500 px-4">
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
      <Sidebar tabs={tabItems.filter((tab) => tab.role === capitalize(useRole) || tab.role === '') }/>
    </div>
  );
}
