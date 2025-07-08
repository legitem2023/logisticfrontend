'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function AddressSearchMap() {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showMap, setShowMap] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Debounced live search suggestions
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (address.trim() !== '') {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
          .then((res) => res.json())
          .then((data: Suggestion[]) => {
            setSuggestions(data.slice(0, 5)); // Limit to top 5 suggestions
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [address]);

  // When user selects a suggestion
  const handleSuggestionSelect = (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    const latLng = L.latLng(lat, lon);

    setAddress(suggestion.display_name);
    setCoordinates({ lat, lng: lon });
    setSuggestions([]);
    setShowMap(true);

    if (mapRef.current) {
      mapRef.current.setView(latLng, 16);
      if (markerRef.current) {
        markerRef.current.setLatLng(latLng);
      } else {
        markerRef.current = L.marker(latLng).addTo(mapRef.current);
      }
    }
  };

  // Initialize map + handle click
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([14.5995, 120.9842], 11);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
      setShowMap(true);

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map);
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
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
    <div className="w-full h-screen p-4 flex flex-col">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring w-full"
        placeholder="Search for a pickup or drop-off point"
      />

      {/* Live Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-200 shadow rounded mt-1 max-h-40 overflow-y-auto z-10">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionSelect(s)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      {showMap && (
        <div ref={mapContainerRef} className="flex-1 mt-4 rounded border border-gray-300" />
      )}

      {coordinates && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
