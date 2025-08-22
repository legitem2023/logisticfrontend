'use client';
import React, { use, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import ApiWallet from './Wallet/ApiWallet';

import { useMutation, useSubscription } from '@apollo/client';
import { LOCATIONTRACKING } from '../../../graphql/mutation';
import { LocationTracking } from '../../../graphql/subscription';
import { decryptToken, capitalize } from '../../../utils/decryptToken';
import NotificationDropdown from './NotificationDropdown';
// import { startBackgroundTracking } from './Tracker/startBackgroundTracking';
import Sidebar from './Sidebar'; 
import Navigation from './Navigation';
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
import {
  Home,
  LogIn,
  UserPlus,
  Bike,
  Settings,
  ClipboardCheck,
  HelpCircle,
  Truck,
  BadgeCheck,
  WalletMinimal,ChartBar,ChartBarIcon
} from "lucide-react";
import { useDispatch,useSelector } from 'react-redux';
import { setCurrentLocation } from '../../../Redux/locationSlice';
import { setTempUserId,selectTempUserId } from '../../../Redux/tempUserSlice';
import { setUsername } from '../../../Redux/usernameSlice';

import { setRole, clearRole, selectRole } from '../../../Redux/roleSlice';

import  AdminDeliveriesTable  from './Administrator/AdminDeliveriesTable';
import  VehicleTypes  from './Administrator/VehicleTypes';
import RiderPerformanceChart from './Rider/RiderPerformanceChart';
import  {SideBarMenu}  from './SideBarMenu';
import { ActiveContentDisplay } from './ActiveContentDisplay';
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
          dispatch(setUsername(payload.name));
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

    // startBackgroundTracking(globalUserId,client);
  }, [globalUserId]);

  const { data: subscriptionData, error: subscriptionError } = useSubscription(LocationTracking,{
    variables: { userID: globalUserId },
  });

  const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };

  //console.log(useRole,"<-role");


  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/*  <SideBarMenu       
      activeTab={GlobalactiveIndex} 
      useRole={useRole}
      isUserActive={isUserActive}/>*/}
<Navigation
      userRole={useRole}
      isUserActive={isUserActive}/>
    <main className="p-0">
      <ActiveContentDisplay 
        activeTab={GlobalactiveIndex} 
        useRole={useRole} 
        isUserActive={isUserActive} 
      />
    </main>
    </div>
  );
}
