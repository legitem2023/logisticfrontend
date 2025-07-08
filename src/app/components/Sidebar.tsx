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

export default function SidebarTabs({ tabs }: SidebarTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Hydration-safe rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    setIsMobileOpen(false); // auto-close sidebar on mobile
  };

  // Handle click outside the sidebar (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileOpen &&
        sidebarRef.current &&
        event.target instanceof Node &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Don't render on server (for hydration mismatch safety)
  if (!isMounted) return null;

  return (
    <div className="flex h-[89vh] w-full relative">
      {/* Mobile Toggle Button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="customgrad p-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed z-40 inset-y-0 left-0 w-60 bg-gray-100 border-r space-y-2 transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0
        `}
      >
        <div className="customgrad w-full h-[10vh]"></div>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabClick(i)}
            className={`w-full flex items-center gap-2 px-2 py-2 text-left transition-colors ${
              activeIndex === i
                ? 'bg-green-400 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-2 overflow-auto h-[89vh] md:ml-0 ml-0">
        {tabs[activeIndex]?.content}
      </main>
    </div>
  );
}
