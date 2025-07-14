'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMutation, useSubscription } from '@apollo/client';
import { LOCATIONTRACKING } from '../../../graphql/mutation';
import { LocationTracking } from '../../../graphql/subscription';
import { decryptToken, capitalize } from '../../../utils/decryptToken';

import InstallPWAButton from './InstallPWAButton';
import Sidebar from './Sidebar';
import HomeDataCarousel from './HomeDataCarousel';
import LogisticsHomePage from './LogisticsHomePage';
import DriverDashboard from './Rider/DriverDashboard';
import SenderDashboard from './Sender/SenderDashboard';
import ReceiverView from './Receiver/ReceiverView';
import RiderView from './Rider/RiderView';
import SenderShipmentHistory from './Sender/SenderShipmentHistory';
import LogisticsForm from './Sender/LogisticsForm';
import Rider from './Rider/Rider';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import SwiperTabs from './SwiperTabs';
import { startWatchingLocation } from './ObtainLocation';

import {
  Home,
  Package,
  LogIn,
  UserPlus,
  Bike,
  PackageCheck,
  LayoutDashboard,
  Settings,
  ClipboardCheck,
  HelpCircle,
  Truck,
  Navigation
} from "lucide-react";

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actionLabel?: string;
};

export default function Menu() {
  const [useRole, setRole] = useState('');
  const [useID, setID] = useState('');

  const [LocationTracker] = useMutation(LOCATIONTRACKING, {
    onCompleted: (data) => {
      console.log("Mutation Success:", data);
    },
    onError: (err) => {
      console.error("Mutation Error:", err.message);
    },
  });

  const { data: subscriptionData, error: subscriptionError } = useSubscription(LocationTracking);

  useEffect(() => {
    if (subscriptionData) {
      console.log("Subscription Data:", subscriptionData);
    }
    if (subscriptionError) {
      console.error("Subscription Error:", subscriptionError.message);
    }
  }, [subscriptionData, subscriptionError]);

  useEffect(() => {
    if (useID) {
      console.log("Starting location watch with ID:", useID);
      const stopWatching = startWatchingLocation((location) => {
        console.log("Got location:", location);
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
              userID: useID,
            },
          },
        });
      });

      return () => stopWatching && stopWatching(); // Cleanup
    }
  }, [useID]);

  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setRole(payload.role);
          setID(payload.userID);
        }
      } catch (err) {
        console.error('Error getting role:', err);
        setRole('');
      }
    };

    getRole();
  }, []);

  const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };

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
    { label: 'In Progress', content: <SenderShipmentHistory /> },
    { label: 'Completed', content: <SenderShipmentHistory /> },
    { label: 'Pending', content: <SenderShipmentHistory /> },
    { label: 'Cancelled', content: <SenderShipmentHistory /> },
  ];

  const tabItems = [
    {
      label: 'Home',
      role: '',
      icon: <Home color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <HomeDataCarousel items={mockItems} />
          <LogisticsHomePage />
        </div>
      ),
    },
    {
      label: 'Assigned Deliveries',
      role: 'Rider',
      icon: <ClipboardCheck color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <DriverDashboard />
        </div>
      ),
    },
    {
      label: 'Live Map',
      role: 'Receiver',
      icon: <PackageCheck color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <ReceiverView />
        </div>
      ),
    },
    {
      label: 'Live Map',
      role: 'Rider',
      icon: <Navigation color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <RiderView />
        </div>
      ),
    },
    {
      label: 'SenderDashboard',
      role: 'Sender',
      icon: <LayoutDashboard color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <SenderDashboard />
        </div>
      ),
    },
    {
      label: 'Create Delivery',
      role: 'Sender',
      icon: <Truck color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <LogisticsForm />
        </div>
      ),
    },
    {
      label: 'Shipment',
      role: '',
      icon: <Package color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <SwiperTabs tabs={progressitem} />
        </div>
      ),
    },
    {
      label: 'Rider',
      role: 'Sender',
      icon: <Bike color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <Rider />
        </div>
      ),
    },
    {
      label: 'Settings',
      role: '',
      icon: <Settings color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <SettingsPage />
        </div>
      ),
    },
    {
      label: 'Help Center',
      role: '',
      icon: <HelpCircle color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
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
              <div className="px-1 py-1 space-y-1">
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
              <div className="px-1 py-1 space-y-1">
                <LoginCard />
              </div>
            ),
          },
        ]
      : []),
  ];

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
      <Sidebar tabs={tabItems.filter((tab) => tab.role === capitalize(useRole) || tab.role === '')} />
    </div>
  );
}
