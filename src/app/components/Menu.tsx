'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useMutation, useSubscription } from '@apollo/client';
import { LOCATIONTRACKING } from '../../../graphql/mutation';
import { LocationTracking } from '../../../graphql/subscription';
import { decryptToken, capitalize } from '../../../utils/decryptToken';
import NotificationDropdown from './NotificationDropdown';
import InstallPWAButton from './InstallPWAButton';
import Sidebar from './Sidebar';
import HomeDataCarousel from './HomeDataCarousel';
import LogisticsHomePage from './LogisticsHomePage';
import DriverDashboard from './Rider/DriverDashboard';
import SenderDashboard from './Sender/SenderDashboard';
import ReceiverView from './Receiver/ReceiverView';
import RiderView from './Rider/RiderView';
// import RiderList from './Rider/RiderList';
import SenderShipmentHistory from './SenderShipmentHistory';
import LogisticsForm from './Sender/LogisticsForm';
import Rider from './Rider/Rider';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import SwiperTabs from './SwiperTabs';
import { startWatchingLocation } from './ObtainLocation';
import { mockItems } from './json/mockItems';
import dynamic from 'next/dynamic';

const RiderList = dynamic(() => import('./Rider/RiderList'), {
  ssr: false
});
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


export default function Menu() {
  const [useRole, setRole] = useState('');
  const [useID, setID] = useState('');

  const [LocationTracker] = useMutation(LOCATIONTRACKING, {
    onCompleted: (data) => {
      // console.log("Mutation Success:", data);
    },
    onError: (err) => {
      console.error("Mutation Error:", err.message);
    },
  });

  const { data: subscriptionData, error: subscriptionError } = useSubscription(LocationTracking,{
      variables: { userID: useID },// optional filter
    });


  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setRole(payload.role);
          setID(payload.userId);
        }
      } catch (err) {
        console.error('Error getting role:', err);
        setRole('');
      }
    };
    getRole();
  });


  useEffect(() => {
    if (useID) {
      const stopWatching = startWatchingLocation((location) => {
        LocationTracker({
          variables: {
            input: {
              accuracy: location.accuracy,
              batteryLevel: null,
              heading: location.heading,
              latitude: location.latitude,
              longitude: location.longitude,
              speed: location.speed,
              timestamp: location.timestamp.toString(),
              userID: useID,
            },
          },
        });
      });

      return () => stopWatching && stopWatching(); // Cleanup
    }
  });


// console.log(subscriptionData)
  const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };
  
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
      role: '',
      icon: <ClipboardCheck color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          {useRole==='Rider' || useRole==='RIDER'?(<DriverDashboard />):(<SenderDashboard />)}
        </div>
      ),
    },
    {
      label: 'Create Delivery',
      role: '',
      icon: <Truck color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <LogisticsForm />
        </div>
      ),
    },
    {
      label: 'Rider',
      role: '',
      icon: <Bike color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <RiderList
  riders={[
    {
      id: "1",
      name: "Juan Dela Cruz",
      phone: "09171234567",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      location: { latitude: 14.5995, longitude: 120.9842 },
    },
    {
      id: "2",
      name: "Maria Santos",
      phone: "09181112222",
      location: { latitude: 14.676, longitude: 121.0437 },
    },
  ]}
/>
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
      <div className="h-[75px] w-full flex items-center justify-center customgrad border-b-4 border-green-500 px-4">
        <Image
          src="/Logo.svg"
          className="h-[60%] md:h-[80%] w-auto"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
        
       </div>
     <NotificationDropdown userId={useID}/>
      {/* Sidebar with tab content */}
      <Sidebar tabs={tabItems.filter((tab) => tab.role === capitalize(useRole) || tab.role === '')} />
    </div>
  );
}
