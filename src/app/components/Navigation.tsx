import { useState, useEffect } from 'react';
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardCheck,
  Truck,
  WalletMinimal,
  Users,
  BadgeCheck,
  Settings,
  HelpCircle,
  UserPlus,
  LogIn,
  Menu,
  X
} from 'lucide-react';

const Navigation = ({ userRole, isUserActive, activeIndex, setActiveIndex }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const tabItems = [
    {
      id: 0,
      label: 'Home',
      role: '',
      icon: <HomeIcon size={20} />
    },
    {
      id: 1,
      label: 'Chart',
      role: '',
      icon: <ChartBarIcon size={20} />
    },
    ...(isUserActive
      ? [
          {
            id: 3,
            label: 'Logistics Panel',
            role: '',
            icon: <ClipboardCheck size={20} />
          },
        ]
      : []),
    ...(isUserActive && (userRole === 'Sender' || userRole === 'SENDER')
      ? [
          {
            id: 4,
            label: 'Create Delivery',
            role: 'Sender',
            icon: <Truck size={20} />
          },
        ]
      : []),
    ...(isUserActive && (userRole === 'Sender' || userRole === 'SENDER')
      ? [
          {
            id: 5,
            label: 'Wallet',
            role: 'Sender',
            icon: <WalletMinimal size={20} />
          },
        ]
      : []),
    ...(isUserActive && (userRole === 'Administrator' || userRole === 'ADMINISTRATOR')
      ? [
          {
            id: 6,
            label: 'Accounts',
            role: '',
            icon: <Users size={20} />
          },
        ]
      : []),
    ...(isUserActive && (userRole === 'Administrator' || userRole === 'ADMINISTRATOR')
      ? [
          {
            id: 7,
            label: 'Unassigned',
            role: '',
            icon: <BadgeCheck size={20} />
          },
        ]
      : []),
    ...(isUserActive && (userRole === 'Administrator' || userRole === 'ADMINISTRATOR')
      ? [
          {
            id: 8,
            label: 'Vehicle Types',
            role: '',
            icon: <Truck size={20} />
          },
        ]
      : []),
    ...(isUserActive
      ? [
          {
            id: 9,
            label: 'Settings',
            role: '',
            icon: <Settings size={20} />
          },
        ]
      : []),
    {
      id: 10,
      label: 'Help Center',
      role: '',
      icon: <HelpCircle size={20} />
    },
    ...(!isUserActive
      ? [
          {
            id: 11,
            label: 'Signup',
            role: '',
            icon: <UserPlus size={20} />
          },
        ]
      : []),
    ...(!isUserActive
      ? [
          {
            id: 12,
            label: 'Login',
            role: '',
            icon: <LogIn size={20} />
          },
        ]
      : []),
  ];

  const additionalItems = [
    { id: 13, label: 'Contact Us', icon: <HelpCircle size={20} /> },
    { id: 14, label: 'FAQ', icon: <HelpCircle size={20} /> },
    { id: 15, label: 'Privacy Policy', icon: <HelpCircle size={20} /> },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleTabClick = (tabId) => {
    setActiveIndex(tabId);
    setIsDrawerOpen(false);
  };

  const NavItem = ({ item }) => (
    <button
      onClick={() => handleTabClick(item.id)}
      className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
        activeIndex === item.id
          ? 'bg-green-100 text-green-700 font-medium'
          : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      <span className="mr-3 text-green-600">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );

  const TopNavItem = ({ item }) => (
    <button
      onClick={() => handleTabClick(item.id)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        activeIndex === item.id
          ? 'bg-green-100 text-green-700'
          : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      {item.label}
    </button>
  );

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Truck className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">LogisticsApp</span>
              </div>
              {!isMobile && (
                <div className="hidden md:ml-6 md:flex md:space-x-1">
                  {tabItems.slice(0, 3).map((item) => (
                    <TopNavItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {!isMobile && (
                <div className="flex space-x-1">
                  {tabItems.slice(3, 5).map((item) => (
                    <TopNavItem key={item.id} item={item} />
                  ))}
                  <TopNavItem key={tabItems[tabItems.length - 1].id} item={tabItems[tabItems.length - 1]} />
                </div>
              )}
              
              <button
                onClick={toggleDrawer}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
              >
                {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 transform ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:hidden`}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white w-80 h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-1">
              <h3 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Main Navigation</h3>
              {tabItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
              
              <h3 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Support</h3>
              {additionalItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
