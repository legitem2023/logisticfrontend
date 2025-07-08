'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AddressSearchMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([14.5995, 120.9842], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Handle click to reverse geocode
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();

      if (data.display_name) {
        setAddress(data.display_name);
        setCoordinates({ lat, lng });
        updateMarker(lat, lng);
      }
    });
  }, []);

  // Move marker
  const updateMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }

    mapRef.current.setView([lat, lng], 15);
  };

  // Geocode address on keyup
  const handleAddressChange = async (value: string) => {
    setAddress(value);
    if (!value || value.length < 3) return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=1`
    );
    const results = await response.json();
    if (results && results.length > 0) {
      const { lat, lon } = results[0];
      setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
      updateMarker(parseFloat(lat), parseFloat(lon));
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <input
        type="text"
        value={address}
        onChange={(e) => handleAddressChange(e.target.value)}
        className="w-full p-4 text-lg border-b focus:outline-none"
        placeholder="Search for an address..."
      />

      <div
        ref={mapContainerRef}
        id="map"
        style={{ flex: 1 }}
        className="w-full h-full"
      ></div>
    </div>
  );
}
