'use client';
import Image from 'next/image';
import SidebarLinks, { SidebarLink } from '../components/Partial/SidebarLinks';
import LogisticContactFormPage from "../components/LogisticContactFormPage";
import { Menu, X, Truck,Phone,Shield, ChevronDown,History,MapPin, User, Users, Bell, Home as HomeIcon, ClipboardCheck, Bike, BadgeCheck, Settings, HelpCircle, UserPlus, LogIn, ChartBar as ChartBarIcon, WalletMinimal } from "lucide-react";
export default function Page() {
 const sidebarLinks: SidebarLink[] = [
    { id: 100, label: 'Home', href: '/', icon: <HomeIcon color="green" size={18} /> },
    { id: 101, label: 'Contact', href: '/Contact', icon: <Phone color="green" size={18} /> },
    { id: 102, label: 'Privacy', href: '/Privacy', icon: <Shield color="green" size={18} /> },
    { id: 103, label: 'FAQ', href: '/FAQ', icon: <HelpCircle color="green" size={18} /> },
    { 
      label: 'Account', 
      href: '#', 
      icon: <User color="green" size={18}/>,
      children: [
        { id: 1, label: 'Chart', href: '#', icon: <ClipboardCheck color="green" size={16} /> },
        { id: 3, label: 'Logistics Panel', href: '#', icon: <ClipboardCheck color="green" size={16} /> },
        { id: 4, label: 'Create Delivery', href: '#', icon: <Truck color="green" size={16} /> },
        { id: 7, label: 'Unassigned', href: '#', icon: <BadgeCheck color="green" size={16} /> },
        { id: 8, label: 'Vehicle', href: '#', icon: <Truck color="green" size={16} /> },
        { id: 11, label: 'Sign Up', href: '#', icon: <UserPlus color="green" size={16} /> },
        { id: 12, label: 'Login', href: '#', icon: <LogIn color="green" size={16} /> }
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarLinks links={links} />       
      {/* Sidebar with tab content */}
      <LogisticContactFormPage />
    </div>
  );
}
