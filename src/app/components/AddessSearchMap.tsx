'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type GeoData = {
  lat: string;
  lon: string;
  display_name: string;
};

export default function AddressSearchMap() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<GeoData | null>(null);
  const [error, setError] = useState('');
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fetch coordinates from OSM Nominatim
  const handleSearch = async () => {
    setError('');
    setResult(null);

    if (!query.trim()) {
      setError('Please enter an address');
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`
      );
      const data: GeoData[] = await res.json();

      if (data.length === 0) {
        setError('Address not found');
        return;
      }

      setResult(data[0]);
    } catch (err) {
      setError('Error fetching location'+ err);
    }
  };

  // Initialize and update map
  useEffect(() => {
    if (!result || !mapContainerRef.current) return;

    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([lat, lon], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
    } else {
      markerRef.current = L.marker([lat, lon])
        .addTo(mapRef.current)
        .bindPopup(result.display_name)
        .openPopup();
    }

    mapRef.current.setView([lat, lon], 15);
  }, [result]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col items-center p-4">
      {/* Search Input */}
      <div className="w-full max-w-xl relative z-10 mb-4">
        <input
          type="text"
          placeholder="Enter address..."
          className="w-full px-4 py-3 rounded-lg shadow border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {/* Map Display */}
      {result && (
        <div
          ref={mapContainerRef}
          className="w-full flex-1 rounded-xl shadow-lg overflow-hidden"
          style={{ minHeight: '70vh', maxHeight: '100dvh', zIndex: 1 }}
        />
      )}
    </div>
  );
}
