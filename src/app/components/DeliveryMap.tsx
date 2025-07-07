'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

export default function DeliveryMap() {
  const mapRef = useRef<L.Map | null>(null);
  const routingRef = useRef<any>(null);
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
    // Prevent reinitialization
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(sender, 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker(sender, { icon: senderIcon }).bindPopup('Rider').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('Dropzone').addTo(map);

    import('leaflet-routing-machine').then(() => {
      routingRef.current = L.Routing.control({
        waypoints: [sender, receiver],
        // @ts-expect-error - not typed in leaflet-routing-machine
        createMarker: () => null,
      }).addTo(map);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [sender, receiver]);

  return <div ref={mapContainerRef} id="map" style={{ height: '500px' }} />;
}
