'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
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
};

type SidebarLinksProps = {
  links: SidebarLink[];
  sidebarWidth?: string; // unused here but kept to preserve API
  gradientClass?: string; // used for active state in mobile drawer
};

export default function SidebarLinks({
  links,
  sidebarWidth = 'w-64',
  gradientClass = 'customgrad',
}: SidebarLinksProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const globalUserId = useSelector(selectTempUserId);
  const drawerRef = useRef<HTMLDivElement>(null);

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

  if (!links.length) return null;

  return (
    <>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Header (copied style) */}
      <header className="customgrad shadow-2xl sticky top-0 z-30 border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative h-14 w-14 transition-transform duration-300 group-hover:rotate-6">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={i}
                    href={link.href}
                    className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                      isActive
                        ? 'bg-white/10 backdrop-blur-md text-white shadow-inner'
                        : 'text-blue-100 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side (Notifications + Mobile Toggle) */}
            <div className="flex items-center space-x-4">
              {!!globalUserId && (
                <div className="relative">
                  <NotificationDropdown userId={globalUserId} />
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden p-2 rounded-xl backdrop-blur bg-white/40 border border-gray-200 shadow-lg hover:bg-white/60 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          ref={drawerRef}
          className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white/70 backdrop-blur-md shadow-xl z-50 rounded-tr-2xl rounded-br-2xl transform transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mt-4 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? `${gradientClass} text-white shadow-md`
                      : 'text-gray-600 hover:bg-blue-700/20 hover:text-white'
                  }`}
                >
                  {link.icon && <span className="mr-3">{link.icon}</span>}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
