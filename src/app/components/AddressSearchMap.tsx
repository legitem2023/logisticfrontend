'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

type Coords = { lat: number; lng: number };

export default function AddressSearchMap() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Coords | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coords | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);

  // Suggestion search
  useEffect(() => {
    const keyword = activeInput === 'pickup' ? pickupAddress : dropoffAddress;
    if (!keyword.trim()) return;

    const timeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json`)
        .then((res) => res.json())
        .then((data: Suggestion[]) => setSuggestions(data.slice(0, 5)))
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [pickupAddress, dropoffAddress, activeInput]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([14.5995, 120.9842], 11);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        const label = data.display_name;

        if (activeInput === 'pickup') {
          setPickupCoords({ lat, lng });
          setPickupAddress(label);
        } else if (activeInput === 'dropoff') {
          setDropoffCoords({ lat, lng });
          setDropoffAddress(label);
        }
      } catch (err) {
        console.error('Reverse geocoding error:', err);
      }
    });

    return () => {
      map.off();
      map.remove();
    };
  }, []);

  // Routing update
  useEffect(() => {
    if (pickupCoords && dropoffCoords && mapRef.current) {
      const from = L.latLng(pickupCoords.lat, pickupCoords.lng);
      const to = L.latLng(dropoffCoords.lat, dropoffCoords.lng);

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng(from);
      } else {
        pickupMarkerRef.current = L.marker(from).addTo(mapRef.current).bindPopup('Pickup').openPopup();
      }

      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setLatLng(to);
      } else {
        dropoffMarkerRef.current = L.marker(to).addTo(mapRef.current).bindPopup('Drop-off').openPopup();
      }

      if (routingControl.current) {
        routingControl.current.setWaypoints([from, to]);
      } else {
        routingControl.current = L.Routing.control({
          waypoints: [from, to],
          routeWhileDragging: false,
          show: false,
        }).addTo(mapRef.current);
      }

      mapRef.current.fitBounds(L.latLngBounds([from, to]), { padding: [50, 50] });
    }
  }, [pickupCoords, dropoffCoords]);

  // Handle suggestion selection
  const handleSuggestionClick = (s: Suggestion) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    const coords = { lat, lng };

    if (activeInput === 'pickup') {
      setPickupAddress(s.display_name);
      setPickupCoords(coords);
    } else if (activeInput === 'dropoff') {
      setDropoffAddress(s.display_name);
      setDropoffCoords(coords);
    }

    setSuggestions([]);
    mapRef.current?.setView([lat, lng], 15);
  };

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-2">
      <input
        type="text"
        value={pickupAddress}
        onFocus={() => setActiveInput('pickup')}
        onChange={(e) => setPickupAddress(e.target.value)}
        className="p-3 border rounded text-sm"
        placeholder="Enter pickup location"
      />
      <input
        type="text"
        value={dropoffAddress}
        onFocus={() => setActiveInput('dropoff')}
        onChange={(e) => setDropoffAddress(e.target.value)}
        className="p-3 border rounded text-sm"
        placeholder="Enter drop-off location"
      />

      {suggestions.length > 0 && (
        <ul className="bg-white border shadow rounded text-sm z-50 max-h-40 overflow-y-auto absolute mt-1 w-full">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <div ref={mapContainerRef} className="flex-1 mt-2 rounded border" />
    </div>
  );
}
