'use client';

import React, { useEffect, useState } from 'react';

type Coords = { lat: number; lng: number; address?: string };
type DropOffLocation = { 
  id: string; 
  coords: Coords; 
  address: string;
  houseUnit: string;
  receiver: string;
  contactNumber: string;
};

export default function AddressSearchMap() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  
  const [dropOffSearch, setDropOffSearch] = useState('');
  const [dropOffSuggestions, setDropOffSuggestions] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<DropOffLocation[]>([]);
  
  const [showPopup, setShowPopup] = useState(false);
  const [tempDropOff, setTempDropOff] = useState<{coords: Coords, address: string} | null>(null);
  const [houseUnit, setHouseUnit] = useState('');
  const [receiver, setReceiver] = useState('');
  const [contactNumber, setContactNumber] = useState('');

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

  useEffect(() => {
    localStorage.setItem('dropOffLocations', JSON.stringify(dropOffLocations));
  }, [dropOffLocations]);

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

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white space-y-4">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center h-[100vh]">
          <div className="fixed bottom-0 bg-white w-full h-1/2 rounded-t-lg p-4 overflow-y-auto z-50">
            <h3 className="text-lg font-bold mb-4">Add Drop-off Location</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House/Unit Number</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" value={houseUnit} onChange={(e) => setHouseUnit(e.target.value)} placeholder="e.g., 123A" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Full name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="e.g., +1 (555) 123-4567" />
              </div>

              <div className="flex space-x-3 pt-2">
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md" onClick={resetPopup}>Cancel</button>
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-md disabled:opacity-50" onClick={handleAddDropOff} disabled={!houseUnit || !receiver || !contactNumber}>Add Drop-off</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          value={pickupAddress}
          placeholder="Search for pickup address..."
          onChange={(e) => {
            const val = e.target.value;
            setPickupAddress(val);
            if (val.length > 2) handlePickupSearch(val);
          }}
        />
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

      {/* Drop-off Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          value={dropOffSearch}
          placeholder="Search for drop-off address..."
          onChange={(e) => {
            const val = e.target.value;
            setDropOffSearch(val);
            if (val.length > 2) handleDropOffSearch(val);
          }}
        />
      </div>

      {dropOffSuggestions.length > 0 && (
        <ul className="border border-gray-300 rounded-md bg-white max-h-60 overflow-y-auto">
          {dropOffSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectDropOffSuggestion(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Drop-off List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Drop-offs</h3>
        {dropOffLocations.length === 0 && (
          <p className="text-sm text-gray-500">No drop-off locations yet.</p>
        )}
        {dropOffLocations.map((loc, index) => (
          <div key={loc.id} className="mb-3 p-3 bg-gray-50 rounded-md border">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{loc.receiver}</p>
                <p className="text-sm">{loc.address}</p>
                <p className="text-sm">Unit: {loc.houseUnit}</p>
                <p className="text-sm">Contact: {loc.contactNumber}</p>
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={() => removeDropOffLocation(loc.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
