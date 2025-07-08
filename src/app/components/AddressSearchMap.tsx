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
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<L.LatLng | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<L.LatLng | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<Suggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<Suggestion[]>([]);
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const dropoffMarker = useRef<L.Marker | null>(null);
  const routingControl = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([14.5995, 120.9842], 11);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
  }, []);

  // Live search for pickup/dropoff
  useEffect(() => {
    const query = activeInput === 'pickup' ? pickupAddress : dropoffAddress;
    const setter = activeInput === 'pickup' ? setPickupSuggestions : setDropoffSuggestions;

    if (!query.trim()) {
      setter([]);
      return;
    }

    const debounce = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
        .then((res) => res.json())
        .then((data: Suggestion[]) => {
          setter(data.slice(0, 5));
        })
        .catch(() => setter([]));
    }, 300);

    return () => clearTimeout(debounce);
  }, [pickupAddress, dropoffAddress, activeInput]);

  // Select from suggestions
  const handleSuggestionSelect = async (s: Suggestion) => {
    const latLng = L.latLng(parseFloat(s.lat), parseFloat(s.lon));

    if (activeInput === 'pickup') {
      setPickupAddress(s.display_name);
      setPickupCoords(latLng);
      setPickupSuggestions([]);
      if (pickupMarker.current) pickupMarker.current.setLatLng(latLng);
      else pickupMarker.current = L.marker(latLng).addTo(mapRef.current!);
    } else if (activeInput === 'dropoff') {
      setDropoffAddress(s.display_name);
      setDropoffCoords(latLng);
      setDropoffSuggestions([]);
      if (dropoffMarker.current) dropoffMarker.current.setLatLng(latLng);
      else dropoffMarker.current = L.marker(latLng).addTo(mapRef.current!);
    }

    mapRef.current?.setView(latLng, 15);
  };

  // Draw route if both are set
  useEffect(() => {
    if (pickupCoords && dropoffCoords && mapRef.current) {
      if (routingControl.current) {
        routingControl.current.setWaypoints([pickupCoords, dropoffCoords]);
      } else {
        routingControl.current = L.Routing.control({
          waypoints: [pickupCoords, dropoffCoords],
          show: false,
          addWaypoints: false,
          draggableWaypoints: false,
          routeWhileDragging: false,
        }).addTo(mapRef.current);
      }
    }
  }, [pickupCoords, dropoffCoords]);

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const coords = L.latLng(lat, lng);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const displayName = data?.display_name || 'Current location';

          if (activeInput === 'pickup') {
            setPickupAddress(displayName);
            setPickupCoords(coords);
            if (pickupMarker.current) pickupMarker.current.setLatLng(coords);
            else pickupMarker.current = L.marker(coords).addTo(mapRef.current!);
          } else if (activeInput === 'dropoff') {
            setDropoffAddress(displayName);
            setDropoffCoords(coords);
            if (dropoffMarker.current) dropoffMarker.current.setLatLng(coords);
            else dropoffMarker.current = L.marker(coords).addTo(mapRef.current!);
          }

          mapRef.current?.setView(coords, 15);
        } catch (err) {
          alert('Failed to reverse geocode location');
        }
      },
      (err) => {
        alert('Location access denied or unavailable');
      }
    );
  };

  return (
    <div className="w-full h-screen p-4 flex flex-col">
      {/* Input Fields */}
      <input
        type="text"
        value={pickupAddress}
        onFocus={() => setActiveInput('pickup')}
        onChange={(e) => setPickupAddress(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring w-full mb-2"
        placeholder="Pickup location"
      />
      <input
        type="text"
        value={dropoffAddress}
        onFocus={() => setActiveInput('dropoff')}
        onChange={(e) => setDropoffAddress(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring w-full mb-2"
        placeholder="Drop-off location"
      />

      {/* 📍 Use Current Location Button */}
      {activeInput && (
        <button
          onClick={handleUseCurrentLocation}
          className="text-blue-600 underline text-sm mb-2 w-fit"
        >
          📍 Use current location for {activeInput}
        </button>
      )}

      {/* Suggestions */}
      {(activeInput === 'pickup' && pickupSuggestions.length > 0) ||
      (activeInput === 'dropoff' && dropoffSuggestions.length > 0) ? (
        <ul className="bg-white border border-gray-300 rounded shadow mt-1 max-h-40 overflow-y-auto z-10">
          {(activeInput === 'pickup' ? pickupSuggestions : dropoffSuggestions).map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionSelect(s)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Map */}
      <div ref={mapContainerRef} className="flex-1 mt-4 rounded border border-gray-300" />

      {/* Coordinates Display */}
      <div className="mt-2 text-sm text-gray-600 space-y-1">
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
