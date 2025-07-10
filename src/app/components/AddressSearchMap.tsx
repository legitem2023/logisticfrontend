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
type DropOffLocation = { 
  id: string; 
  coords: Coords; 
  address: string;
  houseUnit: string;
  receiver: string;
  contactNumber: string;
};

function SetMapView({ coords }: { coords: Coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lng], 13);
  }, [coords, map]);
  return null;
}

export default function AddressSearchMap() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  
  const [dropOffSearch, setDropOffSearch] = useState('');
  const [dropOffSuggestions, setDropOffSuggestions] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<DropOffLocation[]>([]);
  
  const [showMap, setShowMap] = useState(false);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const mapRef = useRef<L.Map | null>(null);
  const routingControl = useRef<L.Routing.Control | null>(null);
  
  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [tempDropOff, setTempDropOff] = useState<{coords: Coords, address: string} | null>(null);
  const [houseUnit, setHouseUnit] = useState('');
  const [receiver, setReceiver] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Load from localStorage on initial render
  useEffect(() => {
    const savedDropOffs = localStorage.getItem('dropOffLocations');
    if (savedDropOffs) {
      try {
        setDropOffLocations(JSON.parse(savedDropOffs));
      } catch (e) {
        console.error('Failed to parse saved drop-offs', e);
      }
    }
  }, []);

  // Save to localStorage whenever dropOffLocations change
  useEffect(() => {
    localStorage.setItem('dropOffLocations', JSON.stringify(dropOffLocations));
  }, [dropOffLocations]);

  // Handle pickup location search
  const handlePickupSearch = async (query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setPickupSuggestions(data);
    } catch (err) {
      console.error('Pickup search error:', err);
    }
  };

  // Handle drop-off location search
  const handleDropOffSearch = async (query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setDropOffSuggestions(data);
    } catch (err) {
      console.error('Drop-off search error:', err);
    }
  };

  const handleSelectPickupSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const newCoords = { lat, lng, address: suggestion.display_name };
    setSelectedCoords(newCoords);
    setPickupAddress(suggestion.display_name);
    setPickupSuggestions([]);
    setShowMap(true);
  };

  const handleSelectDropOffSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      
      if (data?.display_name) {
        setTempDropOff({
          coords: { lat, lng },
          address: data.display_name
        });
        setShowPopup(true);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      
      if (data?.display_name) {
        setTempDropOff({
          coords: { lat, lng },
          address: data.display_name
        });
        setShowPopup(true);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const handleAddDropOff = () => {
    if (!tempDropOff || !houseUnit || !receiver || !contactNumber) return;
    
    const newLocation: DropOffLocation = {
      id: Date.now().toString(),
      coords: tempDropOff.coords,
      address: tempDropOff.address,
      houseUnit,
      receiver,
      contactNumber
    };
    
    setDropOffLocations(prev => [...prev, newLocation]);
    resetPopup();
  };

  const resetPopup = () => {
    setShowPopup(false);
    setHouseUnit('');
    setReceiver('');
    setContactNumber('');
    setTempDropOff(null);
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
          setPickupAddress(data?.display_name || 'Current Location');
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
    <div className="relative max-w-md mx-auto p-4 bg-white space-y-4">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {/* Drop-off Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full h-1/2 rounded-t-lg p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Add Drop-off Location</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House/Unit Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={houseUnit}
                  onChange={(e) => setHouseUnit(e.target.value)}
                  placeholder="e.g., 123A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md"
                  onClick={resetPopup}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md disabled:opacity-50"
                  onClick={handleAddDropOff}
                  disabled={!houseUnit || !receiver || !contactNumber}
                >
                  Add Drop-off
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Pickup Location Input */}
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
            value={pickupAddress}
            placeholder="Search for pickup address..."
            onChange={(e) => {
              const val = e.target.value;
              setPickupAddress(val);
              if (val.length > 2) handlePickupSearch(val);
            }}
          />
          <div className="absolute left-2 top-9 text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {pickupSuggestions.length > 0 && (
          <ul className="border border-gray-300 rounded-md bg-white max-h-60 overflow-y-auto">
            {pickupSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectPickupSuggestion(suggestion)}
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
              
              {/* Drop-off Search Input */}
              <div className="relative mb-3">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pl-8"
                  value={dropOffSearch}
                  placeholder="Search for drop-off address..."
                  onChange={(e) => {
                    const val = e.target.value;
                    setDropOffSearch(val);
                    if (val.length > 2) handleDropOffSearch(val);
                  }}
                />
                <div className="absolute left-2 top-2.5 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {dropOffSuggestions.length > 0 && (
                <ul className="border border-gray-300 rounded-md bg-white max-h-60 overflow-y-auto mb-3">
                  {dropOffSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex flex-row"
                      onClick={() => handleSelectDropOffSuggestion(suggestion)}
                    >
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}

              {dropOffLocations.length === 0 && (
                <div className="text-sm text-gray-500 mb-2">
                  Click on the map or search above to add drop-off locations
                </div>
              )}

              {dropOffLocations.map((location, index) => (
                <div key={location.id} className="mb-3 p-3 bg-gray-50 rounded-md border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-800 text-xs font-medium mr-2">
                          {index + 1}
                        </span>
                        {location.receiver}
                      </div>
                      <div className="text-sm mt-1">
                        <div>{location.address}</div>
                        <div>Unit: {location.houseUnit}</div>
                        <div>Contact: {location.contactNumber}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeDropOffLocation(location.id)}
                      className="text-red-500 hover:text-red-700 mt-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
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
              style={{ height: '400px', width: '100%', zIndex: '0' }}
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
    </div>
  );
             }
