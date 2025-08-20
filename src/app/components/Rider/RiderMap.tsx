'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Button } from "../ui/Button"; 
import { XIcon, Sun, Moon } from "lucide-react";
import { showToast } from '../../../../utils/toastify'; 
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { SENDNOTIFICATION } from "../../../../graphql/mutation"; 
import { useMutation, useSubscription } from "@apollo/client";
import { LocationTracking } from '../../../../graphql/subscription';
import { FaMotorcycle, FaMapMarkerAlt, FaCrown, FaChevronUp, FaExclamationTriangle, FaStore } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { MdOutlineDeliveryDining } from 'react-icons/md';

type Coordinates = {
  lat: number;
  lng: number;
}

export default function RiderMap({ PickUpCoordinates, DropOffCoordinates, deliveryId, senderId, setMap }: { 
  PickUpCoordinates: Coordinates,
  DropOffCoordinates: Coordinates,
  deliveryId: any,
  senderId: any,
  setMap:() => void
}) {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Tracking state
  const [acceptancePoint, setAcceptancePoint] = useState<L.LatLng | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [panelHeight, setPanelHeight] = useState(320);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');
  const progressRef = useRef({
    totalDistance: null as number | null,
    checkInterval: null as NodeJS.Timeout | null
  });

  const [sendNotification] = useMutation(SENDNOTIFICATION, {
    onCompleted: () => showToast("Notification sent", "success"),
    onError: (e: any) => console.log('Notification Error', e)
  });
  
  const location = useSelector((state: any) => state.location.current);
  const globalUserId = useSelector(selectTempUserId);
  const [status, setStatus] = useState<'pending' | 'arrived' | 'failed' | 'delivered' | null>(null);

  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: globalUserId },
  });

  const handleNotification = (message: string) => {
    sendNotification({
      variables: {
        userID: senderId, 
        title: "Delivery Update", 
        message: message, 
        type: 'DELIVERY_STATUS'
      }
    });
  };
  
  const rider = locationData?.LocationTracking
    ? L.latLng(locationData.LocationTracking.latitude, locationData.LocationTracking.longitude)
    : L.latLng(location?.latitude, location?.longitude);

  const sender = L.latLng(PickUpCoordinates?.lat, PickUpCoordinates?.lng);
  const receiver = L.latLng(DropOffCoordinates.lat, DropOffCoordinates.lng);

  // Function to toggle map theme
  const toggleMapTheme = () => {
    setMapTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Luxury dark green to green theme icons
  const riderIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute -top-1 -right-1 text-emerald-400 z-10">
          <FaCrown />
        </div>
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
          <FaMotorcycle class="text-xl" />
        </div>
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const senderIcon = L.divIcon({
    html: `
      <div class="w-10 h-10 bg-gradient-to-br from-emerald-800 to-emerald-600 rounded-full border-2 border-emerald-300 flex items-center justify-center text-white">
        <FaStore class="text-xl" />
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  
  const receiverIcon = L.divIcon({
    html: `
      <div class="w-10 h-10 bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-full border-2 border-emerald-300 flex items-center justify-center text-white">
        <FaMapMarkerAlt class="text-xl" />
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // Update map theme when it changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing tile layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new tile layer based on theme - Using more colorful options
    let tileLayer, attribution;
    
    if (mapTheme === 'dark') {
      // More colorful dark theme - Using Stadia Maps Alidade Smooth Dark
      tileLayer = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    } else {
      // More colorful light theme - Using Stamen Toner Lite
      tileLayer = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png';
      attribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    L.tileLayer(tileLayer, {
      maxZoom: 20,
      attribution: attribution,
      subdomains: mapTheme === 'light' ? ['a', 'b', 'c', 'd'] : undefined
    }).addTo(mapRef.current);

    // Update UI elements based on theme
    const container = document.getElementById('map');
    if (container) {
      if (mapTheme === 'dark') {
        container.classList.remove('light-map');
        container.classList.add('dark-map');
      } else {
        container.classList.remove('dark-map');
        container.classList.add('light-map');
      }
    }
  }, [mapTheme]);

  // 1. Set acceptance point when rider first appears
  useEffect(() => {
    if (rider && !acceptancePoint) {
      setAcceptancePoint(rider.clone());
      progressRef.current.totalDistance = rider.distanceTo(sender);
      console.log(`Total distance to pickup: ${progressRef.current.totalDistance?.toFixed(0)} meters`);
      
      // Calculate estimated time (1.5 minutes per 100 meters)
      const timeEstimate = (progressRef.current.totalDistance / 100) * 1.5;
      setEstimatedTime(Math.round(timeEstimate));
    }
  }, [rider]);

  // 2. Automatic progress tracking
  useEffect(() => {
    if (!rider || !acceptancePoint || !progressRef.current.totalDistance || notificationSent) return;

    const checkProgress = () => {
      const currentDistance = acceptancePoint.distanceTo(rider);
      const progressRatio = currentDistance / progressRef.current.totalDistance!;

      console.log(`Progress: ${(progressRatio * 100).toFixed(1)}%`);

      if (progressRatio >= 0.25) {
        handleNotification("🚀 Rider is on the way to pick up your order!");
        setNotificationSent(true);
        
        // Clean up interval
        if (progressRef.current.checkInterval) {
          clearInterval(progressRef.current.checkInterval);
        }
      }
    };

    // Check every 10 seconds
    progressRef.current.checkInterval = setInterval(checkProgress, 10000);
    
    // Initial check
    checkProgress();

    return () => {
      if (progressRef.current.checkInterval) {
        clearInterval(progressRef.current.checkInterval);
      }
    };
  }, [acceptancePoint, notificationSent]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(sender, 13);
    
    mapRef.current = map;

    // Initial map tiles based on theme
    let tileLayer, attribution;
    
    if (mapTheme === 'dark') {
      // More colorful dark theme
      tileLayer = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    } else {
      // More colorful light theme
      tileLayer = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png';
      attribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    L.tileLayer(tileLayer, {
      maxZoom: 20,
      attribution: attribution,
      subdomains: mapTheme === 'light' ? ['a', 'b', 'c', 'd'] : undefined
    }).addTo(map);
    
    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    
    // Add markers
    L.marker(rider, { icon: riderIcon }).bindPopup('<div class="font-bold text-emerald-400">Premium Rider</div>').addTo(map);
    L.marker(sender, { icon: senderIcon }).bindPopup('<div class="font-bold text-emerald-300">Pickup Point</div>').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('<div class="font-bold text-emerald-300">Delivery Point</div>').addTo(map);

    import('leaflet-routing-machine').then(() => {
      if (!mapRef.current) return;

      const routingControl = L.Routing.control({
        waypoints: [rider, sender, receiver],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        show: false,
        lineOptions: {
          styles: [{ 
            color: '#10b981', 
            weight: 5,
            opacity: 0.7
          }]
        }
      } as any).addTo(mapRef.current!);

      routingRef.current = routingControl;
    });

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      routingRef.current?.remove();
      routingRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle panel dragging
  useEffect(() => {
    if (!panelRef.current) return;

    const panel = panelRef.current;
    let startY: number, startHeight: number;

    const initDrag = (e: MouseEvent | TouchEvent) => {
      startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startHeight = panelHeight;
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
      panel.classList.add('transition-none');
    };

    const drag = (e: MouseEvent | TouchEvent) => {
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - currentY;
      const newHeight = Math.min(Math.max(startHeight + deltaY, 120), window.innerHeight - 100);
      
      setPanelHeight(newHeight);
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
      panel.classList.remove('transition-none');
      
      // Snap to open/closed positions
      if (panelHeight < 200) {
        setIsPanelOpen(false);
      } else {
        setIsPanelOpen(true);
      }
    };

    const dragHandle = panel.querySelector('.drag-handle');
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', initDrag);
      dragHandle.addEventListener('touchstart', initDrag);
    }

    return () => {
      if (dragHandle) {
        dragHandle.removeEventListener('mousedown', initDrag);
        dragHandle.removeEventListener('touchstart', initDrag);
      }
    };
  }, [panelHeight]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${mapTheme === 'dark' ? 'bg-emerald-950' : 'bg-gray-100'}`}>
      {/* Fixed top bar with theme-appropriate background */}
      <div className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50 border-b ${
        mapTheme === 'dark' 
          ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 border-emerald-400/50' 
          : 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-300/50'
      }`}>
        <h2 className={`text-lg font-semibold ${mapTheme === 'dark' ? 'text-white' : 'text-white'}`}>Premium Delivery</h2>
        <div className="flex gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleMapTheme}
            className={`p-2 rounded-full transition-colors shadow-lg ${
              mapTheme === 'dark' 
                ? 'text-white bg-emerald-700 hover:bg-emerald-600' 
                : 'text-white bg-emerald-500 hover:bg-emerald-400'
            }`}
            title={`Switch to ${mapTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mapTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={setMap}
            className={`p-2 rounded-full transition-colors shadow-lg ${
              mapTheme === 'dark' 
                ? 'text-white bg-emerald-700 hover:bg-emerald-600' 
                : 'text-white bg-emerald-500 hover:bg-emerald-400'
            }`}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map container */}
      <div 
        ref={mapContainerRef}
        id="map"
        className="w-full h-full pt-14 z-0"
      />

      {/* Luxury Control Panel */}
      <div className="absolute top-16 left-4 z-10">
        <div className={`rounded-2xl p-4 shadow-2xl border ${
          mapTheme === 'dark' 
            ? 'bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-600' 
            : 'bg-gradient-to-br from-emerald-600 to-emerald-500 border-emerald-400'
        }`}>
          <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              mapTheme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-200'
            }`}></div>
            <h3 className={`font-bold text-lg ${
              mapTheme === 'dark' ? 'text-white' : 'text-white'
            }`}>Delivery #{deliveryId.slice(0, 8)}</h3>
          </div>
          
          <div className="flex items-center text-sm mb-2">
            <GiPathDistance className={`mr-2 ${
              mapTheme === 'dark' ? 'text-emerald-300' : 'text-emerald-100'
            }`} />
            <span className={mapTheme === 'dark' ? 'text-emerald-200' : 'text-emerald-100'}>
              {progressRef.current.totalDistance ? `${(progressRef.current.totalDistance / 1000).toFixed(1)} km` : 'Calculating...'}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <FaMotorcycle className={`mr-2 ${
              mapTheme === 'dark' ? 'text-emerald-300' : 'text-emerald-100'
            }`} />
            <span className={mapTheme === 'dark' ? 'text-emerald-200' : 'text-emerald-100'}>
              {estimatedTime ? `~${estimatedTime} min` : 'Estimating...'}
            </span>
          </div>
        </div>
      </div>

      {/* Luxury Status Panel - Fixed height and z-index */}
      <div
        ref={panelRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50 px-6 pb-8
          rounded-t-3xl shadow-[0_-20px_50px_-10px_rgba(6,78,59,0.5)]
          transition-all duration-300 ease-out
          ${isPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}
          ${mapTheme === 'dark' 
            ? 'bg-gradient-to-t from-emerald-900 to-emerald-950 border-t border-emerald-500' 
            : 'bg-gradient-to-t from-emerald-500 to-emerald-600 border-t border-emerald-400'}
        `}
        style={{ height: `${panelHeight}px` }}
      >
        {/* Draggable Handle */}
        <div 
          className="drag-handle absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 rounded-full cursor-row-resize touch-none"
          style={{ backgroundColor: mapTheme === 'dark' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}
        >
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2" 
               style={{ color: mapTheme === 'dark' ? '#a7f3d0' : '#ffffff' }}>
            <FaChevronUp />
          </div>
        </div>

        <div className="pt-8 h-full flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Delivery Operations</h2>
            <p className="text-sm" style={{ color: mapTheme === 'dark' ? '#a7f3d0' : '#d1fae5' }}>Premium Express Service</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={() => {
                setStatus('arrived');
                handleNotification("🏍️ Rider has arrived at pickup location");
                setIsPanelOpen(false);
              }}
              className={`
                flex items-center justify-center gap-3 py-4 rounded-xl
                text-white font-semibold shadow-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                focus:ring-2 focus:ring-opacity-50
                border
                ${status === 'arrived' ? 'ring-2' : ''}
                ${mapTheme === 'dark' 
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 border-emerald-400/30 focus:ring-emerald-500 ring-emerald-400' 
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-300/30 focus:ring-emerald-400 ring-emerald-300'}
              `}>
              <FaStore className="text-xl" />
              <span>Arrived at Pickup Location</span>
            </button>
            
            <button
              onClick={() => {
                setStatus('delivered');
                handleNotification("📦 Package has been successfully delivered");
                setIsPanelOpen(false);
              }}
              className={`
                flex items-center justify-center gap-3 py-4 rounded-xl
                text-white font-semibold shadow-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                focus:ring-2 focus:ring-opacity-50
                border
                ${status === 'delivered' ? 'ring-2' : ''}
                ${mapTheme === 'dark' 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-300/30 focus:ring-emerald-400 ring-emerald-300' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-400 border-emerald-200/30 focus:ring-emerald-300 ring-emerald-200'}
              `}>
              <MdOutlineDeliveryDining className="text-xl" />
              <span>Mark as Delivered</span>
            </button>
            
            <button
              onClick={() => {
                setStatus('failed');
                handleNotification("⚠️ Delivery attempt failed - Package not delivered");
                setIsPanelOpen(false);
              }}
              className={`
                flex items-center justify-center gap-3 py-4 rounded-xl
                text-white font-semibold shadow-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                focus:ring-2 focus:ring-opacity-50
                border
                ${status === 'failed' ? 'ring-2' : ''}
                ${mapTheme === 'dark' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-600 border-rose-400/30 focus:ring-rose-500 ring-rose-400' 
                  : 'bg-gradient-to-r from-rose-600 to-rose-500 border-rose-300/30 focus:ring-rose-400 ring-rose-300'}
              `}>
              <FaExclamationTriangle className="text-xl" />
              <span>Delivery Attempt Failed</span>
            </button>
          </div>

          {status && (
            <div className="mt-auto flex justify-center">
              <span className={`
                px-4 py-2 rounded-full text-sm font-medium
                ${
                  status === 'arrived' 
                    ? mapTheme === 'dark' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-emerald-500/80 text-white'
                    : status === 'failed' 
                    ? mapTheme === 'dark' ? 'bg-rose-800/80 text-rose-200' : 'bg-rose-500/80 text-white'
                    : status === 'delivered' 
                    ? mapTheme === 'dark' ? 'bg-emerald-700/80 text-emerald-100' : 'bg-emerald-400/80 text-white'
                    : mapTheme === 'dark' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-600 text-white'
                }
              `}>
                {status === 'arrived' ? '🏍️ Arrived at pickup location' : 
                 status === 'failed' ? '⚠️ Delivery attempt failed' : 
                 status === 'delivered' ? '📦 Package delivered successfully' : 
                 '🔄 Processing update...'}
              </span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t" style={{ borderColor: mapTheme === 'dark' ? '#065f46' : '#a7f3d0' }}>
            <div className="flex justify-between text-sm" style={{ color: mapTheme === 'dark' ? '#a7f3d0' : '#d1fae5' }}>
              <span className="flex items-center gap-1">
                <FaStore style={{ color: mapTheme === 'dark' ? '#a7f3d0' : '#ffffff' }} /> Pickup
              </span>
              <span className="flex items-center gap-1">
                <FaCrown style={{ color: mapTheme === 'dark' ? '#a7f3d0' : '#ffffff' }} /> Premium
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt style={{ color: mapTheme === 'dark' ? '#a7f3d0' : '#ffffff' }} /> Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Open Panel Button (when minimized) */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50
            rounded-full p-3 shadow-lg hover:shadow-xl animate-bounce
            flex items-center justify-center w-12 h-12"
          style={{
            background: mapTheme === 'dark' 
              ? 'linear-gradient(to right, #059669, #10b981)' 
              : 'linear-gradient(to right, #10b981, #34d399)',
            color: 'white'
          }}
        >
          <FaChevronUp className="text-lg" />
        </button>
      )}
    </div>
  );
  }
