'use client';
import React, { use, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useMutation, useSubscription } from '@apollo/client';
import { LOCATIONTRACKING } from '../../../graphql/mutation';
import { LocationTracking } from '../../../graphql/subscription';
import { decryptToken, capitalize } from '../../../utils/decryptToken';
import NotificationDropdown from './NotificationDropdown';
import { startBackgroundTracking } from './Tracker/startBackgroundTracking';
import Sidebar from './Sidebar'; 
import HomeDataCarousel from './HomeDataCarousel';
import LogisticsHomePage from './LogisticsHomePage';
import DriverDashboard from './Rider/DriverDashboard';
import SenderDashboard from './Sender/SenderDashboard';
import RiderActivityChart from './Administrator/RiderActivityChart';
import LogisticsForm from './Sender/LogisticsForm';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import { startWatchingLocation } from './ObtainLocation';
import { mockItems } from './json/mockItems';
import dynamic from 'next/dynamic';

const RiderList = dynamic(() => import('./Rider/RiderList'), {
  ssr: false
});


// Throttle function implementation
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T & { cancel: () => void } {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  let timeoutId: number | null = null;

  const throttled = function (this: any, ...args: Parameters<T>) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  } as T;

  (throttled as any).cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return throttled as T & { cancel: () => void };
}


import {
  Home,
  LogIn,
  UserPlus,
  Bike,
  Settings,
  ClipboardCheck,
  HelpCircle,
  Truck,
  BadgeCheck
} from "lucide-react";
import { useDispatch,useSelector } from 'react-redux';
import { setCurrentLocation } from '../../../Redux/locationSlice';
import { setTempUserId,selectTempUserId } from '../../../Redux/tempUserSlice';


import { setRole, clearRole, selectRole } from '../../../Redux/roleSlice';

import  AdminDeliveriesTable  from './Administrator/AdminDeliveriesTable';
import  VehicleTypes  from './Administrator/VehicleTypes';
import RiderPerformanceChart from './Rider/RiderPerformanceChart';


// Your entire code remains unchanged except for the fixed JSX in the 'Home' tab item

// ...[imports remain unchanged]

export default function Menu() {
 // const [useRole, setRole] = useState('');
  const client = useApolloClient();
  const dispatch = useDispatch();
  const globalUserId = useSelector(selectTempUserId);

  const useRole = useSelector(selectRole); 
  const [LocationTracker] = useMutation(LOCATIONTRACKING, {
    onCompleted: (data) => {
      console.log("Mutation Success:", data);
    },
    onError: (err) => {
      console.error("Mutation Error:", err.message);
    },
  });

  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
        //  setRole(payload.role);
          dispatch(setRole(payload.role));
          dispatch(setTempUserId(payload.userId));
        }
      } catch (err) {
        console.error('Error getting role:', err);
        setRole('');
      }
    };
    getRole();
  },[dispatch]);

  useEffect(() => {
    if (!globalUserId) return;

    const throttledUpdate = throttle((location) => {
      dispatch(setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      
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
            userID: globalUserId,
          },
        },
      }).catch((error) => {
        console.error('Location tracking failed:', error);
      });
    }, 10000);

    const stopWatching = startWatchingLocation(throttledUpdate);

    return () => {
      if (typeof stopWatching === 'function') {
        stopWatching();
      }
      throttledUpdate.cancel();
    };

    startBackgroundTracking(globalUserId,client);
  }, [globalUserId]);

  const { data: subscriptionData, error: subscriptionError } = useSubscription(LocationTracking,{
    variables: { userID: globalUserId },
  });

  const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };

  //console.log(useRole,"<-role");

  const tabItems = [
    {
      label: 'Home',
      role: '',
      icon: <Home color="green" />,
      content: !useRole || useRole === 'Sender' ? (
        <div className="px-1 py-1 space-y-1">
          <HomeDataCarousel items={mockItems} />
          <LogisticsHomePage />
        </div>
      ) : useRole === 'Rider' || useRole === 'RIDER' ? (
        <div className="px-1 py-1 space-y-1">
          <RiderPerformanceChart />
        </div>
      ):(
        <div className="px-1 py-1 space-y-1">
          <RiderActivityChart />
        </div>
      ),
    },
    ...(isUserActive()
      ? [
          {
            label: 'Logistics Panel',
            role: '',
            icon: <ClipboardCheck color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                {useRole==='Rider' || useRole==='RIDER'?(<DriverDashboard />):(<SenderDashboard />)}
              </div>
            ),
          },
        ]
      : []),
 ...(isUserActive() && (useRole === 'Sender' || useRole === 'SENDER')
  ? [
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
    ]
  : []),
        ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            label: 'Rider',
            role: '',
            icon: <Bike color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <RiderList/>
              </div>
            ),
          },
        ]
      : []),
              ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            label: 'Requested Deliveries',
            role: '',
            icon: <BadgeCheck color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <AdminDeliveriesTable />
              </div>
            ),
          },
        ]
      : []),
    ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            label: 'Vehicle Types',
            role: '',
            icon: <BadgeCheck color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <VehicleTypes />
              </div>
            ),
          },
        ]
      : []),
      ...(isUserActive()
      ? [
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
        ]
      : []),
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
      {/* Logo Header */}
      <div className="h-[75px] w-full flex items-center justify-center customgrad border-b-4 border-green-500 px-4">
        <Image
          src="/Motogo.svg"
          className="h-[90%] md:h-[90%] w-auto"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </div>
      <NotificationDropdown userId={globalUserId}/>
      {/* Sidebar with tab content */}
      <Sidebar tabs={tabItems.filter((tab) => tab.role === capitalize(useRole) || tab.role === '')} />
    </div>
  );
}
