'use client';

import React, { useEffect, useState, useRef } from 'react';

type Coords = { lat: number; lng: number; address?: string };
type LocationDetails = { 
  id: string; 
  coords: Coords; 
  address: string;
  houseUnit: string;
  contactName: string;
  contactNumber: string;
};

export default function AddressSearchMap() {
  // Pickup states
  const [pickupSearch, setPickupSearch] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [pickupLocation, setPickupLocation] = useState<LocationDetails | null>(null);
  const [showPickupPopup, setShowPickupPopup] = useState(false);
  const [tempPickup, setTempPickup] = useState<{coords: Coords, address: string} | null>(null);
  
  // Dropoff states
  const [dropOffSearch, setDropOffSearch] = useState('');
  const [dropOffSuggestions, setDropOffSuggestions] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<LocationDetails[]>([]);
  const [showDropOffPopup, setShowDropOffPopup] = useState(false);
  const [tempDropOff, setTempDropOff] = useState<{coords: Coords, address: string} | null>(null);
  
  // Shared form states
  const [houseUnit, setHouseUnit] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  // Fullscreen and location states
  const [isPickupFullScreen, setIsPickupFullScreen] = useState(false);
  const [isDropOffFullScreen, setIsDropOffFullScreen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropOffInputRef = useRef<HTMLInputElement>(null);

  // Load saved locations from localStorage
  useEffect(() => {
    const savedPickup = localStorage.getItem('pickupLocation');
    const savedDropOffs = localStorage.getItem('dropOffLocations');
    
    if (savedPickup) {
      try {
        setPickupLocation(JSON.parse(savedPickup));
      } catch (e) {
        console.error('Failed to parse saved pickup', e);
      }
    }
    
    if (savedDropOffs) {
      try {
        setDropOffLocations(JSON.parse(savedDropOffs));
      } catch (e) {
        console.error('Failed to parse saved drop-offs', e);
      }
    }
  }, []);

  // Save locations to localStorage
  useEffect(() => {
    if (pickupLocation) {
      localStorage.setItem('pickupLocation', JSON.stringify(pickupLocation));
    }
    localStorage.setItem('dropOffLocations', JSON.stringify(dropOffLocations));
  }, [pickupLocation, dropOffLocations]);

  // Focus inputs in fullscreen mode
  useEffect(() => {
    if (isPickupFullScreen && pickupInputRef.current) {
      pickupInputRef.current.focus();
    }
    if (isDropOffFullScreen && dropOffInputRef.current) {
      dropOffInputRef.current.focus();
    }
  }, [isPickupFullScreen, isDropOffFullScreen]);

  // Generic search function
  const handleSearch = async (query: string, isPickup: boolean) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      
      if (isPickup) {
        setPickupSuggestions(data);
      } else {
        setDropOffSuggestions(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
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
      console.error("Location error:", error);
      return null;
    } finally {
      setFetchingLocation(false);
    }
  };

  // Reverse geocode coordinates
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

  // Handle selection of pickup suggestion
  const handleSelectPickupSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = suggestion.display_name;
    
    setTempPickup({
      coords: { lat, lng },
      address
    });
    setShowPickupPopup(true);
    setIsPickupFullScreen(false);
  };

  // Handle selection of current location for pickup
  const handleSelectCurrentPickupLocation = async () => {
    if (!currentLocation) return;
    
    setTempPickup({
      coords: currentLocation,
      address: currentLocation.address || 'Current Location'
    });
    setShowPickupPopup(true);
    setIsPickupFullScreen(false);
  };

  // Handle selection of drop-off suggestion
  const handleSelectDropOffSuggestion = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = suggestion.display_name;
    
    setTempDropOff({
      coords: { lat, lng },
      address
    });
    setShowDropOffPopup(true);
    setIsDropOffFullScreen(false);
  };

  // Add current location to suggestions
  useEffect(() => {
    if (currentLocation) {
      const currentLocationSuggestion = { 
        display_name: '📍 Current Location', 
        lat: currentLocation.lat, 
        lon: currentLocation.lng,
        isCurrent: true
      };
      
      setPickupSuggestions(prev => [currentLocationSuggestion, ...prev]);
      setDropOffSuggestions(prev => [currentLocationSuggestion, ...prev]);
    }
  }, [currentLocation]);

  // Add new location (pickup or drop-off)
  const addLocation = (isPickup: boolean) => {
    const tempLocation = isPickup ? tempPickup : tempDropOff;
    if (!tempLocation || !houseUnit || !contactName || !contactNumber) return;

    const newLocation: LocationDetails = {
      id: Date.now().toString(),
      coords: tempLocation.coords,
      address: tempLocation.address,
      houseUnit,
      contactName,
      contactNumber
    };

    if (isPickup) {
      setPickupLocation(newLocation);
    } else {
      setDropOffLocations(prev => [...prev, newLocation]);
    }
    
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setHouseUnit('');
    setContactName('');
    setContactNumber('');
    setTempPickup(null);
    setTempDropOff(null);
    setShowPickupPopup(false);
    setShowDropOffPopup(false);
  };

  // Remove location
  const removeLocation = (id: string, isPickup: boolean) => {
    if (isPickup) {
      setPickupLocation(null);
    } else {
      setDropOffLocations(prev => prev.filter(loc => loc.id !== id));
    }
  };

  // Handle input focus
  const handleInputFocus = async (isPickup: boolean) => {
    if (isPickup) {
      setIsPickupFullScreen(true);
    } else {
      setIsDropOffFullScreen(true);
    }
    
    if (!currentLocation && !fetchingLocation) {
      await getCurrentLocation();
    }
  };

  // Render location popup
  const renderLocationPopup = (isPickup: boolean) => {
    const title = isPickup ? "Pickup" : "Drop-off";
    const tempLocation = isPickup ? tempPickup : tempDropOff;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center h-[100vh]">
        <div className="fixed bottom-0 bg-white w-full h-1/2 rounded-t-lg p-4 overflow-y-auto z-50">
          <h3 className="text-lg font-bold mb-4">Add {title} Location</h3>

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
                {isPickup ? "Sender" : "Receiver"} Name
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md px-3 py-2" 
                value={contactName} 
                onChange={(e) => setContactName(e.target.value)} 
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
                onClick={resetForm}
              >
                Cancel
              </button>
              <button 
                className={`flex-1 ${isPickup ? 'bg-green-500' : 'bg-blue-500'} text-white py-2 rounded-md disabled:opacity-50`} 
                onClick={() => addLocation(isPickup)}
                disabled={!houseUnit || !contactName || !contactNumber}
              >
                Add {title}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render fullscreen search overlay
  const renderFullscreenOverlay = (isPickup: boolean) => {
    const title = isPickup ? "Pickup" : "Drop-off";
    const searchValue = isPickup ? pickupSearch : dropOffSearch;
    const setSearchValue = isPickup ? setPickupSearch : setDropOffSearch;
    const suggestions = isPickup ? pickupSuggestions : dropOffSuggestions;
    const handleSelectSuggestion = isPickup ? 
      handleSelectPickupSuggestion : 
      handleSelectDropOffSuggestion;
    const handleCurrentLocation = isPickup ? 
      handleSelectCurrentPickupLocation : 
      () => handleSelectDropOffSuggestion({
        lat: currentLocation?.lat || 0,
        lon: currentLocation?.lng || 0,
        display_name: 'Current Location',
        isCurrent: true
      });
    const inputRef = isPickup ? pickupInputRef : dropOffInputRef;
    const setIsFullScreen = isPickup ? setIsPickupFullScreen : setIsDropOffFullScreen;

    return (
      <div className="fixed inset-0 bg-white z-50 p-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setIsFullScreen(false)}
            className="mr-2 text-gray-500 p-2"
          >
            &larr;
          </button>
          <h3 className="text-lg font-semibold">Set {title} Location</h3>
        </div>
        
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg"
            value={searchValue}
            placeholder={`Search for ${title.toLowerCase()} address...`}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              if (val.length > 2) handleSearch(val, isPickup);
            }}
          />
        </div>
        
        {suggestions.length > 0 || currentLocation ? (
          <ul className="border border-gray-300 rounded-md bg-white max-h-[70vh] overflow-y-auto">
            {currentLocation && (
              <li
                className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-center"
                onClick={handleCurrentLocation}
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
            
            {suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => handleSelectSuggestion(suggestion)}
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
              <p>Start typing to search for locations</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render location details card
  const renderLocationCard = (location: LocationDetails, isPickup: boolean) => (
    <div key={location.id} className="mb-3 p-3 bg-gray-50 rounded-md border">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">
            {isPickup ? "Pickup" : "Drop-off"}: {location.contactName}
          </p>
          <p className="text-sm">{location.address}</p>
          <p className="text-sm">Unit: {location.houseUnit}</p>
          <p className="text-sm">Contact: {location.contactNumber}</p>
        </div>
        <button
          className="text-red-500 text-sm"
          onClick={() => removeLocation(location.id, isPickup)}
        >
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white space-y-4">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {/* Pickup Popup */}
      {showPickupPopup && renderLocationPopup(true)}
      
      {/* Drop-off Popup */}
      {showDropOffPopup && renderLocationPopup(false)}
      
      {/* Full-screen Pickup Overlay */}
      {isPickupFullScreen && renderFullscreenOverlay(true)}
      
      {/* Full-screen Drop-off Overlay */}
      {isDropOffFullScreen && renderFullscreenOverlay(false)}

      {/* Normal View */}
      {!isPickupFullScreen && !isDropOffFullScreen && (
        <>
          {/* Pickup Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={pickupLocation?.address || ''}
              placeholder="Search for pickup address..."
              onFocus={() => handleInputFocus(true)}
              readOnly
            />
          </div>
          
          {/* Display saved pickup location */}
          {pickupLocation && renderLocationCard(pickupLocation, true)}
          
          {/* Drop-off Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drop-off Location
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dropOffSearch}
              placeholder="Search for drop-off address..."
              onFocus={() => handleInputFocus(false)}
              onChange={(e) => {
                const val = e.target.value;
                setDropOffSearch(val);
                if (val.length > 2) handleSearch(val, false);
              }}
            />
          </div>
          
          {/* Drop-off suggestions */}
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
          
          {/* Selected drop-offs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Selected Drop-offs
            </h3>
            {dropOffLocations.length === 0 && (
              <p className="text-sm text-gray-500">No drop-off locations yet.</p>
            )}
            {dropOffLocations.map(loc => renderLocationCard(loc, false))}
          </div>
        </>
      )}
    </div>
  );
      }
