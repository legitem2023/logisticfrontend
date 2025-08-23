import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NotificationDropdown from "./NotificationDropdown";
import { selectTempUserId } from "../../../Redux/tempUserSlice";
import { setActiveIndex } from '../../../Redux/activeIndexSlice';
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardCheck,
  Truck,
  WalletMinimal,
  Users,
  User,
  BadgeCheck,
  Settings,
  HelpCircle,
  UserPlus,
  LogIn,
  Menu,
  X,
  Phone,
  Shield,
  ChevronDown,
  Crown,
  Sparkles
} from 'lucide-react';

const Navigation = ({ userRole, isUserActive }) => {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state:any) => state.activeIndex.value);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const globalUserId = useSelector(selectTempUserId);
  const username = useSelector((state:any) => state.username.value);
  const router = useRouter(); 
  const pathname = usePathname();
  const isHome = pathname === "/";
  console.log(isHome,"Home");
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
      label: 'Analytics',
      role: '',
      icon: <ChartBarIcon size={20} />
    },
    ...(isUserActive()
      ? [
          {
            id: 3,
            label: userRole === 'Administrator' || userRole === 'ADMINISTRATOR'?'Transactions':'Logistics Panel',
            role: '',
            icon: <ClipboardCheck size={20} />
          },
        ]
      : []),
    ...(isUserActive() && (userRole === 'Sender' || userRole === 'SENDER')
      ? [
          {
            id: 4,
            label: 'Create Delivery',
            role: 'Sender',
            icon: <Truck size={20} />
          },
        ]
      : []),
    ...(isUserActive() && (userRole === 'Sender' || userRole === 'SENDER')
      ? [
          {
            id: 5,
            label: 'Wallet',
            role: 'Sender',
            icon: <WalletMinimal size={20} />
          },
        ]
      : []),
    ...(isUserActive() && (userRole === 'Administrator' || userRole === 'ADMINISTRATOR')
      ? [
          {
            id: 6,
            label: 'Accounts',
            role: '',
            icon: <Users size={20} />
          },
        ]
      : []),
    ...(isUserActive() && (userRole === 'Administrator' || userRole === 'ADMINISTRATOR')
      ? [
          {
            id: 7,
            label: 'Unassigned',
            role: '',
            icon: <BadgeCheck size={20} />
          },
        ]
      : []),
    ...(isUserActive() && (userRole === 'Administrator' || userRole === 'ADMINISTRATOR')
      ? [
          {
            id: 8,
            label: 'Vehicles',
            role: '',
            icon: <Truck size={20} />
          },
        ]
      : []),
    ...(isUserActive()
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
      label: 'Help',
      role: '',
      icon: <HelpCircle size={20} />
    },
    ...(!isUserActive()
      ? [
          {
            id: 11,
            label: 'Sign Up',
            role: '',
            icon: <UserPlus size={20} />
          },
        ]
      : []),
    ...(!isUserActive()
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
    { id: 13, label: 'Contact Us', role:'/Contact', icon: <Phone size={20} /> },
    { id: 14, label: 'FAQ', role:'/FAQ', icon: <HelpCircle size={20} /> },
    { id: 15, label: 'Privacy Policy', role:'/Privacy', icon: <Shield size={20} /> },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const NavItem = ({ item }) => {
    const isActive = activeIndex === item.id; 
    return (
      <a
        href="#"
        className={`relative flex items-center px-4 py-3 text-gold-100 hover:bg-gradient-to-r from-gold-500/10 to-transparent hover:text-white rounded-lg transition-all duration-300 group ${
          isActive ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-white shadow-lg' : ''
        }`}
        onClick={(e) => {
          e.preventDefault();
          
          dispatch(setActiveIndex(item.id));
          if(!isHome){
            router.push('/');
          }
          setIsDrawerOpen(false);
        }}
      >
        <span className="mr-3 text-gold-400 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500 rounded-full"></div>
        )}
        <Sparkles size={12} className="absolute -top-1 -right-1 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </a>
    );
  };

  const SupportNavItem = ({ item }) => (
    <a
      href={item.role}
      className="flex items-center px-4 py-3 text-gold-100 hover:bg-gradient-to-r from-gold-500/10 to-transparent hover:text-white rounded-lg transition-all duration-300 group"
      onClick={() => setIsDrawerOpen(false)}
    >
      <span className="mr-3 text-gold-400 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </a>
  );

  // Mobile-specific components with green active tabs
  const MobileNavItem = ({ item }) => {
  const isActive = isHome?activeIndex === item.id:false; 
  
  return (
    <a
      href="#"
      className={`relative flex items-center px-4 py-3 text-gray-800 hover:bg-green-500/20 hover:text-green-700 rounded-lg transition-all duration-300 group ${
        isActive ? 'bg-green-500/30 text-green-800 shadow-lg' : ''
      }`}
      onClick={(e) => {
        e.preventDefault();
        if (!isHome) {
          router.push('/');
          dispatch(setActiveIndex(item.id)); // Set to home index if not already home
        } else {
          dispatch(setActiveIndex(item.id)); // Set to the item's id if already home
        }
        setIsDrawerOpen(false);
      }}
    >
      <span className={`mr-3 group-hover:scale-110 transition-transform duration-300 ${
        isActive ? 'text-green-600' : 'text-gray-600'
      }`}>{item.icon}</span>
      <span className="font-medium">{item.label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></div>
      )}
      <Sparkles size={12} className="absolute -top-1 -right-1 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
};


const MobileSupportNavItem = ({ item }) => {
    // Check if current page matches the item's path (for support pages)
    const isActive = item.role && pathname === item.role;
    
    return (
      <a
        href={item.role}
        className={`relative flex items-center px-4 py-3 text-gray-700 hover:bg-green-500/20 hover:text-green-700 rounded-lg transition-all duration-300 group ${
          isActive ? 'bg-green-500/30 text-green-800 shadow-lg' : ''
        }`}
        onClick={() => setIsDrawerOpen(false)}
      >
        <span className={`mr-3 text-gray-600 group-hover:scale-110 transition-transform duration-300 ${
          isActive ? 'text-green-600' : 'text-gray-600'
        }`}>{item.icon}</span>
        <span className="font-medium">{item.label}</span>
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"></div>
        )}
        <Sparkles size={12} className="absolute -top-1 -right-1 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </a>
    );
  };


  
  // For desktop, we'll show up to 4 main items and put the rest in a dropdown
  const maxMainItems = 3;
  const mainItems = tabItems.slice(0, maxMainItems);
  const dropdownItems = tabItems.slice(3, tabItems.length);

  return (
    <>
      <style jsx global>{`
        :root {
          --gold-100: #FDF6B2;
          --gold-200: #FCE96A;
          --gold-300: #FACA15;
          --gold-400: #E3A008;
          --gold-500: #C27803;
        }
         
        .luxury-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(255, 215, 0, 0.15);
        }
        
        .gold-gradient-text {
          background: linear-gradient(135deg, #FDF6B2 0%, #FCE96A 25%, #FACA15 50%, #E3A008 75%, #C27803 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <nav className="customgrad luxury-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center group">
                  <div className="relative h-12 w-12 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
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
              {!isMobile && (
                <div className="hidden md:ml-8 md:flex md:space-x-1">
                  {mainItems.map((item) => (
                    <NavItem key={item.id} item={item} />
                  ))}          
                  
                  {/* More dropdown */}
                  {dropdownItems.length > 0 && (
                    <div className="relative">
                      <button
                        className={`flex items-center px-4 py-3 text-gold-100 hover:bg-gradient-to-r from-gold-500/10 to-transparent hover:text-white rounded-lg transition-all duration-300 ${
                          dropdownItems.some(item => item.id === activeIndex) ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-white' : ''
                        }`}
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                      >
                        <span>More</span>
                        <ChevronDown size={16} className="ml-1 transition-transform duration-300 transform ${isMoreOpen ? 'rotate-180' : ''}" />
                      </button>               
                      {isMoreOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-gray-900 bg-opacity-95 backdrop-blur-lg rounded-lg shadow-xl luxury-shadow py-2 z-10 border border-gold-500/20">
                          {dropdownItems.map((item) => (
                            <a
                              key={item.id}
                              href="#"
                              className={`flex items-center px-4 py-3 text-sm text-gold-100 hover:bg-gradient-to-r from-gold-500/10 to-transparent hover:text-white transition-all duration-200 ${
                                activeIndex === item.id ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-white' : ''
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(setActiveIndex(item.id));
                                setIsMoreOpen(false);
                              }}
                            >
                              <span className="mr-3 text-gold-400">{item.icon}</span>
                              <span>{item.label}</span>
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
              
              {isUserActive() && (
                <div className="relative">
                  <NotificationDropdown userId={globalUserId} />
                </div>
              )}
              <button
                onClick={toggleDrawer}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gold-200 hover:bg-gold-500/10 hover:text-white focus:outline-none transition-all duration-300"
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
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white/80 backdrop-blur-md w-80 h-full overflow-y-auto luxury-shadow">
            <div className="customgrad h-20 flex items-center justify-between p-5 border-b border-green-500/20">
          {isUserActive()?(
            <div className="px-4 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <User className="h-6 w-6 text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white-900 truncate">
                    {username || 'User'}
                  </p>
                  <span 
                    className="text-xs text-green-200 hover:underline"
                    onClick={() => {
  if (!isHome) {
    router.push('/');
  }
  dispatch(setActiveIndex(13));
}}
                  >
                    View Profile
                  </span>
                </div>
              </div>
            </div>
          ):(
            <h2 className="text-xl font-semibold text-white-500 flex items-center">
                <Menu size={20} className="mr-2" /> Menu
            </h2>
          )}
              
      
              
              <button onClick={() => setIsDrawerOpen(false)} className="text-white-500 hover:text-green-700 p-1 rounded-full hover:bg-green-500/10 transition-colors duration-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-1">
              <h3 className="px-4 pt-4 text-sm font-medium text-green-600 uppercase tracking-wider border-b border-green-500/20 pb-2">Main Navigation</h3>
              {tabItems.map((item) => (
                <MobileNavItem key={item.id} item={item} />
              ))}
              
              <h3 className="px-4 pt-4 text-sm font-medium text-green-600 uppercase tracking-wider border-b border-green-500/20 pb-2">Support</h3>
              {additionalItems.map((item) => (
                <MobileSupportNavItem key={item.id} item={item} />
              ))}
            </div>
            

          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Navigation);
