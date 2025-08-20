'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import { Menu, X, Home, Phone, Shield, HelpCircle, ChevronDown, User, History, Settings, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import NotificationDropdown from '../NotificationDropdown';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';

export type SidebarLink = {
  label: string;
  href: string;
  icon?: ReactNode;
  children?: SidebarLink[];
};

type SidebarLinksProps = {
  links: SidebarLink[];
  gradientClass?: string;
};

export default function ResponsiveNavigation({
  links,
  gradientClass = 'customgrad',
}: SidebarLinksProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const globalUserId = useSelector(selectTempUserId);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleItem = (label: string) => {
    setOpenItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  if (!links.length) return null;

  // Define links with children for the Rider item
  const sidebarLinks: SidebarLink[] = [
    { label: 'Home', href: '/', icon: <Home size={18} /> },
    { label: 'Contact', href: '/Contact', icon: <Phone size={18} /> },
    { label: 'Privacy', href: '/Privacy', icon: <Shield size={18} /> },
    { label: 'FAQ', href: '/FAQ', icon: <HelpCircle size={18} /> },
    { 
      label: 'Rider', 
      href: '#', 
      icon: <HelpCircle size={18} />,
      children: [
        { label: 'Rider Profile', href: '/rider/profile', icon: <User size={16} /> },
        { label: 'Rider History', href: '/rider/history', icon: <History size={16} /> },
        { label: 'Rider Settings', href: '/rider/settings', icon: <Settings size={16} /> },
        { label: 'Rider Locations', href: '/rider/locations', icon: <MapPin size={16} /> },
      ]
    },
  ];

  const renderMobileLink = (link: SidebarLink, depth = 0) => {
    const hasChildren = link.children && link.children.length > 0;
    const isActive = pathname === link.href;
    const isOpen = openItems[link.label];

    return (
      <div key={link.label} className="relative">
        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
            isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
          } ${depth > 0 ? 'pl-8' : ''}`}
        >
          <Link
            href={link.href}
            className="flex items-center flex-grow"
            onClick={() => {
              if (!hasChildren) setMobileMenuOpen(false);
              else toggleItem(link.label);
            }}
          >
            {link.icon && <span className="mr-3">{link.icon}</span>}
            <span>{link.label}</span>
          </Link>
          
          {hasChildren && (
            <button
              onClick={() => toggleItem(link.label)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              aria-expanded={isOpen}
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="ml-4 border-l-2 border-gray-200 pl-2 mt-1">
            {link.children?.map(child => renderMobileLink(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderDesktopLink = (link: SidebarLink) => {
    const hasChildren = link.children && link.children.length > 0;
    const isActive = pathname === link.href;
    const isOpen = openItems[link.label];

    return (
      <div key={link.label} className="relative group">
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-blue-100 text-blue-800' : 'text-white hover:bg-blue-800/50'
          }`}
        >
          <Link
            href={link.href}
            className="flex items-center flex-grow"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            {link.icon && <span className="mr-2">{link.icon}</span>}
            <span>{link.label}</span>
          </Link>
          
          {hasChildren && (
            <button
              onClick={() => toggleItem(link.label)}
              className="p-1 rounded hover:bg-blue-700 transition-colors"
              aria-expanded={isOpen}
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg z-40 overflow-hidden">
            {link.children?.map(child => (
              <Link
                key={child.label}
                href={child.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setOpenItems({})}
              >
                {child.icon && <span className="mr-3">{child.icon}</span>}
                <span>{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className={`${gradientClass} shadow-2xl sticky top-0 z-30 border-b border-blue-400/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo and mobile menu button */}
            <div className="flex items-center">
              <button
                className="lg:hidden text-white mr-4"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10 mr-3">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-white">Your App</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {sidebarLinks.map(link => renderDesktopLink(link))}
            </nav>

            {/* User info and notifications */}
            <div className="flex items-center space-x-4">
              <NotificationDropdown userId={globalUserId} />
              <div className="text-white">
                User ID: {globalUserId || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 ${gradientClass} shadow-xl z-50 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
          <span className="text-white font-semibold">Navigation</span>
          <button
            className="text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {sidebarLinks.map(link => renderMobileLink(link))}
        </nav>
      </div>
    </>
  );
}
