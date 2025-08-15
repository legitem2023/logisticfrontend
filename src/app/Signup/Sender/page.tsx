'use client';
import Image from 'next/image';
import SenderSignupForm from "../../components/SenderSignupForm";
import SidebarLinks, { SidebarLink } from '../../components/Partial/SidebarLinks';
import { Home, Shield, Phone, HelpCircle } from 'lucide-react';
export default function Page() {
 const links: SidebarLink[] = [
  { label: 'Home', href: '/', icon: <Home size={18} /> },
  { label: 'Contact', href: '/Contact', icon: <Phone size={18} /> },
  { label: 'Privacy', href: '/Privacy', icon: <Shield size={18} /> },
  { label: 'FAQ', href: '/FAQ', icon: <HelpCircle size={18} /> },
];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarLinks links={links} />      
      {/* Sidebar with tab content */}
      <SenderSignupForm />
    </div>
  );
}
