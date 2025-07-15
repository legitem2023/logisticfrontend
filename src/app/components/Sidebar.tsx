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
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Mobile Toggle Button - hidden on desktop */}
      <div className="md:hidden fixed top-4 left-4 z-10">
        <button
          aria-label="Toggle Sidebar"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-white/50 border border-gray-300 shadow-md hover:bg-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar - uses Tailwind responsive classes instead of window checks */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        <div className="flex flex-col h-full space-y-1 p-2 overflow-y-auto">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-left transition-colors ${
                activeIndex === i
                  ? 'customgrad text-white font-semibold shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 p-0 ${
          isMobileOpen ? 'opacity-70' : ''
        }`}
      >
        {tabs[activeIndex]?.content}
      </main>

      {/* Backdrop - only shows on mobile when sidebar is open */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
