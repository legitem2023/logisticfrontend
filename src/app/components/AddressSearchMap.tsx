'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

export default function AddressSearchMap() {
  const [address, setAddress] = useState('');
  const [_coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null); // use `_coordinates` to avoid lint error

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Search address when user types
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (address.trim() !== '') {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              const latLng = L.latLng(parseFloat(lat), parseFloat(lon));
              mapRef.current?.setView(latLng, 14);

              if (markerRef.current) {
                markerRef.current.setLatLng(latLng);
              } else {
                markerRef.current = L.marker(latLng).addTo(mapRef.current!);
              }

              setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
            }
          })
          .catch((err) => console.error('Geocoding failed:', err));
      }
    }, 500); // debounce keyup

    return () => clearTimeout(delayDebounce);
  }, [address]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([14.5995, 120.9842], 10);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map);
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch (err) {
        console.error('Reverse geocoding failed:', err);
      }
    });

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="p-4 text-lg border border-gray-300 focus:outline-none focus:ring w-full"
        placeholder="Search for address or click on the map"
      />
      <div ref={mapContainerRef} className="flex-1" />
    </div>
  );
}
