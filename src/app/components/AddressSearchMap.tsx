'use client';

import React, { useEffect, useState, useRef } from 'react';

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
  
  const [showDropOffPopup, setShowDropOffPopup] = useState(false);
  const [tempDropOff, setTempDropOff] = useState<{coords: Coords, address: string} | null>(null);
  const [houseUnit, setHouseUnit] = useState('');
  const [receiver, setReceiver] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  // States for fullscreen and current location
  const [isPickupFullScreen, setIsPickupFullScreen] = useState(false);
  const [isDropOffFullScreen, setIsDropOffFullScreen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropOffInputRef = useRef<HTMLInputElement>(null);

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

  // Focus inputs when entering fullscreen modes
  useEffect(() => {
    if (isPickupFullScreen && pickupInputRef.current) {
      pickupInputRef.current.focus();
    }
    if (isDropOffFullScreen && dropOffInputRef.current) {
      dropOffInputRef.current.focus();
    }
  }, [isPickupFullScreen, isDropOffFullScreen]);

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

  // Get current location using browser geolocation
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    setFetchingLocation(true);
    
    try {
      const position: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      
      setCurrentLocation({
        lat: latitude,
        lng: longitude,
        address
      });
      
      return { lat: latitude, lng: longitude, address };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    } finally {
      setFetchingLocation(false);
    }
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || 'Current Location';
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return 'Current Location';
    }
  };

  const handleSelectPickupSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const newCoords = { lat, lng, address: suggestion.display_name };
    setSelectedCoords(newCoords);
    setPickupAddress(suggestion.display_name);
    setPickupSuggestions([]);
    setIsPickupFullScreen(false);
  };

  // Select current location for pickup
  const handleSelectCurrentLocation = async () => {
    if (!currentLocation) return;
    
    setSelectedCoords(currentLocation);
    setPickupAddress(currentLocation.address || 'Current Location');
    setPickupSuggestions([]);
    setIsPickupFullScreen(false);
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
        setShowDropOffPopup(true);
        setIsDropOffFullScreen(false);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  // Add current location to drop-off suggestions
  useEffect(() => {
    if (currentLocation) {
      setDropOffSuggestions(prev => [
        { 
          display_name: '📍 Current Location', 
          lat: currentLocation.lat, 
          lon: currentLocation.lng,
          isCurrent: true
        },
        ...prev
      ]);
    }
  }, [currentLocation]);

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
    setShowDropOffPopup(false);
    setHouseUnit('');
    setReceiver('');
    setContactNumber('');
    setTempDropOff(null);
  };

  const removeDropOffLocation = (id: string) => {
    setDropOffLocations(prev => prev.filter(loc => loc.id !== id));
  };

  // Fetch current location when pickup input is focused
  const handlePickupFocus = async () => {
    setIsPickupFullScreen(true);
    
    if (!currentLocation && !fetchingLocation) {
      await getCurrentLocation();
    }
  };

  // Fetch current location when drop-off input is focused
  const handleDropOffFocus = async () => {
    setIsDropOffFullScreen(true);
    
    if (!currentLocation && !fetchingLocation) {
      await getCurrentLocation();
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white space-y-4">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {/* Drop-off Details Popup */}
      {showDropOffPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center h-[100vh]">
          <div className="fixed bottom-0 bg-white w-full h-1/2 rounded-t-lg p-4 overflow-y-auto z-50">
            <h3 className="text-lg font-bold mb-4">Add Drop-off Location</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House/Unit Number</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                  value={houseUnit} 
                  onChange={(e) => setHouseUnit(e.target.value)} 
                  placeholder="e.g., 123A" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2" 
                  value={receiver} 
                  onChange={(e) => setReceiver(e.target.value)} 
                  placeholder="Full name" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
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

      {/* Full-screen Pickup Overlay */}
      {isPickupFullScreen && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setIsPickupFullScreen(false)}
              className="mr-2 text-gray-500 p-2"
            >
              &larr;
            </button>
            <h3 className="text-lg font-semibold">Set Pickup Location</h3>
          </div>
          
          <div className="relative mb-4">
            <input
              ref={pickupInputRef}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg"
              value={pickupAddress}
              placeholder="Search for pickup address..."
              onChange={(e) => {
                const val = e.target.value;
                setPickupAddress(val);
                if (val.length > 2) handlePickupSearch(val);
              }}
            />
          </div>
          
          {pickupSuggestions.length > 0 || currentLocation ? (
            <ul className="border border-gray-300 rounded-md bg-white max-h-[70vh] overflow-y-auto">
              {currentLocation && (
                <li
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-center"
                  onClick={handleSelectCurrentLocation}
                >
                  <span className="mr-2">📍</span>
                  <div>
                    <div className="font-medium">Current Location</div>
                    <div className="text-sm text-gray-600 truncate">
                      {currentLocation.address || 'Using your device location'}
                    </div>
                  </div>
                </li>
              )}
              
              {pickupSuggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleSelectPickupSuggestion(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {fetchingLocation ? (
                <p>Detecting your location...</p>
              ) : (
                <p>Start typing to search for pickup locations</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Full-screen Drop-off Overlay */}
      {isDropOffFullScreen && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setIsDropOffFullScreen(false)}
              className="mr-2 text-gray-500 p-2"
            >
              &larr;
            </button>
            <h3 className="text-lg font-semibold">Set Drop-off Location</h3>
          </div>
          
          <div className="relative mb-4">
            <input
              ref={dropOffInputRef}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg"
              value={dropOffSearch}
              placeholder="Search for drop-off address..."
              onChange={(e) => {
                const val = e.target.value;
                setDropOffSearch(val);
                if (val.length > 2) handleDropOffSearch(val);
              }}
            />
          </div>
          
          {dropOffSuggestions.length > 0 || currentLocation ? (
            <ul className="border border-gray-300 rounded-md bg-white max-h-[70vh] overflow-y-auto">
              {currentLocation && (
                <li
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-center"
                  onClick={() => handleSelectDropOffSuggestion({
                    lat: currentLocation.lat,
                    lon: currentLocation.lng,
                    display_name: 'Current Location',
                    isCurrent: true
                  })}
                >
                  <span className="mr-2">📍</span>
                  <div>
                    <div className="font-medium">Current Location</div>
                    <div className="text-sm text-gray-600 truncate">
                      {currentLocation.address || 'Using your device location'}
                    </div>
                  </div>
                </li>
              )}
              
              {dropOffSuggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleSelectDropOffSuggestion(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {fetchingLocation ? (
                <p>Detecting your location...</p>
              ) : (
                <p>Start typing to search for drop-off locations</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Normal View */}
      {!isPickupFullScreen && !isDropOffFullScreen && (
        <>
          {/* Pickup Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={pickupAddress}
              placeholder="Search for pickup address..."
              onFocus={handlePickupFocus}
              onChange={(e) => {
                const val = e.target.value;
                setPickupAddress(val);
                if (val.length > 2) handlePickupSearch(val);
              }}
            />
          </div>

          {/* Drop-off Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dropOffSearch}
              placeholder="Search for drop-off address..."
              onFocus={handleDropOffFocus}
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
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-start"
                  onClick={() => handleSelectDropOffSuggestion(suggestion)}
                >
                  {suggestion.isCurrent ? (
                    <span className="mr-2 mt-0.5">📍</span>
                  ) : null}
                  <span className={suggestion.isCurrent ? 'font-medium' : ''}>
                    {suggestion.display_name}
                  </span>
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
        </>
      )}
    </div>
  );
        }
