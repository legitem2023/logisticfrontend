import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setActiveIndex } from '../../../Redux/activeIndexSlice';
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
  X,
  ChevronDown
} from 'lucide-react';

const Navigation = ({ userRole, isUserActive }) => {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state:any) => state.activeIndex.value);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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

  const NavItem = ({ item }) => {
    const isActive = activeIndex === item.id; 
    return (
      <a
        href="#"
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors duration-200 ${
          isActive ? 'bg-green-100 text-green-700' : ''
        }`}
        onClick={(e) => {
          e.preventDefault();
          dispatch(setActiveIndex(item.id));
          setIsDrawerOpen(false);
        }}
      >
        <span className="mr-3 text-green-600">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    );
  };

  const SupportNavItem = ({ item }) => (
    <a
      href="#"
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors duration-200"
      onClick={() => setIsDrawerOpen(false)}
    >
      <span className="mr-3 text-green-600">{item.icon}</span>
      <span>{item.label}</span>
    </a>
  );

  // For desktop, we'll show up to 4 main items and put the rest in a dropdown
  const mainItems = tabItems.filter(item => 
    item.id !== 11 && item.id !== 12 && // Exclude signup/login from main nav
    item.id !== 9 && item.id !== 10 // Exclude settings and help from main nav
  ).slice(0, 4);
  
  const dropdownItems = tabItems.filter(item => 
    !mainItems.some(mainItem => mainItem.id === item.id) &&
    item.id !== 11 && item.id !== 12 // Exclude signup/login from dropdown
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
                <div className="hidden md:ml-6 md:flex md:space-x-2">
                  {mainItems.map((item) => (
                    <NavItem key={item.id} item={item} />
                  ))}            
                  {/* More dropdown */}
                  {dropdownItems.length > 0 && (
                    <div className="relative">
                      <button
                        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors duration-200 ${
                          dropdownItems.some(item => item.id === activeIndex) ? 'bg-green-100 text-green-700' : ''
                        }`}
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                      >
                        <span>More</span>
                        <ChevronDown size={16} className="ml-1" />
                      </button>               
                      {isMoreOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                          {dropdownItems.map((item) => (
                            <a
                              key={item.id}
                              href="#"
                              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 ${
                                activeIndex === item.id ? 'bg-green-100 text-green-700' : ''
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(setActiveIndex(item.id));
                                setIsMoreOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <span className="mr-2 text-green-600">{item.icon}</span>
                                <span>{item.label}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {!isMobile && (
                <div className="flex space-x-2">
                  {/* Auth items (signup/login) */}
                  {tabItems.filter(item => item.id === 11 || item.id === 12).map((item) => (
                    <NavItem key={item.id} item={item} />
                  ))}
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
            
            <div className="p-4 space-y-2">
              <h3 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Main Navigation</h3>
              {tabItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
              
              <h3 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Support</h3>
              {additionalItems.map((item) => (
                <SupportNavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
