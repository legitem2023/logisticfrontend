'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export default function DeliveryMap() {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const sender = L.latLng(14.5995, 120.9842);   // Manila
  const receiver = L.latLng(14.8874, 120.3666); // Pampanga

  const senderIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/891/891462.png', // 📦 box icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  const receiverIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png', // 📍 location pin
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

    return () => {
      window.removeEventListener('resize', handleResize);
      routingRef.current?.remove();
      routingRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [sender, receiver]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{
        width: '100%',
        height: '90vh',
        maxHeight: '90dvh',
        position: 'relative',
        zIndex: 0,
      }}
    />
  );
}
