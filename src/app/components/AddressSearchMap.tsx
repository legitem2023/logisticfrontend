'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
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
  const [dropOffAddress, setDropOffAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  const [dropOffCoords, setDropOffCoords] = useState<Coords | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
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
    const newCoords = { lat, lng };
    
    if (!selectedCoords) {
      setSelectedCoords(newCoords);
    } else {
      setDropOffCoords(newCoords);
    }
    
    setShowMap(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data?.display_name) {
        if (!selectedCoords) {
          setAddress(data.display_name);
        } else {
          setDropOffAddress(data.display_name);
        }
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  useEffect(() => {
    if (!selectedCoords || !mapRef.current) return;

    const waypoints = [];
    waypoints.push(L.latLng(selectedCoords.lat, selectedCoords.lng));
    
    if (dropOffCoords) {
      waypoints.push(L.latLng(dropOffCoords.lat, dropOffCoords.lng));
    } else {
      waypoints.push(L.latLng(selectedCoords.lat, selectedCoords.lng));
    }

    if (routingControl.current) {
      routingControl.current.setWaypoints(waypoints);
    } else {
      routingControl.current = L.Routing.control({
        waypoints,
        createMarker: () => null,
        routeWhileDragging: false,
        addWaypoints: false,
        show: false,
      } as any).addTo(mapRef.current);
    }

    // Calculate distance if we have both points
    if (dropOffCoords) {
      const distance = mapRef.current.distance(
        L.latLng(selectedCoords.lat, selectedCoords.lng),
        L.latLng(dropOffCoords.lat, dropOffCoords.lng)
      );
      setDistance(distance);
    } else {
      setDistance(null);
    }
  }, [selectedCoords, dropOffCoords]);

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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          value={address}
          placeholder="Search for pickup address..."
          onChange={(e) => {
            const val = e.target.value;
            setAddress(val);
            if (val.length > 2) handleSearch(val);
          }}
        />
      </div>

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
        <>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dropOffAddress}
              placeholder="Click on map to set drop-off location"
              readOnly
            />
            {distance && (
              <div className="mt-2 text-sm text-gray-600">
                Distance: {(distance / 1000).toFixed(2)} km
              </div>
            )}
          </div>

          <MapContainer
            center={selectedCoords}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
            ref={(mapInstance) => {
              if (mapInstance && !mapRef.current) {
                mapRef.current = mapInstance;
                mapInstance.on('click', handleMapClick);
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker position={selectedCoords} />
            {dropOffCoords && <Marker position={dropOffCoords} />}
            <SetMapView coords={selectedCoords} />
          </MapContainer>
        </>
      )}
    </div>
  );
}
