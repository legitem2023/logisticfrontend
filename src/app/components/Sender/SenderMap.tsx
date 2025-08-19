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

type Coordinates = {
  lat: number;
  lng: number;
}

// Luxury green color palette
const COLORS = {
  primary: '#065f46',     // emerald-900
  secondary: '#047857',   // emerald-800
  accent: '#10b981',      // emerald-500
  gold: '#d4af37',        // gold accent
  dark: '#022c22',        // emerald-950
  light: '#d1fae5',       // emerald-100
  gray: '#374151'         // gray-700
};

export default function SenderMap({ riderId, receiverPOS, senderPOS, riderPOS }: { riderId: any, receiverPOS: Coordinates, senderPOS: Coordinates, riderPOS: Coordinates }) {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: riderId },
  });

  const location = useSelector((state: any) => state.location.current);
  const globalUserId = useSelector(selectTempUserId);
  const [status, setStatus] = useState<'pending' | 'cancelled' | 'finished' | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('15-20 min');
  const [riderInfo, setRiderInfo] = useState({ name: 'Michael Rodriguez', rating: '4.9', vehicle: 'Premium Bike' });

  const sender = L.latLng(senderPOS.lat, senderPOS.lng);
  const receiver = L.latLng(receiverPOS.lat, receiverPOS.lng);

  const riderLocation = locationData?.LocationTracking
    ? L.latLng(locationData.LocationTracking.latitude, locationData.LocationTracking.longitude)
    : L.latLng(location?.latitude, location?.longitude);

  // Premium marker icons with luxury green styling
  const riderIcon = L.divIcon({
    html: `
      <div class="luxury-marker rider-marker">
        <div class="marker-pulse"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.accent}" width="28px" height="28px">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const senderIcon = L.divIcon({
    html: `
      <div class="luxury-marker sender-marker">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.accent}" width="28px" height="28px">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
        </svg>
        <div class="marker-label">Pickup</div>
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const receiverIcon = L.divIcon({
    html: `
      <div class="luxury-marker receiver-marker">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${COLORS.accent}" width="28px" height="28px">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <div class="marker-label">Delivery</div>
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with elegant dark theme
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(sender, 13);

    mapRef.current = map;

    // Add elegant dark map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add custom zoom controls
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add markers with elegant styling
    L.marker(riderLocation, { icon: riderIcon }).bindPopup('Rider Location').addTo(map);
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
          styles: [
            { color: COLORS.accent, opacity: 0.8, weight: 5 },
            { color: COLORS.accent, opacity: 0.3, weight: 9 }
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0
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

    // Show panel after slight delay for animation effect
    setTimeout(() => setShowPanel(true), 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      routingRef.current?.remove();
      routingRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden luxury-delivery-container">
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, zIndex: 0 }}
      />
      
      {/* Luxury Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-emerald-950 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="luxury-logo mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={COLORS.accent} width="24px" height="24px">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-xl font-serif font-light text-white">Premium Delivery</h1>
          </div>
          <div className="bg-emerald-900 bg-opacity-50 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20px" height="20px">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Luxury Bottom Panel */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 transition-transform duration-500 ${showPanel ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
        <div className="luxury-panel">
          <div className="panel-handle"></div>
          
          <div className="flex items-center mb-6">
            <div className="relative">
              <div className="rider-avatar">
                <span>MR</span>
              </div>
              <div className="online-indicator"></div>
            </div>
            <div className="ml-4">
              <h3 className="rider-name">{riderInfo.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < 4 ? COLORS.accent : COLORS.gray} width="14px" height="14px">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-emerald-300 ml-2">{riderInfo.rating}</span>
              </div>
            </div>
            <div className="ml-auto bg-emerald-900 bg-opacity-30 rounded-lg px-3 py-2">
              <span className="text-emerald-300 text-sm">{riderInfo.vehicle}</span>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-emerald-300">Picked up</span>
              <span className="text-xs text-emerald-300">In transit</span>
              <span className="text-xs text-emerald-300">Delivered</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-center">
              <div className="text-white font-light">Estimated</div>
              <div className="text-emerald-300 font-serif text-xl">{estimatedTime}</div>
            </div>
            
            <div className="flex space-x-3">
              <button className="luxury-button secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20px" height="20px">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </button>
              <button className="luxury-button secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20px" height="20px">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </button>
              <button className="luxury-button primary">
                Track Package
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .luxury-delivery-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .luxury-panel {
          background: rgba(6, 78, 59, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid ${COLORS.accent};
          border-radius: 24px 24px 0 0;
          padding: 24px;
          color: white;
          box-shadow: 0 -10px 30px rgba(6, 78, 59, 0.3);
        }
        
        .panel-handle {
          width: 40px;
          height: 4px;
          background: ${COLORS.accent};
          border-radius: 2px;
          margin: 0 auto 16px auto;
          opacity: 0.7;
        }
        
        .luxury-marker {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          position: relative;
        }
        
        .rider-marker {
          background: rgba(16, 185, 129, 0.2);
          border: 2px solid ${COLORS.accent};
          width: 50px;
          height: 50px;
        }
        
        .sender-marker, .receiver-marker {
          background: rgba(6, 78, 59, 0.9);
          border: 2px solid ${COLORS.accent};
          width: 44px;
          height: 44px;
        }
        
        .marker-label {
          position: absolute;
          bottom: -20px;
          font-size: 10px;
          color: white;
          background: ${COLORS.primary};
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          border: 1px solid ${COLORS.accent};
        }
        
        .marker-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: ${COLORS.accent};
          border-radius: 50%;
          opacity: 0;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          70% {
            transform: scale(2);
            opacity: 0;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .rider-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary});
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          border: 2px solid ${COLORS.accent};
        }
        
        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid ${COLORS.dark};
          border-radius: 50%;
        }
        
        .rider-name {
          font-weight: 600;
          color: white;
          margin: 0;
        }
        
        .progress-container {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
        }
        
        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.secondary});
          border-radius: 3px;
        }
        
        .luxury-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        
        .luxury-button.primary {
          background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary});
          color: white;
          padding: 12px 20px;
        }
        
        .luxury-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .luxury-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .text-gold-accent {
          color: ${COLORS.accent};
        }
        
        .luxury-logo {
          background: ${COLORS.accent};
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotate(-10deg);
        }
      `}</style>
    </div>
  );
      }
