// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import { MapPin, ChevronDown, ChevronUp, X, LocateFixed } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { setDropoffDetails, setPickupDetails } from '../../../Redux/deliverySlice';

// type Coords = { lat: number; lng: number; address?: string };
// type LocationDetails = { 
//   id: string; 
//   coords: Coords; 
//   address: string;
//   houseUnit: string;
//   contactName: string;
//   contactNumber: string;
// };

// export default function AddressSearchMap() {
//   // State variables
//   const dispatch = useDispatch();

//   dispatch(setPickupDetails({
//     address: '123 Rizal St.',
//     latitude: 14.6,
//     longitude: 120.98,
//     contact: 'Pedro Penduko',
//     houseNumber: '45',
//     unitNumber: '3B',
//   }))

//   dispatch(setDropoffDetails({
//     address: '123 Rizal St.',
//     latitude: 14.6,
//     longitude: 120.98,
//     contact: 'Pedro Penduko',
//     houseNumber: '45',
//     unitNumber: '3B',
//   }))
//   const [pickupSearch, setPickupSearch] = useState('');
//   const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
//   const [pickupLocation, setPickupLocation] = useState<LocationDetails | null>(null);
//   const [showPickupPopup, setShowPickupPopup] = useState(false);
//   const [tempPickup, setTempPickup] = useState<{coords: Coords, address: string} | null>(null);
  
//   const [dropOffSearch, setDropOffSearch] = useState('');
//   const [dropOffSuggestions, setDropOffSuggestions] = useState<any[]>([]);
//   const [dropOffLocations, setDropOffLocations] = useState<LocationDetails[]>([]);
//   const [showDropOffPopup, setShowDropOffPopup] = useState(false);
//   const [tempDropOff, setTempDropOff] = useState<{coords: Coords, address: string} | null>(null);
  
//   const [houseUnit, setHouseUnit] = useState('');
//   const [contactName, setContactName] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
  
//   const [showPickupDropdown, setShowPickupDropdown] = useState(false);
//   const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
//   const [fetchingLocation, setFetchingLocation] = useState(false);
  
//   const pickupInputRef = useRef<HTMLInputElement>(null);
//   const dropOffInputRef = useRef<HTMLInputElement>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Load/save locations
//   useEffect(() => {
//     const savedPickup = localStorage.getItem('pickupLocation');
//     const savedDropOffs = localStorage.getItem('dropOffLocations');
//     if (savedPickup) setPickupLocation(JSON.parse(savedPickup));
//     if (savedDropOffs) setDropOffLocations(JSON.parse(savedDropOffs));
//   }, []);

//   useEffect(() => {
//     if (pickupLocation) localStorage.setItem('pickupLocation', JSON.stringify(pickupLocation));
//     localStorage.setItem('dropOffLocations', JSON.stringify(dropOffLocations));
//   }, [pickupLocation, dropOffLocations]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowPickupDropdown(false);
//         setShowDropoffDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Search function
//   const handleSearch = async (query: string, isPickup: boolean) => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
//       );
//       const data = await res.json();
//       isPickup ? setPickupSuggestions(data) : setDropOffSuggestions(data);
//     } catch (err) {
//       console.error('Search error:', err);
//     }
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return null;
//     }

//     setFetchingLocation(true);
    
//     try {
//       const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       });

//       const { latitude, longitude } = position.coords;
//       const address = await reverseGeocode(latitude, longitude);
//       return { lat: latitude, lng: longitude, address };
//     } catch (error) {
//       console.error("Location error:", error);
//       alert("Could not get your location. Please enable permissions.");
//       return null;
//     } finally {
//       setFetchingLocation(false);
//     }
//   };

//   // Reverse geocode coordinates
//   const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//       );
//       const data = await res.json();
//       return data.display_name || 'Current Location';
//     } catch (err) {
//       console.error('Reverse geocoding error:', err);
//       return 'Current Location';
//     }
//   };

//   // Handle selection of location suggestion
//   const handleSelectSuggestion = async (suggestion: any, isPickup: boolean) => {
//     const address = suggestion.display_name;
    
//     // Auto-fill the search input
//     if (isPickup) {
//       setPickupSearch(address);
//     } else {
//       setDropOffSearch(address);
//     }

//     const lat = parseFloat(suggestion.lat);
//     const lng = parseFloat(suggestion.lon);
    
//     if (isPickup) {
//       setTempPickup({ coords: { lat, lng }, address });
//       setShowPickupPopup(true);
//     } else {
//       setTempDropOff({ coords: { lat, lng }, address });
//       setShowDropOffPopup(true);
//     }
    
//     isPickup ? setShowPickupDropdown(false) : setShowDropoffDropdown(false);
//   };

//   // Add new location
//   const addLocation = (isPickup: boolean) => {
//     const tempLocation = isPickup ? tempPickup : tempDropOff;
//     if (!tempLocation || !houseUnit || !contactName || !contactNumber) return;

//     const newLocation: LocationDetails = {
//       id: Date.now().toString(),
//       coords: tempLocation.coords,
//       address: tempLocation.address,
//       houseUnit,
//       contactName,
//       contactNumber
//     };

//     if (isPickup) {
//       setPickupLocation(newLocation);
//       setPickupSearch(newLocation.address); // Auto-fill after confirmation
//     } else {
//       setDropOffLocations(prev => [...prev, newLocation]);
//       setDropOffSearch(newLocation.address); // Auto-fill after confirmation
//     }
    
//     resetForm();
//   };

//   // Reset form
//   const resetForm = () => {
//     setHouseUnit('');
//     setContactName('');
//     setContactNumber('');
//     setTempPickup(null);
//     setTempDropOff(null);
//     setShowPickupPopup(false);
//     setShowDropOffPopup(false);
//   };

//   // Format address display
//   const formatAddressDisplay = (address: string) => {
//     if (!address) return '';
//     const parts = address.split(',');
//     return `${parts[0]}${parts[1] ? ', ' + parts[1] : ''}`;
//   };

//   // Render location popup
//   const renderLocationPopup = (isPickup: boolean) => {
//     const title = isPickup ? "Pickup" : "Drop-off";
//     const tempLocation = isPickup ? tempPickup : tempDropOff;
    
//     return (
//       <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//         <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-bold">Add {title} Location</h3>
//             <button onClick={resetForm} className="text-gray-500">
//               <X size={20} />
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Address
//               </label>
//               <div className="p-3 bg-gray-50 rounded-md">
//                 {tempLocation?.address}
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 House/Unit Number
//               </label>
//               <input 
//                 type="text" 
//                 className="w-full border border-gray-300 rounded-md px-3 py-2" 
//                 value={houseUnit} 
//                 onChange={(e) => setHouseUnit(e.target.value)} 
//                 placeholder="e.g., 123A" 
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {isPickup ? "Sender" : "Receiver"} Name
//               </label>
//               <input 
//                 type="text" 
//                 className="w-full border border-gray-300 rounded-md px-3 py-2" 
//                 value={contactName} 
//                 onChange={(e) => setContactName(e.target.value)} 
//                 placeholder="Full name" 
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Contact Number
//               </label>
//               <input 
//                 type="tel" 
//                 className="w-full border border-gray-300 rounded-md px-3 py-2" 
//                 value={contactNumber} 
//                 onChange={(e) => setContactNumber(e.target.value)} 
//                 placeholder="e.g., +1 (555) 123-4567" 
//               />
//             </div>

//             <button 
//               className={`w-full ${isPickup ? 'bg-green-500' : 'bg-blue-500'} text-white py-2 rounded-md disabled:opacity-50`} 
//               onClick={() => addLocation(isPickup)}
//               disabled={!houseUnit || !contactName || !contactNumber}
//             >
//               Confirm {title}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render dropdown with current location button
//   const renderDropdown = (isPickup: boolean) => {
//     const suggestions = isPickup ? pickupSuggestions : dropOffSuggestions;
//     const searchValue = isPickup ? pickupSearch : dropOffSearch;
//     const setSearchValue = isPickup ? setPickupSearch : setDropOffSearch;
//     const inputRef = isPickup ? pickupInputRef : dropOffInputRef;

//     return (
// <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg
//                 md:static md:mt-0 md:rounded-md md:w-auto
//                 fixed inset-0 m-0 rounded-none w-screen h-screen md:h-auto md:z-100">
//         <div className="p-2">
//           <input
//             type="text"
//             ref={inputRef}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
//             placeholder={`Search ${isPickup ? 'pickup' : 'drop-off'} location...`}
//             value={searchValue}
//             onChange={(e) => {
//               const val = e.target.value;
//               setSearchValue(val);
//               if (val.length > 2) handleSearch(val, isPickup);
//             }}
//           />
          
//           <button
//             className="w-full flex items-center p-2 mb-2 text-sm text-blue-500 hover:bg-gray-100 rounded-md"
//             onClick={async () => {
//               const location = await getCurrentLocation();
//               if (location) {
//                 handleSelectSuggestion({
//                   lat: location.lat,
//                   lon: location.lng,
//                   display_name: location.address || 'Current Location'
//                 }, isPickup);
//               }
//             }}
//             disabled={fetchingLocation}
//           >
//             <LocateFixed className="w-4 h-4 mr-2" />
//             {fetchingLocation ? 'Detecting your location...' : 'Use Current Location'}
//           </button>

//           <div className="max-h-60 overflow-y-auto">
//             {suggestions.map((suggestion, idx) => (
//               <div
//                 key={idx}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => handleSelectSuggestion(suggestion, isPickup)}
//               >
//                 <p className="text-sm">{suggestion.display_name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="relative max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
//       <h2 className="text-xl font-bold mb-6">📦 Create Delivery</h2>

//       {showPickupPopup && renderLocationPopup(true)}
//       {showDropOffPopup && renderLocationPopup(false)}

//       <div className="space-y-2" ref={dropdownRef}>
//         {/* Pickup Location */}
//         <div className="relative">
//           <div className="flex items-start">
//             <div className="flex-1">
//               <label className="flex flex-row items-center text-sm font-medium text-gray-500 mb-1">
//               <MapPin className="w-4 h-4 text-green-800" /> Pickup Location
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
//                 value={pickupSearch}
//                 placeholder="Search pickup location..."
//                 onChange={(e) => {
//                   const val = e.target.value;
//                   setPickupSearch(val);
//                   if (val.length > 2) handleSearch(val, true);
//                 }}
//                 onFocus={() => {
//                   setShowPickupDropdown(true);
//                   setShowDropoffDropdown(false);
//                 }}
//               />
//               {showPickupDropdown && renderDropdown(true)}
//             </div>
//           </div>
//         </div>

//         {/* Drop-off Location */}
//         <div className="relative">
//           <div className="flex items-start">
//             <div className="flex-1">
//               <label className="flex flex-row items-center text-sm font-medium text-gray-500 mb-1">
//               <MapPin className="w-4 h-4 text-red-800" /> Drop-off Location
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
//                 value={dropOffSearch}
//                 placeholder="Search drop-off location..."
//                 onChange={(e) => {
//                   const val = e.target.value;
//                   setDropOffSearch(val);
//                   if (val.length > 2) handleSearch(val, false);
//                 }}
//                 onFocus={() => {
//                   setShowDropoffDropdown(true);
//                   setShowPickupDropdown(false);
//                 }}
//               />
//               {showDropoffDropdown && renderDropdown(false)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin, ChevronDown, ChevronUp, X, LocateFixed } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setPickupDetails, 
  setDropoffDetails
} from '../../../Redux/deliverySlice';

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
  const dispatch = useDispatch();
  const deliveryState = useSelector((state: any) => state.delivery);

  // State variables
  const [pickupSearch, setPickupSearch] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [pickupLocation, setPickupLocation] = useState<LocationDetails | null>(null);
  const [showPickupPopup, setShowPickupPopup] = useState(false);
  const [tempPickup, setTempPickup] = useState<{coords: Coords, address: string} | null>(null);
  console.log(deliveryState);
  
  const [dropOffSearch, setDropOffSearch] = useState('');
  const [dropOffSuggestions, setDropOffSuggestions] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<LocationDetails[]>([]);
  const [showDropOffPopup, setShowDropOffPopup] = useState(false);
  const [tempDropOff, setTempDropOff] = useState<{coords: Coords, address: string} | null>(null);
  
  const [houseUnit, setHouseUnit] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropOffInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load initial data from Redux
  useEffect(() => {
    if (deliveryState.pickup) {
      setPickupSearch(deliveryState.pickup.address);
    }
    if (deliveryState.dropoff) {
      setDropOffSearch(deliveryState.dropoff.address);
    }
  }, [deliveryState]);

  // Load/save locations
  useEffect(() => {
    const savedPickup = localStorage.getItem('pickupLocation');
    const savedDropOffs = localStorage.getItem('dropOffLocations');
    if (savedPickup) setPickupLocation(JSON.parse(savedPickup));
    if (savedDropOffs) setDropOffLocations(JSON.parse(savedDropOffs));
  }, []);

  useEffect(() => {
    if (pickupLocation) localStorage.setItem('pickupLocation', JSON.stringify(pickupLocation));
    localStorage.setItem('dropOffLocations', JSON.stringify(dropOffLocations));
  }, [pickupLocation, dropOffLocations]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPickupDropdown(false);
        setShowDropoffDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  const handleSearch = async (query: string, isPickup: boolean) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      isPickup ? setPickupSuggestions(data) : setDropOffSuggestions(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return null;
    }

    setFetchingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      return { lat: latitude, lng: longitude, address };
    } catch (error) {
      console.error("Location error:", error);
      alert("Could not get your location. Please enable permissions.");
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

  // Handle selection of location suggestion
  const handleSelectSuggestion = async (suggestion: any, isPickup: boolean) => {
    const address = suggestion.display_name;
    
    // Auto-fill the search input
    if (isPickup) {
      setPickupSearch(address);
    } else {
      setDropOffSearch(address);
    }

    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    if (isPickup) {
      setTempPickup({ coords: { lat, lng }, address });
      setShowPickupPopup(true);
    } else {
      setTempDropOff({ coords: { lat, lng }, address });
      setShowDropOffPopup(true);
    }
    
    isPickup ? setShowPickupDropdown(false) : setShowDropoffDropdown(false);
  };

  // Add new location
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
      setPickupSearch(newLocation.address);
      
      // Dispatch to Redux
      dispatch(setPickupDetails({
        address: newLocation.address,
        latitude: newLocation.coords.lat,
        longitude: newLocation.coords.lng,
        contact: newLocation.contactName,
        houseNumber: newLocation.houseUnit,
        unitNumber: newLocation.houseUnit
      }));
    } else {
      setDropOffLocations(prev => [...prev, newLocation]);
      setDropOffSearch(newLocation.address);
      
      // Dispatch to Redux
      dispatch(setDropoffDetails({
        address: newLocation.address,
        latitude: newLocation.coords.lat,
        longitude: newLocation.coords.lng,
        contact: newLocation.contactName,
        houseNumber: newLocation.houseUnit,
        unitNumber: newLocation.houseUnit
      }));
    }
    
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setHouseUnit('');
    setContactName('');
    setContactNumber('');
    setTempPickup(null);
    setTempDropOff(null);
    setShowPickupPopup(false);
    setShowDropOffPopup(false);
  };

  // Render location popup
  const renderLocationPopup = (isPickup: boolean) => {
    const title = isPickup ? "Pickup" : "Drop-off";
    const tempLocation = isPickup ? tempPickup : tempDropOff;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Add {title} Location</h3>
            <button onClick={resetForm} className="text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {tempLocation?.address}
              </div>
            </div>

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

            <button 
              className={`w-full ${isPickup ? 'bg-green-500' : 'bg-blue-500'} text-white py-2 rounded-md disabled:opacity-50`} 
              onClick={() => addLocation(isPickup)}
              disabled={!houseUnit || !contactName || !contactNumber}
            >
              Confirm {title}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render dropdown with current location button
  const renderDropdown = (isPickup: boolean) => {
    const suggestions = isPickup ? pickupSuggestions : dropOffSuggestions;
    const searchValue = isPickup ? pickupSearch : dropOffSearch;
    const setSearchValue = isPickup ? setPickupSearch : setDropOffSearch;
    const inputRef = isPickup ? pickupInputRef : dropOffInputRef;

    return (
      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="p-2">
          <input
            type="text"
            ref={inputRef}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
            placeholder={`Search ${isPickup ? 'pickup' : 'drop-off'} location...`}
            value={searchValue}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              if (val.length > 2) handleSearch(val, isPickup);
            }}
          />
          
          <button
            className="w-full flex items-center p-2 mb-2 text-sm text-blue-500 hover:bg-gray-100 rounded-md"
            onClick={async () => {
              const location = await getCurrentLocation();
              if (location) {
                handleSelectSuggestion({
                  lat: location.lat,
                  lon: location.lng,
                  display_name: location.address || 'Current Location'
                }, isPickup);
              }
            }}
            disabled={fetchingLocation}
          >
            <LocateFixed className="w-4 h-4 mr-2" />
            {fetchingLocation ? 'Detecting your location...' : 'Use Current Location'}
          </button>

          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion, isPickup)}
              >
                <p className="text-sm">{suggestion.display_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">📦 Create Delivery</h2>

      {showPickupPopup && renderLocationPopup(true)}
      {showDropOffPopup && renderLocationPopup(false)}

      <div className="space-y-2" ref={dropdownRef}>
        {/* Pickup Location */}
        <div className="relative">
          <div className="flex items-start">
            <div className="flex-1">
              <label className="flex flex-row items-center text-sm font-medium text-gray-500 mb-1">
                <MapPin className="w-4 h-4 text-green-800" /> Pickup Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
                value={pickupSearch}
                placeholder="Search pickup location..."
                onChange={(e) => {
                  const val = e.target.value;
                  setPickupSearch(val);
                  if (val.length > 2) handleSearch(val, true);
                }}
                onFocus={() => {
                  setShowPickupDropdown(true);
                  setShowDropoffDropdown(false);
                }}
              />
              {showPickupDropdown && renderDropdown(true)}
            </div>
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="relative">
          <div className="flex items-start">
            <div className="flex-1">
              <label className="flex flex-row items-center text-sm font-medium text-gray-500 mb-1">
                <MapPin className="w-4 h-4 text-red-800" /> Drop-off Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
                value={dropOffSearch}
                placeholder="Search drop-off location..."
                onChange={(e) => {
                  const val = e.target.value;
                  setDropOffSearch(val);
                  if (val.length > 2) handleSearch(val, false);
                }}
                onFocus={() => {
                  setShowDropoffDropdown(true);
                  setShowPickupDropdown(false);
                }}
              />
              {showDropoffDropdown && renderDropdown(false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}