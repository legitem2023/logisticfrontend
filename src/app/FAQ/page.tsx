'use client'
import LogisticsFAQPage from "../components/LogisticsFAQPage";
import { Home, Truck, Package, Settings } from 'lucide-react';
import SidebarLinks, { SidebarLink } from '../components/Partial/SidebarLinks';

import Image from 'next/image';
export default function page() {
 const links: SidebarLink[] = [
  { label: 'Dashboard', href: '/', icon: <Home size={18} /> },
  { label: 'Deliveries', href: '/deliveries', icon: <Truck size={18} /> },
  { label: 'Packages', href: '/packages', icon: <Package size={18} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
];

  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarLinks links={links} />  
      {/* Sidebar with tab content */}
      <LogisticsFAQPage/>
    </div>
  );
}
