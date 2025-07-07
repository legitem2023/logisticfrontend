'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

export default function DeliveryMap() {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const sender = L.latLng(14.5995, 120.9842);
  const receiver = L.latLng(14.8874, 120.3666);

  const senderIcon = L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHYgpRPaXFg8x_RiFJXQRSXfxzmP8Ci1E18Q&s',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const receiverIcon = L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8ctukBNdRmOgtQjXzS2YP55ik9J2YtXFZg&s',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(sender, 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add markers
    L.marker(sender, { icon: senderIcon }).bindPopup('Rider').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('Dropzone').addTo(map);

    // Lazy-load and add routing control
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
      routingControl.addTo(mapRef.current);
    });

    // Cleanup on unmount
    return () => {
      if (routingRef.current) {
        routingRef.current.remove();
        routingRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} id="map" style={{ width: '100%', height: '500px',zIndex:'-1' }} />;
}
