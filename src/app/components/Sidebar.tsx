'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { Menu } from 'lucide-react';

type Tab = {
  label: string;
  icon?: ReactNode;
  content: ReactNode;
};

type SidebarTabsProps = {
  tabs: Tab[];
};

export default function Sidebar({ tabs }: SidebarTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    setIsMobileOpen(false);
  };

  if (!tabs.length) return null;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-10">
        <button
          aria-label="Toggle Sidebar"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl backdrop-blur bg-white/40 border border-gray-200 shadow-lg hover:bg-white/60 transition"
        >
          <Menu size={20} className="text-gray-800" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        <div className="h-full w-full bg-white/70 backdrop-blur-md shadow-xl border-r border-gray-200 p-4 rounded-tr-2xl rounded-br-2xl overflow-y-auto flex flex-col gap-2">
          
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  activeIndex === i
                    ? 'customgrad text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 p-0 ${
          isMobileOpen ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        {tabs[activeIndex]?.content}
      </main>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
