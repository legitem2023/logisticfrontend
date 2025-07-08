'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

// Define custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const dropOffIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

type Coords = { lat: number; lng: number; address?: string };
type DropOffLocation = { id: string; coords: Coords; address: string };

function SetMapView({ coords }: { coords: Coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lng], 13);
  }, [coords, map]);
  return null;
}

export default function AddressSearchMap() {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  const [dropOffLocations, setDropOffLocations] = useState<DropOffLocation[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [totalDistance, setTotalDistance] = useState<number>(0);
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

  const handleSelectSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const newCoords = { lat, lng, address: suggestion.display_name };
    setSelectedCoords(newCoords);
    setAddress(suggestion.display_name);
    setSuggestions([]);
    setShowMap(true);
  };

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      
      if (data?.display_name) {
        const newLocation = {
          id: Date.now().toString(),
          coords: { lat, lng },
          address: data.display_name
        };
        
        setDropOffLocations(prev => [...prev, newLocation]);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const removeDropOffLocation = (id: string) => {
    setDropOffLocations(prev => prev.filter(loc => loc.id !== id));
  };

  useEffect(() => {
    if (!selectedCoords || !mapRef.current) return;

    const waypoints = [L.latLng(selectedCoords.lat, selectedCoords.lng)];
    
    // Add all drop-off locations to waypoints
    dropOffLocations.forEach(loc => {
      waypoints.push(L.latLng(loc.coords.lat, loc.coords.lng));
    });

    // If no drop-off locations, add pickup location again to avoid errors
    if (dropOffLocations.length === 0) {
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

    // Calculate total distance
    if (dropOffLocations.length > 0) {
      let distance = 0;
      const map = mapRef.current;
      
      // Distance from pickup to first drop-off
      distance += map.distance(
        [selectedCoords.lat, selectedCoords.lng],
        [dropOffLocations[0].coords.lat, dropOffLocations[0].coords.lng]
      );

      // Distances between drop-off points
      for (let i = 1; i < dropOffLocations.length; i++) {
        distance += map.distance(
          [dropOffLocations[i-1].coords.lat, dropOffLocations[i-1].coords.lng],
          [dropOffLocations[i].coords.lat, dropOffLocations[i].coords.lng]
        );
      }

      setTotalDistance(distance);
    } else {
      setTotalDistance(0);
    }
  }, [selectedCoords, dropOffLocations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setSelectedCoords({ 
            lat: latitude, 
            lng: longitude,
            address: data?.display_name || 'Current Location'
          });
          setAddress(data?.display_name || 'Current Location');
          setShowMap(true);
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
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Pickup Location
          </span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 pl-8"
          value={address}
          placeholder="Search for pickup address..."
          onChange={(e) => {
            const val = e.target.value;
            setAddress(val);
            if (val.length > 2) handleSearch(val);
          }}
        />
        <div className="absolute left-2 top-9 text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Drop-off Locations
              </span>
            </label>
            
            {dropOffLocations.length === 0 && (
              <div className="text-sm text-gray-500 mb-2">
                Click on the map to add drop-off locations
              </div>
            )}

            {dropOffLocations.map((location, index) => (
              <div key={location.id} className="flex items-center mb-2 p-2 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-800 text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span className="text-sm">{location.address}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeDropOffLocation(location.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}

            {totalDistance > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Total distance: {(totalDistance / 1000).toFixed(2)} km
              </div>
            )}
          </div>

          <MapContainer
            center={[selectedCoords.lat, selectedCoords.lng]}
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
            {selectedCoords && (
              <Marker 
                position={[selectedCoords.lat, selectedCoords.lng]} 
                icon={pickupIcon}
              />
            )}
            {dropOffLocations.map(location => (
              <Marker
                key={location.id}
                position={[location.coords.lat, location.coords.lng]}
                icon={dropOffIcon}
              />
            ))}
            <SetMapView coords={selectedCoords} />
          </MapContainer>
        </>
      )}
    </div>
  );
         }
