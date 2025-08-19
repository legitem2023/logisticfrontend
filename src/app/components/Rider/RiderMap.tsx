'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { showToast } from '../../../../utils/toastify'; 
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { SENDNOTIFICATION } from "../../../../graphql/mutation"; 
import { useMutation, useSubscription } from "@apollo/client";
import { LocationTracking } from '../../../../graphql/subscription';
import { FaMotorcycle, FaBox, FaMapMarkerAlt, FaCrown } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { MdCancel, MdCheckCircle } from 'react-icons/md';

type Coordinates = {
  lat: number;
  lng: number;
}

export default function RiderMap({ PickUpCoordinates, DropOffCoordinates, deliveryId, senderId }: { 
  PickUpCoordinates: Coordinates,
  DropOffCoordinates: Coordinates,
  deliveryId: any,
  senderId: any 
}) {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Tracking state
  const [acceptancePoint, setAcceptancePoint] = useState<L.LatLng | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
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
  const [status, setStatus] = useState<'pending' | 'cancelled' | 'finished' | null>(null);
  const [showPanel, setShowPanel] = useState(false);

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

  // Premium SVG icons with golden accents
  const riderIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute -top-1 -right-1 text-yellow-500 z-10">
          <FaCrown />
        </div>
        <div class="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-full border-2 border-yellow-500 flex items-center justify-center text-yellow-500">
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
      <div class="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full border-2 border-white flex items-center justify-center text-white">
        <FaBox class="text-xl" />
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  
  const receiverIcon = L.divIcon({
    html: `
      <div class="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full border-2 border-white flex items-center justify-center text-white">
        <FaMapMarkerAlt class="text-xl" />
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

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

    // Premium map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);
    
    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    
    // Add markers
    L.marker(rider, { icon: riderIcon }).bindPopup('<div class="font-bold text-yellow-600">Premium Rider</div>').addTo(map);
    L.marker(sender, { icon: senderIcon }).bindPopup('<div class="font-bold text-blue-600">Pickup Point</div>').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('<div class="font-bold text-green-600">Delivery Point</div>').addTo(map);

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
            color: '#f59e0b', 
            weight: 5,
            opacity: 0.7
          }]
        }
      } as any).addTo(mapRef.current!);

      routingRef.current = routingControl;
    });

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div
        ref={mapContainerRef}
        id="map"
        className="w-full h-full absolute top-0 z-0"
      />

      {/* Premium Control Panel */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 shadow-2xl border border-gray-700">
          <div className="flex items-center mb-3">
            <div className="bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
            <h3 className="text-white font-bold text-lg">Delivery #{deliveryId.slice(0, 8)}</h3>
          </div>
          
          <div className="flex items-center text-sm text-gray-300 mb-2">
            <GiPathDistance className="mr-2 text-yellow-500" />
            <span>{progressRef.current.totalDistance ? `${(progressRef.current.totalDistance / 1000).toFixed(1)} km` : 'Calculating...'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <FaMotorcycle className="mr-2 text-yellow-500" />
            <span>{estimatedTime ? `~${estimatedTime} min` : 'Estimating...'}</span>
          </div>
        </div>
      </div>

      {/* Luxury Status Panel */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 pt-6
          bg-gradient-to-t from-gray-900 to-black
          border-t border-yellow-600/50
          rounded-t-3xl shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.8)]
          transition-transform duration-700 ease-in-out
          ${showPanel ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="text-center mb-6">
          <div className="h-1 w-24 bg-yellow-600/60 mx-auto rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-white mb-1">Delivery Status</h2>
          <p className="text-sm text-gray-400">Premium Express Service</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setStatus('finished')}
            className={`
              flex items-center justify-center gap-2 py-4 rounded-xl
              bg-gradient-to-r from-green-700 to-green-900
              text-white font-semibold shadow-lg
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
              focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              border border-green-500/30
              ${status === 'finished' ? 'ring-2 ring-green-500' : ''}
            `}>
            <MdCheckCircle className="text-xl" />
            Mark Delivered
          </button>
          
          <button
            onClick={() => setStatus('cancelled')}
            className={`
              flex items-center justify-center gap-2 py-4 rounded-xl
              bg-gradient-to-r from-red-700 to-red-900
              text-white font-semibold shadow-lg
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
              focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              border border-red-500/30
              ${status === 'cancelled' ? 'ring-2 ring-red-500' : ''}
            `}>
            <MdCancel className="text-xl" />
            Cancel Delivery
          </button>
        </div>

        {status && (
          <div className="mt-6 flex justify-center">
            <span className={`
              px-4 py-2 rounded-full text-sm font-medium
              ${
                status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 
                status === 'cancelled' ? 'bg-red-900/80 text-red-200' : 
                'bg-green-900/80 text-green-200'
              }
            `}>
              {status === 'pending' ? '🔄 Processing update...' : 
               status === 'cancelled' ? '❌ Delivery cancelled' : 
               '✅ Delivery completed'}
            </span>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Pickup location</span>
            <span className="text-yellow-500">Premium</span>
            <span>Delivery location</span>
          </div>
        </div>
      </div>
    </div>
  );
                }
