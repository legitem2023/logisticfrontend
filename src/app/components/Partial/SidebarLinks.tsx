'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
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
  gradientClass = 'bg-gradient-to-r from-emerald-600 to-green-600',
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
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Toggle Button */}
      {isMounted && (
        <div className="md:hidden fixed top-4 left-4 z-10">
          <button
            aria-label="Toggle Sidebar"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl backdrop-blur bg-white/40 border border-gray-200 shadow-lg hover:bg-white/60 transition"
          >
            <Menu size={20} className="text-gray-800" />
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
        <div className="h-full w-full bg-white/70 backdrop-blur-md shadow-xl border-r border-gray-200 p-4 rounded-tr-2xl rounded-br-2xl overflow-y-auto flex flex-col gap-2">
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={i}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive ? `${gradientClass} text-white shadow-md` : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 p-0 ${
          isMobileOpen ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        {/* This is where page content will be rendered via Next.js routing */}
      </main>

      {/* Mobile Backdrop */}
      {isMounted && isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
