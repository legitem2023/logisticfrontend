'use client';
import Image from 'next/image';
import PrivacyPolicy from "../components/PrivacyPolicy";
import { Home, Truck, Package, Settings } from 'lucide-react';
import SidebarLinks, { SidebarLink } from '../components/Partial/SidebarLinks';

export default function Page() {
 const links: SidebarLink[] = [
  { label: 'Home', href: '/', icon: <Home size={18} /> },
  { label: 'Contact', href: '/Contact', icon: <Truck size={18} /> },
  { label: 'Privacy', href: '/Privacy', icon: <Package size={18} /> },
  { label: 'FAQ', href: '/FAQ', icon: <Settings size={18} /> },
];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarLinks links={links} />       
      {/* Sidebar with tab content */}
      <PrivacyPolicy />
    </div>
  );
}
