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
const [activeIndex, setActiveIndex] = useState(1);
const [isMobileOpen, setIsMobileOpen] = useState(false);
const sidebarRef = useRef<HTMLDivElement>(null);

const handleTabClick = (index: number) => {
setActiveIndex(index);
setIsMobileOpen(false); // auto-close sidebar on mobile
};

// 👇 Handle outside click
useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (
isMobileOpen &&
sidebarRef.current &&
!sidebarRef.current.contains(event.target as Node)
) {
setIsMobileOpen(false);
}
};

document.addEventListener('mousedown', handleClickOutside);  
return () => {  
  document.removeEventListener('mousedown', handleClickOutside);  
};

}, [isMobileOpen]);

return (
<div className="flex h-[89vh] w-full">
{/* Mobile toggle */}
<div className="md:hidden absolute top-4 left-4 z-30">
<button
onClick={() => setIsMobileOpen(!isMobileOpen)}
className="customgrad p-2 rounded-md bg-gray-200 hover:bg-gray-300 backdrop-blur-md bg-white/20 border border-white/30 shadow-md"
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
    {/* <div className="customgrad w-full h-[10vh]"></div>  */}
    {tabs.map((tab, i) => (  
      <button  
        key={i}  
        onClick={() => handleTabClick(i)}  
        className={`${ tab.label } w-full flex items-center gap-2 px-2 py-2 text-left transition-colors ${  
          activeIndex === i  
            ? 'bg-green-400 text-gray-700 backdrop-blur-md bg-white/20 border border-white/30 shadow-md'  
            : 'text-gray-400 hover:bg-gray-200'  
        }`}  
      >  
        {tab.icon}  
        <span>{tab.label}</span>  
      </button>  
    ))}  
  </aside>  

  {/* Content Area */}  
  <main className="flex-1 p-2 overflow-auto md:ml-0 ml-0 h-[89vh]">  
    {tabs[activeIndex]?.content}  
  </main>  
</div>

);
}

