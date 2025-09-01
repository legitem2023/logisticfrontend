// Add this component where you want to display the active content
'use client';
import React,{useEffect} from 'react';

import ApiWallet from './Wallet/ApiWallet';
import HomeDataCarousel from './HomeDataCarousel';
import Transactions from './Transactions';
import LogisticsHomePage from './LogisticsHomePage';
import DriverDashboard from './Rider/DriverDashboard';
import SenderDashboard from './Sender/SenderDashboard';
import RiderActivityChart from './Administrator/RiderActivityChart';

import Accounts from './Administrator/Accounts';
import Profile from './Profile';
import LogisticsForm from './Sender/LogisticsForm';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import LoginCard from './LoginCard';
import DeliveryTracker from './DeliveryTracker';
import SignupRoleSelector from './SignupRoleSelector';
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
  Users,
  Compass,
  WalletMinimal,ChartBar,ChartBarIcon,
  HomeIcon
} from "lucide-react";
import { useDispatch,useSelector } from 'react-redux';
import { setCurrentLocation } from '../../../Redux/locationSlice';
import { setTempUserId,selectTempUserId } from '../../../Redux/tempUserSlice';


import { setRole, clearRole, selectRole } from '../../../Redux/roleSlice';

import  AdminDeliveriesTable  from './Administrator/AdminDeliveriesTable';
import  VehicleTypes  from './Administrator/VehicleTypes';
import RiderPerformanceChart from './Rider/RiderPerformanceChart';
import  {SideBarMenu}  from './SideBarMenu';
const RiderList = dynamic(() => import('./Rider/RiderList'), {
  ssr: false
});


export function ActiveContentDisplay({ activeTab, useRole, isUserActive }: {
  activeTab: number;
  useRole: string;
  isUserActive:()=>boolean;
}) {
    console.log(useRole,"<<<<");

useEffect(() => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);



  
  const tabItems = [
    {
      id:0,
      label: 'Home',
      role: '',
      icon: <Home color="green" />,
      content: (
        <div className="px-1 py-1 space-y-1">
          <DeliveryTracker/>
        </div>
      )
    },
        {
      id:1,
      label: 'Chart',
      role: '',
      icon: <ChartBarIcon color="green" />,
      content: useRole === 'Rider' || useRole === 'RIDER' ? (
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
            id:3,
            label: 'Logistics Panel',
            role: '',
            icon: <ClipboardCheck color="green" />,
            content:useRole==='Administrator'||useRole==='ADMINISTRATOR'?(
                  <div className="px-1 py-1 space-y-1">
                    <Transactions/>
                  </div>):
              useRole === 'Rider' || useRole === 'RIDER' ? (
                    <div className="px-1 py-1 space-y-1">
                    <DriverDashboard />
                    </div>
                ):(
                    <div className="px-1 py-1 space-y-1">
                    <SenderDashboard />
                    </div>
                )
          },
        ]
      : []),
 ...(isUserActive() && (useRole === 'Sender' || useRole === 'SENDER')
  ? [
      {
        id:4,
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
     ...(isUserActive() && (useRole === 'Sender' || useRole === 'SENDER')
  ? [
      {
        id:5,
        label: 'Wallet',
        role: 'Sender',
        icon: <WalletMinimal color="green" />,
        content: (
          <div className="px-1 py-1 space-y-1">
            <ApiWallet/>
          </div>
        ),
      },
    ]
  : []),
        ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            id:6,
            label: 'Users',
            role: '',
            icon: <Users color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <Accounts/>
              </div>
            ),
          },
        ]
      : []),
      ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            id:7,
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
            id:8,
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
            id:9,
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
      id:10,
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
            id:11,
            label: 'Signup',
            role: '',
            icon: <UserPlus color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <SignupRoleSelector />
              </div>
            ),
          },
        ]
      : []),
    ...(!isUserActive()
      ? [
          {
            id:12,
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
    ...(isUserActive()
      ? [
          {
            id:13,
            label: '',
            role: '',
            icon: <LogIn color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <Profile/>
              </div>
            ),
          },
        ]
      : []),
        ...(!isUserActive()
      ? [
          {
            id:14,
            label: '',
            role: '',
            icon: <Compass color="green" />,
            content: (
              <div className="px-1 py-1 space-y-1">
                <DeliveryTracker/>
              </div>
            ),
          },
        ]
      : []),
  ];


  const activeTabData = tabItems.find(tab => tab.id === activeTab);

  return (
    <div className="flex-1 overflow-y-auto">
      {activeTabData ? (
        activeTabData.content
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Select a tab to view content</p>
        </div>
      )}
    </div>
  );
}
