'use client';

import { Menu, X, Truck, User, Users, Bell, Home as HomeIcon, ClipboardCheck, Bike, BadgeCheck, Settings, HelpCircle, UserPlus, LogIn, ChartBar as ChartBarIcon, WalletMinimal } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import { useSelector, useDispatch } from "react-redux";
import { setActiveIndex } from '../../../Redux/activeIndexSlice';
import { selectTempUserId } from "../../../Redux/tempUserSlice";
import Image from "next/image";

export function SideBarMenu({ activeTab, useRole, isUserActive }: {
  activeTab: number;
  useRole: string;
  isUserActive: () => boolean;
}) {
  const dispatch = useDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const globalUserId = useSelector(selectTempUserId);
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);

  useEffect(() => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [GlobalactiveIndex]);

  const tabItems = [
    {
      id:0,
      label: 'Home',
      role: '',
      icon: <HomeIcon color="green" />
    },
    {
      id:1,
      label: 'Chart',
      role: '',
      icon: <ChartBarIcon color="green" />
    },
    ...(isUserActive()
      ? [
          {
            id:3,
            label: 'Logistics Panel',
            role: '',
            icon: <ClipboardCheck color="green" />
          },
        ]
      : []),
    ...(isUserActive() && (useRole === 'Sender' || useRole === 'SENDER')
      ? [
          {
            id:4,
            label: 'Create Delivery',
            role: 'Sender',
            icon: <Truck color="green" />
          },
        ]
      : []),
    ...(isUserActive() && (useRole === 'Sender' || useRole === 'SENDER')
      ? [
          {
            id:5,
            label: 'Wallet',
            role: 'Sender',
            icon: <WalletMinimal color="green" />
          },
        ]
      : []),
    ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            id:6,
            label: 'Accounts',
            role: '',
            icon: <Users color="green" />
          },
        ]
      : []),
    ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            id:7,
            label: 'Unassigned',
            role: '',
            icon: <BadgeCheck color="green" />
          },
        ]
      : []),
    ...(isUserActive() && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')
      ? [
          {
            id:8,
            label: 'Vehicle Types',
            role: '',
            icon: <Truck color="green" />
          },
        ]
      : []),
    ...(isUserActive()
      ? [
          {
            id:9,
            label: 'Settings',
            role: '',
            icon: <Settings color="green" />
          },
        ]
      : []),
    {
      id:10,
      label: 'Help Center',
      role: '',
      icon: <HelpCircle color="green" />
    },
    ...(!isUserActive()
      ? [
          {
            id:11,
            label: 'Signup',
            role: '',
            icon: <UserPlus color="green" />
          },
        ]
      : []),
    ...(!isUserActive()
      ? [
          {
            id:12,
            label: 'Login',
            role: '',
            icon: <LogIn color="green" />
          },
        ]
      : []),
  ];

  const visibleTabs = tabItems.filter(tab => {
    if (!tab.role) return true;
    if (tab.role === 'Sender' && (useRole === 'Sender' || useRole === 'SENDER')) return true;
    if (tab.role === 'Administrator' && (useRole === 'Administrator' || useRole === 'ADMINISTRATOR')) return true;
    return false;
  });

  return (
    <>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Bar */}
      <header className="customgrad shadow-2xl sticky top-0 z-30 border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative h-15 w-15 transition-transform duration-300 group-hover:rotate-6">
                  <Image
                    src="/Motogo.svg"
                    alt="MotoGo Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Now shown on lg screens and up */}
            <nav className="hidden lg:flex items-center space-x-1">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setActiveIndex(tab.id))}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    activeTab === tab.id
                      ? 'bg-white/10 backdrop-blur-md text-white shadow-inner'
                      : 'text-blue-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right Side Items */}
            <div className="flex items-center space-x-4">
              {isUserActive() && (
                <div className="relative">
                  <NotificationDropdown userId={globalUserId} />
                </div>
              )}

              {/* Mobile Menu Button - Shown on screens smaller than lg */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 z-70 rounded-xl backdrop-blur bg-white/40 border border-gray-200 shadow-lg hover:bg-white/60 transition"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Shown on screens smaller than lg */}
        <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white/70 backdrop-blur-md shadow-xl z-60 rounded-tr-2xl rounded-br-2xl transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Profile Section at the top of mobile menu */}
          {isUserActive() && (
            <div className="px-4 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <User className="h-6 w-6 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {useRole || 'User'}
                  </p>
                  <span 
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => dispatch(setActiveIndex(13))}
                  >
                    View Profile
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
            {visibleTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  dispatch(setActiveIndex(tab.id));
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'customgrad text-white shadow-md'
                    : 'text-gray-500 hover:bg-blue-700/20 hover:text-white'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
      }
