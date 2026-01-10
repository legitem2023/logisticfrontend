'use client';

import { Icon } from '@iconify/react';
import { showToast } from '../../../../utils/toastify';
import { getDistanceInKm } from '../../../../utils/getDistanceInKm';
import { calculateEta } from '../../../../utils/calculateEta';
import AnimatedCityscape from '../AnimatedCityscape';
import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { VEHICLEQUERY } from '../../../../graphql/query';
import { CREATEDELIVERY } from '../../../../graphql/mutation';
import Cookies from "js-cookie";
import LogisticFormLoading from '../Loadings/LogisticFormLoading';
import { useSelector, useDispatch } from "react-redux";
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { setActiveIndex } from '../../../../Redux/activeIndexSlice';

import {
  Home,
  MapPin,
  Truck,
  Rocket,
  Clock,
  Move,
  User,
  Phone,
  PlusCircle,
  X,
  CheckCircle2,
  Loader2,
  Package,
  LocateFixed,
  Route
} from 'lucide-react';
import { decryptToken } from '../../../../utils/decryptToken';
import ClassicConfirmForm from './ClassicConfirmForm';

interface Location {
  address: string;
  houseNumber: string;
  contact: string;
  name: string;
  lat: number | null;
  lng: number | null;
}

interface ActiveLocation {
  type: 'pickup' | 'dropoff';
  index: number | null;
}

interface Suggestion {
  id?: string;
  name?: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  provider?: string;
  confidence?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

// Add cache interface
interface CacheEntry {
  results: Suggestion[];
  timestamp: number;
}

const GEOCODING_CONFIG = {
  NOMINATIM: {
    baseUrl: 'https://nominatim.openstreetmap.org/search',
    reverseUrl: 'https://nominatim.openstreetmap.org/reverse',
    params: {
      format: 'json',
      addressdetails: 1,
      countrycodes: 'ph',
      'accept-language': 'en',
      bounded: 1,
      limit: 8
    }
  },
  GOOGLE: {
    baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  }
};

const LogisticsFormJoined = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(VEHICLEQUERY);

  const [createDelivery] = useMutation(CREATEDELIVERY, {
    onCompleted: (data) => {
      showToast("Delivery created", 'success');
      setsendLoading(false);
      dispatch(setActiveIndex(3));
    },
    onError: (error) => {
      console.error('Delivery creation error:', error);
      showToast("Failed to create delivery", 'error');
      setsendLoading(false);
    }
  });

  const globalUserId = useSelector(selectTempUserId);
  const deliveryDetails = useSelector((state: any) => state.delivery);
  
  // Initialize selected vehicle with the first vehicle from the query result
  const [selected, setSelected] = useState<string>(data?.getVehicleTypes[0]?.id || '');
  const [selectedVehicle, setSelectedVehicle] = useState<string>(data?.getVehicleTypes[0]?.name || '');
  const [useID, setID] = useState<string | undefined>();
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);
  const [sendLoading, setsendLoading] = useState(false);

  const toggleDetails = (vehicleId: string) => {
    setExpandedDetails(prev => (prev === vehicleId ? null : vehicleId));
  };

  // State management
  const [pickup, setPickup] = useState<Location>({
    address: '',
    houseNumber: '',
    contact: '',
    name: '',
    lat: null,
    lng: null
  });

  const [dropoffs, setDropoffs] = useState<Location[]>([{
    address: '',
    houseNumber: '',
    contact: '',
    name: '',
    lat: null,
    lng: null
  }]);

  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);
  const [useDistance, setDistance] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<string>('Regular');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [mapPreview, setMapPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [useBaseCost, setBaseCost] = useState<number | null>(data?.getVehicleTypes[0]?.cost || null);
  const [usePerKmCost, setPerKmCost] = useState<number | null>(data?.getVehicleTypes[0]?.perKmRate || null);
  const [distances, setDistances] = useState<number[]>([]);
  const [vehicleName, setvehicleName] = useState<string[]>([]);
  const [selectedSuggestionCoords, setSelectedSuggestionCoords] = useState<{lat: number, lng: number} | null>(null);
  const [typingCoordinates, setTypingCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isGeocodingTyping, setIsGeocodingTyping] = useState<boolean>(false);

  // Add address cache ref with proper typing
  const addressCache = useRef<Map<string, CacheEntry>>(new Map());

  const closeDetails = () => {
    setShowDetails(false);
  };

  // Handle input changes
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup({ ...pickup, [e.target.name]: e.target.value });
  };

  const handleDropoffChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDropoffs = [...dropoffs];
    updatedDropoffs[index] = {
      ...updatedDropoffs[index],
      [e.target.name]: e.target.value
    };
    setDropoffs(updatedDropoffs);
  };

  // Location management
  const addDropoff = () => {
    setDropoffs([...dropoffs, {
      address: '',
      houseNumber: '',
      contact: '',
      name: '',
      lat: null,
      lng: null
    }]);
  };

  const removeDropoff = (index: number) => {
    if (dropoffs.length <= 1) return;
    const updatedDropoffs = dropoffs.filter((_, i) => i !== index);
    setDropoffs(updatedDropoffs);
  };

  // Open/close location details
  const openLocationDetails = (type: 'pickup' | 'dropoff', index: number | null = null) => {
    setActiveLocation({ type, index });
    setSuggestions([]);
    setSelectedSuggestionCoords(null);
    setTypingCoordinates(null);
  };

  const closeLocationDetails = () => {
    setActiveLocation(null);
    setSuggestions([]);
    setSelectedSuggestionCoords(null);
    setTypingCoordinates(null);
  };

  // Helper function for confidence calculation
  const calculateNominatimConfidence = (result: any): string => {
    let confidence = 'low';
    
    if (result.address) {
      const hasHouseNumber = result.address.house_number || result.address.house;
      const hasStreet = result.address.road || result.address.street;
      const hasCity = result.address.city || result.address.town || result.address.village;
      
      if (hasHouseNumber && hasStreet && hasCity) {
        confidence = 'high';
      } else if ((hasHouseNumber || hasStreet) && hasCity) {
        confidence = 'medium';
      }
    }
    
    return confidence;
  };

  // Helper functions for hybrid geocoding
  const geocodeWithNominatim = async (query: string): Promise<Suggestion[]> => {
    const params = new URLSearchParams({
      q: encodeURIComponent(query),
      format: String(GEOCODING_CONFIG.NOMINATIM.params.format),
      addressdetails: String(GEOCODING_CONFIG.NOMINATIM.params.addressdetails),
      countrycodes: String(GEOCODING_CONFIG.NOMINATIM.params.countrycodes),
      'accept-language': String(GEOCODING_CONFIG.NOMINATIM.params['accept-language']),
      bounded: String(GEOCODING_CONFIG.NOMINATIM.params.bounded),
      limit: String(GEOCODING_CONFIG.NOMINATIM.params.limit)
    });

    try {
      const response = await fetch(
        `${GEOCODING_CONFIG.NOMINATIM.baseUrl}?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim geocoding failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Return data that matches the Suggestion interface
      return data.map((item: any) => ({
        id: item.place_id,
        name: item.display_name,
        formatted_address: item.display_name,
        geometry: {
          location: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          }
        },
        provider: 'nominatim',
        confidence: calculateNominatimConfidence(item),
        address: {
          street: item.address?.road || '',
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || '',
          postalCode: item.address?.postcode || ''
        }
      }));
      
    } catch (error) {
      console.error('Nominatim geocoding error:', error);
      return [];
    }
  };

  const geocodeWithGoogle = async (query: string): Promise<Suggestion[]> => {
    if (!GEOCODING_CONFIG.GOOGLE.apiKey) {
      console.warn('Google Maps API key not configured');
      return [];
    }

    const params = new URLSearchParams({
      address: encodeURIComponent(query),
      key: GEOCODING_CONFIG.GOOGLE.apiKey,
      components: 'country:PH'
    });

    const response = await fetch(
      `${GEOCODING_CONFIG.GOOGLE.baseUrl}?${params}`
    );

    if (!response.ok) {
      throw new Error('Google geocoding failed');
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google geocoding error: ${data.status}`);
    }

    return data.results.map((result: any) => ({
      formatted_address: result.formatted_address,
      geometry: {
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        }
      },
      provider: 'google',
      confidence: result.geometry.location_type === 'ROOFTOP' ? 'high' : 'medium'
    }));
  };

  const shouldFallbackToGoogle = (nominatimResults: Suggestion[], query: string): boolean => {
    if (nominatimResults.length === 0) return true;
    
    const firstResult = nominatimResults[0];
    
    const vagueTerms = ['unclassified road', 'unknown', 'unnamed'];
    if (vagueTerms.some(term => 
      firstResult.formatted_address.toLowerCase().includes(term))) {
      return true;
    }
    
    const queryWords = query.toLowerCase().split(' ');
    const addressWords = firstResult.formatted_address.toLowerCase();
    const matchCount = queryWords.filter(word => 
      addressWords.includes(word)
    ).length;
    
    if (matchCount / queryWords.length < 0.5) {
      return true;
    }
    
    return false;
  };

  // Enhanced hybrid geocoding function
  const geocodeAddress = async (query: string, provider: 'nominatim' | 'google' | 'auto' = 'auto'): Promise<Suggestion[]> => {
    if (!query || query.length < 3) {
      return [];
    }

    const cacheKey = `${provider}:${query.toLowerCase().trim()}`;
    
    if (addressCache.current.has(cacheKey)) {
      const cached = addressCache.current.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < (1000 * 60 * 60)) {
        return cached.results;
      }
    }

    setIsLoading(true);
    
    try {
      let results: Suggestion[] = [];
      
      if (provider === 'nominatim' || provider === 'auto') {
        results = await geocodeWithNominatim(query);
        
        if (provider === 'auto' && (results.length === 0 || shouldFallbackToGoogle(results, query))) {
          console.log('Falling back to Google for:', query);
          const googleResults = await geocodeWithGoogle(query);
          if (googleResults.length > 0) {
            results = googleResults;
          }
        }
      } else if (provider === 'google') {
        results = await geocodeWithGoogle(query);
      }
      
      addressCache.current.set(cacheKey, {
        results,
        timestamp: Date.now()
      });
      
      if (addressCache.current.size > 200) {
        const firstKey = addressCache.current.keys().next().value;
        addressCache.current.delete(firstKey);
      }
      
      return results;
      
    } catch (error) {
      console.error('Geocoding error:', error);
      
      if (provider !== 'auto') {
        const fallbackProvider = provider === 'nominatim' ? 'google' : 'nominatim';
        try {
          return await geocodeAddress(query, fallbackProvider);
        } catch (fallbackError) {
          console.error('Fallback geocoding also failed:', fallbackError);
        }
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Real-time geocoding while typing
  const geocodeWhileTyping = async (query: string) => {
    if (!query || query.length < 5) { // Increased minimum length for better accuracy
      setTypingCoordinates(null);
      return;
    }

    setIsGeocodingTyping(true);
    
    try {
      const results = await geocodeAddress(query, 'auto');
      
      if (results.length > 0) {
        // Get the best result (highest confidence)
        const bestResult = results.reduce((best, current) => {
          const bestScore = best.confidence === 'high' ? 3 : best.confidence === 'medium' ? 2 : 1;
          const currentScore = current.confidence === 'high' ? 3 : current.confidence === 'medium' ? 2 : 1;
          return currentScore > bestScore ? current : best;
        }, results[0]);

        setTypingCoordinates({
          lat: bestResult.geometry.location.lat,
          lng: bestResult.geometry.location.lng
        });

        // Also update the location state with coordinates
        if (activeLocation?.type === 'pickup') {
          setPickup(prev => ({
            ...prev,
            lat: bestResult.geometry.location.lat,
            lng: bestResult.geometry.location.lng
          }));
        } else if (activeLocation?.index !== null) {
          const updatedDropoffs = [...dropoffs];
          updatedDropoffs[activeLocation.index] = {
            ...updatedDropoffs[activeLocation.index],
            lat: bestResult.geometry.location.lat,
            lng: bestResult.geometry.location.lng
          };
          setDropoffs(updatedDropoffs);
        }
      } else {
        setTypingCoordinates(null);
      }
    } catch (error) {
      console.error('Real-time geocoding error:', error);
      setTypingCoordinates(null);
    } finally {
      setIsGeocodingTyping(false);
    }
  };

  // Enhanced reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number, provider: 'nominatim' | 'google' = 'nominatim'): Promise<string> => {
    const cacheKey = `reverse:${lat.toFixed(6)}:${lng.toFixed(6)}:${provider}`;
    
    if (addressCache.current.has(cacheKey)) {
      const cached = addressCache.current.get(cacheKey);
      if (cached && cached.results[0]) {
        return cached.results[0].formatted_address || '';
      }
    }

    try {
      let address = '';
      
      if (provider === 'nominatim') {
        const response = await fetch(
          `${GEOCODING_CONFIG.NOMINATIM.reverseUrl}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          address = data.display_name;
        }
      } else if (provider === 'google' && GEOCODING_CONFIG.GOOGLE.apiKey) {
        const response = await fetch(
          `${GEOCODING_CONFIG.GOOGLE.baseUrl}?latlng=${lat},${lng}&key=${GEOCODING_CONFIG.GOOGLE.apiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'OK' && data.results[0]) {
            address = data.results[0].formatted_address;
          }
        }
      }
      
      if (address) {
        addressCache.current.set(cacheKey, {
          results: [{ 
            formatted_address: address, 
            geometry: { location: { lat, lng } },
            provider,
            confidence: 'high'
          }],
          timestamp: Date.now()
        });
      }
      
      return address;
      
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return '';
    }
  };

  // Enhanced function to get current location and reverse geocode
  const getCurrentLocation = async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", 'error');
      return null;
    }

    setIsLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Try Google first for better accuracy, fallback to Nominatim
      let address = await reverseGeocode(latitude, longitude, 'google');
      if (address===null || address==="") {
        address = await reverseGeocode(latitude, longitude, 'nominatim');
      }
      
      const location: Location = {
        address: address || `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        houseNumber: '',
        contact: '',
        name: '',
        lat: latitude,
        lng: longitude
      };
      console.log('Address',location);
      return location;
      
    } catch (error: any) {
      console.error('Location error:', error);
      showToast(`Location error: ${error.message}`, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced address search with hybrid geocoding AND real-time geocoding
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (activeLocation?.type === 'pickup') {
      setPickup({ ...pickup, address: value });
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index].address = value;
      setDropoffs(updatedDropoffs);
    }

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    // Timeout for suggestions
    timeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        const results = await geocodeAddress(value, 'auto');
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 600);

    // Separate timeout for real-time geocoding (slower to avoid too many API calls)
    geocodeTimeoutRef.current = setTimeout(async () => {
      await geocodeWhileTyping(value);
    }, 1000);
  };

  const vehicleDetails = (id: string, data: any) => {
    setSelected(id);
    setBaseCost(data.cost);
    setPerKmCost(data.perKmRate);
    setvehicleName(data.name);
    setSelectedVehicle(data.name);
  }

  // Enhanced suggestion selection with provider info
  const selectSuggestion = (suggestion: Suggestion) => {
    const address = suggestion.formatted_address;

    if (activeLocation?.type === 'pickup') {
      setPickup({
        ...pickup,
        address,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      });
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index] = {
        ...updatedDropoffs[activeLocation.index],
        address,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      };
      setDropoffs(updatedDropoffs);
    }

    // Store the selected coordinates to show on map
    setSelectedSuggestionCoords({
      lat: suggestion.geometry.location.lat,
      lng: suggestion.geometry.location.lng
    });
    setTypingCoordinates(null); // Clear typing coordinates

    // Show which provider was used (optional)
    if (suggestion.provider) {
      console.log(`Used ${suggestion.provider} for geocoding with ${suggestion.confidence} confidence`);
    }
    
    setSuggestions([]);
    showToast("Address selected successfully", 'success');
  };

  // Handle current location selection
  const handleUseCurrentLocation = async () => {
    const currentLocation = await getCurrentLocation();
    
    if (currentLocation && activeLocation) {
      if (activeLocation.type === 'pickup') {
        setPickup({
          ...pickup,
          address: currentLocation.address,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          houseNumber: currentLocation.houseNumber
        });
        setSelectedSuggestionCoords({
          lat: currentLocation.lat!,
          lng: currentLocation.lng!
        });
        setTypingCoordinates(null);
      } else if (activeLocation.index !== null) {
        const updatedDropoffs = [...dropoffs];
        updatedDropoffs[activeLocation.index] = {
          ...updatedDropoffs[activeLocation.index],
          address: currentLocation.address,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          houseNumber: currentLocation.houseNumber
        };
        setDropoffs(updatedDropoffs);
        setSelectedSuggestionCoords({
          lat: currentLocation.lat!,
          lng: currentLocation.lng!
        });
        setTypingCoordinates(null);
      }
      
      showToast("Current location set successfully", 'success');
    }
  };

  // Enhanced validation with hybrid geocoding fallback
  const validateCoordinates = async (location: Location): Promise<Location | null> => {
    if (location.lat && location.lng) {
      return location;
    }

    if (location.address && location.address.length >= 3) {
      // Try hybrid geocoding to get coordinates
      const results = await geocodeAddress(location.address, 'auto');
      if (results.length > 0) {
        return {
          ...location,
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
      }
    }
    
    return null;
  };

  // Generate map preview URL
  useEffect(() => {
    if (pickup.lat && pickup.lng && dropoffs[0].lat && dropoffs[0].lng) {
      const markers = [
        `color:blue|label:P|${pickup.lat},${pickup.lng}`,
        ...dropoffs.map((dropoff, i) => `color:red|label:${i + 1}|${dropoff.lat},${dropoff.lng}`)
      ].join('&');

      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${
        Math.min(pickup.lng, ...dropoffs.map(d => d.lng || 0)) - 0.1
        },${
        Math.min(pickup.lat, ...dropoffs.map(d => d.lat || 0)) - 0.1
        },${
        Math.max(pickup.lng, ...dropoffs.map(d => d.lng || 0)) + 0.1
        },${
        Math.max(pickup.lat, ...dropoffs.map(d => d.lat || 0)) + 0.1
        }&markers=${markers}`;

      setMapPreview(url);
    }
  }, [pickup, dropoffs]);

  useEffect(() => {
    const calculateDistances = async () => {
      if (pickup.lat && pickup.lng) {
        const calculatedDistances = await Promise.all(
          dropoffs.map(async (dropoff) => {
            if (dropoff.lat && dropoff.lng) {
              try {
                return await getDistanceInKm(
                  { lat: pickup.lat, lng: pickup.lng },
                  { lat: dropoff.lat, lng: dropoff.lng }
                );
              } catch (error) {
                console.error('Error calculating distance:', error);
                return 0;
              }
            }
            return 0;
          })
        );
        setDistances(calculatedDistances);
      }
    };

    calculateDistances();
  }, [pickup.lat, pickup.lng, dropoffs]);

  // Initialize selected vehicle when data loads
  useEffect(() => {
    if (data?.getVehicleTypes?.length > 0 && !selected) {
      const firstVehicle = data.getVehicleTypes[0];
      setSelected(firstVehicle.id);
      setBaseCost(firstVehicle.cost);
      setPerKmCost(firstVehicle.perKmRate);
      setvehicleName(firstVehicle.name);
      setSelectedVehicle(firstVehicle.name);
    }
  }, [data, selected]);

  const validatePickup = (pickup: Location) => {
    if (!pickup || typeof pickup !== 'object') {
      showToast("Pickup data is missing or invalid", 'warning');
      return false;
    }

    if (!pickup.address) {
      showToast("Please enter a pickup address", 'warning');
      return false;
    }

    if (!pickup.houseNumber) {
      showToast("Please enter a house number", 'warning');
      return false;
    }

    if (!pickup.contact) {
      showToast("Please enter a contact number", 'warning');
      return false;
    }

    if (!pickup.name) {
      showToast("Please enter the sender's name", 'warning');
      return false;
    }

    if (typeof pickup.lat !== 'number') {
      showToast("Pickup latitude is missing or invalid", 'warning');
      return false;
    }

    if (typeof pickup.lng !== 'number') {
      showToast("Pickup longitude is missing or invalid", 'warning');
      return false;
    }

    return true;
  };

  const validateDropoffs = (dropoffs: Location[]) => {
    for (const [index, dropoff] of dropoffs.entries()) {
      if (!dropoff.address) {
        showToast(`Please enter a dropoff address for location #${index + 1}`, 'warning');
        return false;
      }
    }
    return true;
  };

  const validateVehicle = (selectedVehicle: string) => {
    if (!selectedVehicle) {
      showToast('Please select a vehicle type', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and get coordinates if missing
    const validatedPickup = await validateCoordinates(pickup);
    if (!validatedPickup) {
      showToast("Could not find coordinates for pickup address. Please select from suggestions or use current location.", 'warning');
      return;
    }
    
    const validatedDropoffs = await Promise.all(
      dropoffs.map(async (dropoff) => {
        const validated = await validateCoordinates(dropoff);
        if (!validated) {
          showToast(`Could not find coordinates for dropoff: ${dropoff.address}. Please select from suggestions.`, 'warning');
        }
        return validated;
      })
    );
    
    if (validatedDropoffs.includes(null)) return;
    
    // Update with validated coordinates
    const updatedPickup = validatedPickup as Location;
    const updatedDropoffs = validatedDropoffs as Location[];
    
    setPickup(updatedPickup);
    setDropoffs(updatedDropoffs);
    
    if (!validatePickup(updatedPickup)) return;
    if (!validateDropoffs(updatedDropoffs)) return;
    if (!validateVehicle(selectedVehicle)) return;
    
    setShowDetails(true);
  }

  const confirmCommand = async (selectedDriver: any) => {
    const conf = confirm("Are you sure you want to place your order?");
    if (conf) {
      setsendLoading(true);
      const today = new Date();
      const isoDateString = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
      ).toISOString();

      try {
        for (const [i, dropoff] of dropoffs.entries()) {
          const { eta, etaInMinutes } = calculateEta(parseFloat(distances[i].toFixed(2)), "Priority");

          const input = {
            assignedRiderId: null,
            deliveryFee: selectedDriver.cost,
            deliveryType: selectedService,
            dropoffAddress: dropoff.address,
            dropoffLatitude: dropoff.lat,
            dropoffLongitude: dropoff.lng,
            estimatedDeliveryTime: eta,
            eta: etaInMinutes.toString(),
            paymentMethod: "Cash",
            paymentStatus: "Unpaid",
            pickupAddress: pickup.address,
            pickupLatitude: pickup.lat,
            pickupLongitude: pickup.lng,
            recipientName: dropoff.name,
            recipientPhone: dropoff.contact,
            senderId: globalUserId,
            baseRate: parseFloat(useBaseCost?.toString() || '0'),
            distance: parseFloat(distances[i].toFixed(2)),
            perKmRate: parseFloat(usePerKmCost?.toString() || '0')
          };

          await createDelivery({ variables: { input } });
        }
      } catch (error) {
        console.error('Error creating deliveries:', error);
        showToast('Failed to create some deliveries', 'error');
      } finally {
        setsendLoading(false);
      }
    }
  }

  // Focus input when panel opens
  useEffect(() => {
    if (activeLocation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeLocation]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
    };
  }, []);

  // Service data
  const services = [
    { id: 'Priority', name: 'Priority', icon: Rocket, time: '1-3 hours', price: '10' },
    { id: 'Regular', name: 'Regular', icon: Clock, time: 'Same day', price: '5' },
    { id: 'Polling', name: 'Polling', icon: Move, time: 'Multi-day', price: '5' }
  ];

  if (loading) return <LogisticFormLoading />;
  if (error) return <p>Error: {error.message}</p>;

  // Determine which coordinates to show on map
  const showMapCoords = selectedSuggestionCoords || typingCoordinates;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white shadow-xl overflow-hidden">
        <div className="bg-green-600 customgrad text-white">
          <AnimatedCityscape>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Truck className="h-8 w-8 mr-3" />
            Express Delivery Service
          </h1>
          <p className="mt-2 opacity-90">Fast and reliable logistics solutions</p>
          </AnimatedCityscape>
        </div>

        <form onSubmit={handleSubmit} className="p-2">
          <div className="bg-green-50 p-5 rounded-xl mb-6 border border-green-100">
            <h2 className="text-lg font-semibold mb-3 flex items-center text-green-800">
              <MapPin className="h-5 w-5 mr-2" />
              Pickup Location
            </h2>
            <button
              type="button"
              onClick={() => openLocationDetails('pickup')}
              className="w-full text-left p-4 border-2 border-dashed border-green-300 rounded-xl mb-3 hover:bg-green-100 flex items-center"
            >
              {pickup.address ? (
                <span className="text-green-500 truncate flex-1">{pickup.address}</span>
              ) : (
                <span className="text-green-500 flex-1">Enter pickup address</span>
              )}
              <Home className="h-5 w-5 text-green-500 ml-2" />
            </button>
          </div>

          {/* Dropoff Sections */}
          <div className="bg-orange-50 p-5 rounded-xl mb-6 border border-orange-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold flex items-center text-orange-800">
                <MapPin className="h-5 w-5 mr-2" />
                Drop-off Locations
              </h2>
              <button
                type="button"
                onClick={addDropoff}
                className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center hover:bg-orange-600 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Dropoff
              </button>
            </div>

            {dropoffs.map((dropoff, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => openLocationDetails('dropoff', index)}
                    className="flex-1 text-left p-4 border-2 border-dashed border-orange-300 rounded-xl hover:bg-orange-100 flex items-center max-w-[100%] w-[auto]"
                  >
                    {dropoff.address ? (
                      <span className="text-orange-500 truncate flex-1">{dropoff.address}</span>
                    ) : (
                      <span className="text-orange-500 flex-1">Enter drop-off address #{index + 1}</span>
                    )}
                    <div className="bg-orange-100 text-orange-800 rounded-full px-2 py-1 text-xs ml-2">
                      #{index + 1}
                    </div>
                  </button>
                  {dropoffs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDropoff(index)}
                      className="ml-[-20px] text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Selection */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-300 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-900">
              <Truck className="h-6 w-6 mr-3 text-indigo-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Vehicle Type
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.getVehicleTypes.map((vehicle: any) => {
                const isSelected = selected === vehicle.id;
                const showDetailss = expandedDetails === vehicle.id;
                return (
                  <div key={vehicle.id} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'border-indigo-500 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}>
                    <div
                      onClick={() => vehicleDetails(vehicle.id, vehicle)}
                      className={`relative w-full text-left p-5 flex items-center gap-5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                    >
                      {/* Premium check icon */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                          <Icon icon="mdi:check" className="text-sm" />
                        </div>
                      )}

                      <div className="p-2 bg-white rounded-lg shadow-inner">
                        <Icon 
                          icon={vehicle.icon} 
                          className="text-indigo-600" 
                          style={{ height: '42px', width: '42px' }} 
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-900">{vehicle.name}</p>
                        <p className="text-sm text-gray-800">{vehicle.description}</p>
                      </div>
                      <div className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ₱ {vehicle.cost}
                      </div>
                    </div>

                    {/* Premium Toggle Button */}
                    <button
                      onClick={() => { toggleDetails(vehicle.id) }}
                      type="button"
                      className="w-full px-5 py-2.5 text-sm text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-t border-gray-300 text-indigo-700 font-medium flex items-center justify-between"
                    >
                      <span>{showDetailss ? 'Hide Additional Services' : 'Show Additional Services'}</span>
                      <Icon 
                        icon={showDetailss ? "mdi:chevron-up" : "mdi:chevron-down"} 
                        className="h-5 w-5 text-indigo-600"
                      />
                    </button>

                    {/* Luxury Collapsible Section */}
                    {showDetailss && (
                      <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 text-sm text-gray-900 space-y-3 border-t border-indigo-100">
                        <p className="font-semibold text-indigo-800">Premium Services:</p>
                        <ul className="space-y-2.5">
                          <li className="flex items-start">
                            <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                            <span className="text-gray-900">Professional loading assistance</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                            <span className="text-gray-900">Premium packaging materials</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                            <span className="text-gray-900">Comprehensive insurance options</span>
                          </li>
                          <li className="flex items-start">
                            <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                            <span className="text-gray-900">Real-time driver tracking</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-gray-50 p-5 rounded-xl mb-8 border border-gray-200 text-slate-400">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-700" />
              Delivery Option
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService === service.id
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <service.icon className={`h-6 w-6 mr-2 ${
                      selectedService === service.id ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Delivery: {service.time}</div>
                  <div className="text-sm font-medium mt-2">₱{service.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full customgrad text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center font-medium text-lg"
          >
            <Truck className="h-5 w-5 mr-2" />
            Schedule Delivery
          </button>
        </form>
      </div>

      {/* COMPLETED: Location Details Panel with Real-time Geocoding Map */}
      {activeLocation && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          {showMapCoords && (
                <div className="absolute top-0 left-0 h-full w-full border-b border-gray-200 flex-shrink-0">
                  <div className="h-full w-full bg-gray-100 relative">
                    {/* OpenStreetMap Preview */}
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        showMapCoords.lng - 0.01
                      },${
                        showMapCoords.lat - 0.01
                      },${
                        showMapCoords.lng + 0.01
                      },${
                        showMapCoords.lat + 0.01
                      }&marker=${showMapCoords.lat},${showMapCoords.lng}&layer=mapnik`}
                      style={{ border: 0 }}
                      title="Location Preview"
                      className="absolute inset-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-xs text-gray-500 p-2 bg-white/80 text-center">
                      <small>
                        {selectedSuggestionCoords 
                          ? "OpenStreetMap Preview - Address selected" 
                          : "OpenStreetMap Preview - Detected from typing"}
                      </small>
                    </div>
                    {isGeocodingTyping && (
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs flex items-center">
                        <Loader2 className="animate-spin h-3 w-3 mr-1" />
                        Detecting location...
                      </div>
                    )}
                  </div>
                </div>
              )}
          <div className="bg-white/95 backdrop-blur-lg w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl animate-slide-up md:animate-scale-in fixed bottom-0 md:relative h-[85vh] md:h-auto flex flex-col overflow-hidden border border-gray-200">
            {/* Header */}
            
            <div className="p-5 border-b border-gray-200 bg-white/90 backdrop-blur-lg sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  {activeLocation.type === 'pickup'
                    ? <><Home className="h-5 w-5 mr-2 text-green-500" /> Pickup Details</>
                    : <><MapPin className="h-5 w-5 mr-2 text-orange-500" /> Drop-off #{activeLocation.index! + 1} Details</>}
                </h2>
                <button
                  onClick={closeLocationDetails}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1">
              {/* Map Preview Section - Shows coordinates from EITHER suggestions OR typing */}
              
              
              {/* Form Fields */}
              <div className="p-5 space-y-6">
                
                {/* Full Address Input - Kept at top for mobile keyboard */}
              <div className="relative">
                <div className="grid grid-cols-3 w-full">
                  <div className="block text-sm font-medium flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    Full Address
                    {typingCoordinates && !selectedSuggestionCoords && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Location detected
                      </span>
                    )}
                  </div>
                {/* Current Location Button */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="flex items-center text-sm text-blue-600  bg-transparent px-3 py-2"
                      disabled={isLoading}
                    >
                    <LocateFixed className="h-4 w-4 mr-2" />
                    {isLoading ? "Getting location..." : "Use Current Location"}
                    </button>
                  </div>
                </div>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      name="address"
                      value={
                        activeLocation.type === 'pickup'
                          ? pickup.address
                          : dropoffs[activeLocation.index!].address
                      }
                      onChange={handleAddressSearch}
                      className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
                      placeholder="Search address..."
                      autoComplete="off"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    {isGeocodingTyping && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </div>

                  {isLoading && (
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2 text-blue-500" />
                      Searching for suggestions...
                    </div>
                  )}

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 border border-gray-200 rounded-xl overflow-hidden z-50 shadow-lg bg-white max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none flex items-start"
                        >
                          <MapPin className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-gray-800 text-sm block">{suggestion.formatted_address}</span>
                            {suggestion.provider && (
                              <span className="text-xs text-gray-500 mt-1 block">
                                Powered by {suggestion.provider === 'google' ? 'Google Maps' : 'OpenStreetMap'}
                                {suggestion.confidence && ` • ${suggestion.confidence} confidence`}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Form Fields */}
                <div className="space-y-6">
                  {/* House Number & Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center text-gray-700">
                        <Home className="h-4 w-4 mr-1 text-gray-500" />
                        House Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="houseNumber"
                          value={
                            activeLocation.type === 'pickup'
                              ? pickup.houseNumber
                              : dropoffs[activeLocation.index!].houseNumber
                          }
                          onChange={(e) =>
                            activeLocation.type === 'pickup'
                              ? handlePickupChange(e)
                              : handleDropoffChange(activeLocation.index!, e)
                          }
                          className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
                          placeholder="No."
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Home className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        Contact Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="contact"
                          value={
                            activeLocation.type === 'pickup'
                              ? pickup.contact
                              : dropoffs[activeLocation.index!].contact
                          }
                          onChange={(e) =>
                            activeLocation.type === 'pickup'
                              ? handlePickupChange(e)
                              : handleDropoffChange(activeLocation.index!, e)
                          }
                          className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
                          placeholder="Phone number"
                          inputMode="tel"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Phone className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center text-gray-700">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      Recipient Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={
                          activeLocation.type === 'pickup'
                            ? pickup.name
                            : dropoffs[activeLocation.index!].name
                        }
                        onChange={(e) =>
                          activeLocation.type === 'pickup'
                            ? handlePickupChange(e)
                            : handleDropoffChange(activeLocation.index!, e)
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
                        placeholder="Full name"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="p-5 border-t border-gray-200 bg-white/90 backdrop-blur-lg sticky bottom-0">
              <button
                type="button"
                onClick={closeLocationDetails}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold flex items-center justify-center"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50 flex items-center">
          <CheckCircle2 className="h-6 w-6 mr-2" />
          Delivery scheduled successfully!
        </div>
      )}

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ">
          <div className="w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-lg animate-slide-up overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Delivery Details</h2>
              <button onClick={closeDetails} className="p-1 rounded hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <ClassicConfirmForm
                order={{
                  sender: { name: pickup.name, address: pickup.address },
                  recipients: dropoffs.map((r: any, i: number) => ({
                    name: r.name,
                    address: r.address,
                    contact: r.contact,
                    distanceKm: distances[i].toFixed(2),
                  })),
                  billing: {
                    baseRate: parseFloat(useBaseCost?.toString() || '0'),
                    perKmRate: parseFloat(usePerKmCost?.toString() || '0'),
                    total: null,
                  },
                }}
                onConfirm={(driverId) => {
                  confirmCommand(driverId);
                }}
                onLoading={sendLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsFormJoined;
