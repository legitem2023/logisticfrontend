'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export type SidebarLink = {
  label: string;
  href: string;
  icon?: ReactNode;
};

type SidebarLinksProps = {
  links: SidebarLink[];
  sidebarWidth?: string; // default "w-64"
  gradientClass?: string; // default active link gradient
};

export default function SidebarLinks({
  links,
  sidebarWidth = 'w-64',
  gradientClass = 'bg-white/10 backdrop-blur-md',
}: SidebarLinksProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    if (isMounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileOpen, isMounted]);

  if (!links.length) return null;

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Mobile Toggle Button */}
      {isMounted && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            aria-label="Toggle Sidebar"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl backdrop-blur bg-white/40 border border-gray-200 shadow-lg hover:bg-white/60 transition"
          >
            {isMobileOpen ? (
              <X size={20} className="text-gray-800" />
            ) : (
              <Menu size={20} className="text-gray-800" />
            )}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} transition-transform transform duration-300 ease-in-out
          ${!isMounted ? 'hidden' : isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        <div className="h-full w-full customgrad shadow-2xl border-r border-blue-400/20 p-4 rounded-tr-2xl rounded-br-2xl overflow-y-auto flex flex-col gap-4">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
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

          {/* Links */}
          <nav className="flex flex-col gap-2">
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`relative flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActive
                      ? `${gradientClass} text-white shadow-inner`
                      : 'text-blue-100 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMounted && isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
