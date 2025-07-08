'use client';

import React, { useEffect, useRef, useState } from 'react';
import L, { LatLng } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

type Coords = { lat: number; lng: number };

function SetMapView({ coords }: { coords: Coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
}

export default function AddressSearchMap() {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);

  const handleSearch = async (query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setSelectedCoords({ lat, lng });
    setAddress(suggestion.display_name);
    setSuggestions([]);
    setShowMap(true);
  };

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setSelectedCoords({ lat, lng });
    setShowMap(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      console.log('Reverse geocoded address:', data);
      if (data && data.display_name) {
        setAddress(data.display_name);
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  useEffect(() => {
    if (!selectedCoords || !mapRef.current) return;

    if (routingControl.current) {
      routingControl.current.setWaypoints([
        L.latLng(selectedCoords.lat, selectedCoords.lng),
        L.latLng(selectedCoords.lat, selectedCoords.lng),
      ]);
    } else {
      routingControl.current = L.Routing.control({
        waypoints: [
          L.latLng(selectedCoords.lat, selectedCoords.lng),
          L.latLng(selectedCoords.lat, selectedCoords.lng),
        ],
        createMarker: () => null,
        routeWhileDragging: false,
        addWaypoints: false,
        show: false,
      }).addTo(mapRef.current);
    }
  }, [selectedCoords]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });
        setShowMap(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          console.log('Initial reverse geocode:', data);
          if (data?.display_name) {
            setAddress(data.display_name);
          }
        } catch (err) {
          console.error('Initial reverse geocoding error:', err);
        }
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className="space-y-4">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        value={address}
        placeholder="Search for an address..."
        onChange={(e) => {
          const val = e.target.value;
          setAddress(val);
          if (val.length > 2) handleSearch(val);
        }}
      />
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 rounded-md bg-white max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}

      {showMap && selectedCoords && (
        <MapContainer
          center={selectedCoords}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
            mapInstance.on('click', handleMapClick);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={selectedCoords} />
          <SetMapView coords={selectedCoords} />
        </MapContainer>
      )}
    </div>
  );
}
