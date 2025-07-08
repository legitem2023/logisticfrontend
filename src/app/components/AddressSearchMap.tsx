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

export default function AddressSearchMap() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const mapRef = useRef<L.Map | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const dropoffMarker = useRef<L.Marker | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Debounced search
  useEffect(() => {
    const query = activeField === 'pickup' ? pickup : dropoff;
    const delay = setTimeout(() => {
      if (query.trim() !== '') {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
          .then((res) => res.json())
          .then((data: Suggestion[]) => setSuggestions(data.slice(0, 5)))
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [pickup, dropoff, activeField]);

  // Handle suggestion click
  const handleSelect = (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const coords = { lat, lng };
    const label = suggestion.display_name;

    if (activeField === 'pickup') {
      setPickup(label);
      setPickupCoords(coords);
      if (pickupMarker.current) {
        pickupMarker.current.setLatLng(coords);
      } else {
        pickupMarker.current = L.marker(coords, { icon: blueIcon }).addTo(mapRef.current!);
      }
      mapRef.current?.setView(coords, 14);
    } else if (activeField === 'dropoff') {
      setDropoff(label);
      setDropoffCoords(coords);
      if (dropoffMarker.current) {
        dropoffMarker.current.setLatLng(coords);
      } else {
        dropoffMarker.current = L.marker(coords, { icon: redIcon }).addTo(mapRef.current!);
      }
      mapRef.current?.setView(coords, 14);
    }

    setSuggestions([]);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([14.5995, 120.9842], 10);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
  }, []);

  // Draw route when both coords are available
  useEffect(() => {
    if (pickupCoords && dropoffCoords && mapRef.current) {
      if (routingControl.current) {
        routingControl.current.setWaypoints([pickupCoords, dropoffCoords]);
      } else {
        routingControl.current = L.Routing.control({
          waypoints: [pickupCoords, dropoffCoords],
          routeWhileDragging: false,
          show: false,
        }).addTo(mapRef.current);
      }
    }
  }, [pickupCoords, dropoffCoords]);

  // Custom marker icons
  const blueIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <input
        type="text"
        value={pickup}
        onFocus={() => setActiveField('pickup')}
        onChange={(e) => setPickup(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded mb-2"
        placeholder="Enter pickup location"
      />

      <input
        type="text"
        value={dropoff}
        onFocus={() => setActiveField('dropoff')}
        onChange={(e) => setDropoff(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded mb-2"
        placeholder="Enter drop-off location"
      />

      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-300 shadow rounded z-10 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="p-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <div ref={mapContainerRef} className="flex-1 mt-4 rounded border border-gray-300" />

      <div className="mt-2 text-sm text-gray-700 space-y-1">
        {pickupCoords && (
          <div>
            <strong>Pickup:</strong> {pickupCoords.lat.toFixed(6)}, {pickupCoords.lng.toFixed(6)}
          </div>
        )}
        {dropoffCoords && (
          <div>
            <strong>Drop-off:</strong> {dropoffCoords.lat.toFixed(6)}, {dropoffCoords.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
}
