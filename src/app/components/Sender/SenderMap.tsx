'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { showToast } from '../../../../utils/toastify'; 
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { LocationTracking } from '../../../../graphql/subscription';
import { useMutation, useQuery, useSubscription } from "@apollo/client"; 
import { FaMotorcycle, FaStore, FaMapMarkerAlt, FaCrown, FaChevronUp, FaExclamationTriangle } from 'react-icons/fa';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { GiPathDistance } from 'react-icons/gi';
import { Sun, Moon, Clock, XIcon } from "lucide-react";
import { calculateEta, convertMinutesToHours } from '../../../../utils/calculateEta';

type Coordinates = {
  lat: number;
  lng: number;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SenderMap({ riderId, receiverPOS, senderPOS, riderPOS, delivery }: { riderId: any, receiverPOS: Coordinates, senderPOS: Coordinates, riderPOS: Coordinates, delivery: any }) {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  console.log(delivery,"<=");
  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: riderId },
  });

  const location = useSelector((state: any) => state.location.current);
  const globalUserId = useSelector(selectTempUserId);
  const [status, setStatus] = useState<'pending' | 'cancelled' | 'finished' | null>(null);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('light');
  const [panelHeight, setPanelHeight] = useState(280);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState(convertMinutesToHours(parseInt(delivery.eta==="" || delivery.eta===null?"0":delivery.eta))});
  const [riderInfo, setRiderInfo] = useState({ name: delivery.assignedRider.name, rating: '4.9', vehicle: 'Premium Bike' });

  const sender = L.latLng(senderPOS.lat, senderPOS.lng);
  const receiver = L.latLng(receiverPOS.lat, receiverPOS.lng);

  const riderLocation = locationData?.LocationTracking
    ? L.latLng(locationData.LocationTracking.latitude, locationData.LocationTracking.longitude)
    : L.latLng(location?.latitude, location?.longitude);

  // Function to toggle map theme
  const toggleMapTheme = () => {
    setMapTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Luxury dark green to gold theme icons (same as first component)
  const riderIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute -top-2 -right-2 text-yellow-400 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="w-12 h-12 bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-full border-2 border-yellow-400 flex items-center justify-center text-yellow-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
            <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z"/>
            <path d="M5 6h5v2H5zm14 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        </div>
      </div>
    `,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  const senderIcon = L.divIcon({
    html: `
      <div class="w-12 h-12 bg-gradient-to-br from-emerald-800 to-emerald-600 rounded-full border-2 border-yellow-300 flex items-center justify-center text-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
          <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H8v-2h8v2zm0-3H8V9h8v2zm0-3H8V6h8v2z"/>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });
  
  const receiverIcon = L.divIcon({
    html: `
      <div class="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-full border-2 border-yellow-300 flex items-center justify-center text-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
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

    // Add new tile layer based on theme
    let tileLayer, attribution;
    
    if (mapTheme === 'dark') {
      // Luxury dark theme
      tileLayer = 'https://api.maptiler.com/maps/outdoor-v2-dark/{z}/{x}/{y}.png?key=dsaBgVHHsEOsYskJRv0v';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      // Maptiler terrain for light mode
      tileLayer = 'https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=dsaBgVHHsEOsYskJRv0v';
      attribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    }

    L.tileLayer(tileLayer, {
      maxZoom: 20,
      attribution: attribution,
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

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with elegant theme
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(sender, 13);

    mapRef.current = map;

    // Initial map tiles based on theme
    let tileLayer, attribution;
    
    if (mapTheme === 'dark') {
      // Luxury dark theme
      tileLayer = 'https://api.maptiler.com/maps/outdoor-v2-dark/{z}/{x}/{y}.png?key=dsaBgVHHsEOsYskJRv0v';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      // Maptiler terrain for light mode
      tileLayer = 'https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=dsaBgVHHsEOsYskJRv0v';
      attribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    }

    L.tileLayer(tileLayer, {
      maxZoom: 20,
      attribution: attribution,
    }).addTo(map);

    // Add custom zoom controls
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add markers with luxury styling
    L.marker(riderLocation, { icon: riderIcon }).bindPopup('Premium Rider').addTo(map);
    L.marker(sender, { icon: senderIcon }).bindPopup('Pickup Point').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('Delivery Point').addTo(map);

    // Add routing with luxury styling
    import('leaflet-routing-machine').then(() => {
      if (!mapRef.current) return;

      const routingControl = L.Routing.control({
        waypoints: [riderLocation, sender, receiver],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        show: false,
        lineOptions: {
          styles: [{ 
            color: '#fbbf24', 
            weight: 6,
            opacity: 0.8
          }]
        }
      } as any).addTo(mapRef.current);

      routingRef.current = routingControl;

      // Style the routing instructions panel
      const container = routingControl.getContainer();
      if (container) {
        container.style.display = 'none'; // Hide default panel
      }
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
    <div className={`relative w-full h-full overflow-hidden ${mapTheme === 'dark' ? 'bg-[#001a00]' : 'bg-[#e8f5e8]'}`}>
      {/* Fixed top bar with theme-appropriate background */}
      <div className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50 border-b backdrop-blur-md ${
        mapTheme === 'dark' 
          ? 'bg-gradient-to-r from-[#002000]/90 to-[#001800]/90 border-yellow-400/30' 
          : 'bg-[linear-gradient(301deg,rgba(8,137,54,1)_0%,rgba(0,44,16,1)_50%)] border-yellow-300/30'
      }`}>
        <h2 className={`text-lg font-semibold ${mapTheme === 'dark' ? 'text-yellow-100' : 'text-yellow-100'}`}>
          <span className="flex items-center gap-2">
            Delivery Tracking
          </span>
        </h2>
        <div className="flex gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleMapTheme}
            className={`p-2 rounded-full transition-colors shadow-lg ${
              mapTheme === 'dark' 
                ? 'text-yellow-300 bg-[#002000]/80 hover:bg-[#001800]/80' 
                : 'text-yellow-200 bg-green-800/80 hover:bg-green-700/80'
            }`}
            title={`Switch to ${mapTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mapTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
      <div className="absolute top-20 left-4 z-10">
        <div className={`rounded-2xl p-4 shadow-2xl border backdrop-blur-xl ${
          mapTheme === 'dark' 
            ? 'bg-gradient-to-br from-[#002000]/80 to-[#001800]/80 border-lime-400/30' 
            : 'bg-[linear-gradient(301deg,rgba(8,137,54,0.6)_0%,rgba(0,44,16,0.6)_50%)] backdrop-blur-md border-lime-300/30'
        }`}>
          <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              mapTheme === 'dark' ? 'bg-yellow-400 animate-pulse' : 'bg-yellow-300'
            }`}></div>
            <h3 className={`font-bold text-lg ${
              mapTheme === 'dark' ? 'text-yellow-100' : 'text-yellow-100'
            }`}>Rider #{riderId.slice(0, 8)}</h3>
          </div>
          
          <div className="flex items-center text-sm mb-2">
            <GiPathDistance className={`mr-2 ${
              mapTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-200'
            }`} />
            <span className={mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-200'}>
              {riderLocation ? `${(riderLocation.distanceTo(sender) / 1000).toFixed(1)} km away` : 'Calculating...'}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className={`mr-2 w-4 h-4 ${
              mapTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-200'
            }`} />
            <span className={mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-200'}>
              {estimatedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Luxury Status Panel - Fixed height and z-index */}
      <div
        ref={panelRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 backdrop-blur-2xl
          rounded-t-3xl shadow-[0_-20px_50px_-10px_rgba(0,30,0,0.7)]
          transition-all duration-300 ease-out
          ${isPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}
          ${mapTheme === 'dark' 
            ? 'bg-gradient-to-t from-[#001a00]/95 to-[#001200]/95 border-t border-yellow-400/30' 
            : 'bg-[linear-gradient(301deg,rgba(8,137,54,0.6)_0%,rgba(0,44,16,0.6)_50%)] backdrop-blur-md border-t border-yellow-300/30'}
        `}
        style={{ height: `${panelHeight}px` }}
      >
        {/* Draggable Handle */}
        <div 
          className="drag-handle absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 rounded-full cursor-row-resize touch-none"
          style={{ backgroundColor: mapTheme === 'dark' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(251, 191, 36, 0.5)' }}
        >
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2" 
               style={{ color: mapTheme === 'dark' ? '#fde68a' : '#fde68a' }}>
            <FaChevronUp />
          </div>
        </div>

        <div className="pt-8 h-full flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-100 mb-1">Delivery Tracking</h2>
            <p className="text-sm" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>Premium Express Service</p>
          </div>

          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-800 to-emerald-600 rounded-full border-2 border-yellow-300 flex items-center justify-center text-white shadow-lg">
                <span className="font-bold">MR</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-emerald-900"></div>
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-yellow-100">{riderInfo.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-300">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14px" height="14px" className={i < 4 ? "text-yellow-400" : "text-gray-500"}>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs ml-2" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>{riderInfo.rating}</span>
              </div>
            </div>
            <div className="ml-auto rounded-lg px-3 py-2" style={{ backgroundColor: mapTheme === 'dark' ? 'rgba(0, 32, 0, 0.3)' : 'rgba(0, 100, 0, 0.3)' }}>
              <span className="text-sm" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>{riderInfo.vehicle}</span>
            </div>
          </div>
          
          <div className="mb-6" style={{ backgroundColor: mapTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '16px' }}>
            <div className="h-2 rounded-full" style={{ backgroundColor: mapTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)' }}>
              <div className="h-full rounded-full" style={{ width: '40%', background: 'linear-gradient(90deg, #10b981, #047857)' }}></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>Picked up</span>
              <span className="text-xs" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>In transit</span>
              <span className="text-xs" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>Delivered</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-center">
              <div className="text-white font-light">Estimated</div>
              <div className="font-serif text-xl" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>{estimatedTime}</div>
            </div>
            
            <div className="flex space-x-3">
              <button className={`p-3 rounded-xl transition-all duration-300 hover:shadow-xl ${
                mapTheme === 'dark' 
                  ? 'bg-[#002000]/80 border border-yellow-400/30 hover:bg-[#001800]/80' 
                  : 'bg-green-800/80 border border-yellow-300/30 hover:bg-green-700/80'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px" className="text-yellow-300">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </button>
              <button className={`p-3 rounded-xl transition-all duration-300 hover:shadow-xl ${
                mapTheme === 'dark' 
                  ? 'bg-[#002000]/80 border border-yellow-400/30 hover:bg-[#001800]/80' 
                  : 'bg-green-800/80 border border-yellow-300/30 hover:bg-green-700/80'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px" className="text-yellow-300">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </button>
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
              ? 'linear-gradient(to right, rgba(0, 32, 0, 0.9), rgba(0, 24, 0, 0.9))' 
              : 'linear-gradient(to right, rgba(0, 100, 0, 0.9), rgba(0, 80, 0, 0.9))',
            color: 'white'
          }}
        >
          <FaChevronUp className="text-lg" />
        </button>
      )}
    </div>
  );
    }
