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

//import { useSubscription } from '@apollo/client';
import { LocationTracking } from '../../../../graphql/subscription'; // update with correct path

import { useMutation, useQuery, useSubscription } from "@apollo/client"; 
type Coordinates = {
  lat: number;
  lng: number;
}

export default function RiderMap({ PickUpCoordinates,DropOffCoordinates,deliveryId,senderId }: { PickUpCoordinates:Coordinates,DropOffCoordinates: Coordinates,deliveryId:any,senderId:any }) {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
const [sendNotification] = useMutation(SENDNOTIFICATION,{
   onCompleted: () => showToast("Notification sent", "success"),
   onError: (e: any) => console.log('Finished Error', e)
  })
  
  const location = useSelector((state: any) => state.location.current);
  const globalUserId = useSelector(selectTempUserId);
  const [status, setStatus] = useState<'pending' | 'cancelled' | 'finished' | null>(null);
  const [showPanel, setShowPanel] = useState(false);


const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: globalUserId },
  });

  const handleNotification = (message:any) =>{
    sendNotification({
      variables:{
        userID: senderId, 
        title: message, 
        message: message, 
        type: 'Notification Message'
      }
    })
  }
  
  const rider = locationData?.LocationTracking
  ? L.latLng(locationData.LocationTracking.latitude, locationData.LocationTracking.longitude)
  : L.latLng(location?.latitude, location?.longitude); // fallback

  const sender = L.latLng(PickUpCoordinates?.lat, PickUpCoordinates?.lng);   // Manila
  const receiver = L.latLng(DropOffCoordinates.lat, DropOffCoordinates.lng); // Quezon City

  const riderIcon = L.icon({
    iconUrl: '/Bike.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  const senderIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });
  
  const receiverIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(sender, 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    
    L.marker(rider, { icon: riderIcon }).bindPopup('Rider Point').addTo(map);
    L.marker(sender, { icon: senderIcon }).bindPopup('📦 Pickup Point').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('📍 Delivery Point').addTo(map);

    import('leaflet-routing-machine').then(() => {
      if (!mapRef.current) return;

      const routingControl = L.Routing.control({
        waypoints: [rider, sender, receiver],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        show:false,
      } as any).addTo(mapRef.current!);

      routingRef.current = routingControl;
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
    <div className="relative w-full h-screen overflow-hidden">
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, zIndex: 0 }}
      />

      {/* Sliding Panel */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 pt-5
          backdrop-blur-xl bg-white/60 dark:bg-black/40 border-t border-white/20
          rounded-t-2xl shadow-2xl transition-transform duration-500
          ${showPanel ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="text-center mb-4">
          <div className="h-1.5 w-12 bg-gray-400/50 mx-auto rounded-full mb-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Delivery Status</h2>
          <p className="text-xs text-gray-500">Update the delivery below.</p>
        </div>

        <div className="flex justify-between gap-3">
          <button
            className="flex-1 bg-yellow-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl shadow-lg transition-all focus:ring-2 focus:ring-green-300">
            Failed Attemp
          </button>
        </div>

        {status && (
          <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-4">
            Current status: <span className="font-semibold capitalize">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
