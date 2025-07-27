'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { showToast } from '../../../../utils/toastify'; 
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';

type Coordinates = {
  lat: number;
  lng: number;
}

export default function SenderMap({ receiverPOS, riderPOS }: { receiverPOS: Coordinates, riderPOS:Coordinates }) {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
  const location = useSelector((state: any) => state.location.current);
  const globalUserId = useSelector(selectTempUserId);
  const [status, setStatus] = useState<'pending' | 'cancelled' | 'finished' | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  
  const sender = L.latLng(riderPOS.lat, riderPOS.lng);
  const receiver = L.latLng(receiverPOS.lat, receiverPOS.lng);

  const senderIcon = L.icon({
    iconUrl: '/Bike.svg',
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

    L.marker(sender, { icon: senderIcon }).bindPopup('📦 Pickup Point').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('📍 Delivery Point').addTo(map);

    import('leaflet-routing-machine').then(() => {
      if (!mapRef.current) return;

      const routingControl = L.Routing.control({
        waypoints: [sender, receiver],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        show: false,
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
    </div>
  );
}
