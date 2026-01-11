import { useState, useRef, useEffect, useCallback } from 'react';
import { showToast } from '../../../../../utils/toastify';
import { 
  geocodeAddress, 
  reverseGeocode, 
  geocodeWhileTyping 
} from '../utils/geocoding';
import { Location, ActiveLocation, Suggestion } from '../types';

interface UseGeocodingProps {
  pickup: Location;
  dropoffs: Location[];
  activeLocation: ActiveLocation | null;
  setPickup: React.Dispatch<React.SetStateAction<Location>>;
  setDropoffs: React.Dispatch<React.SetStateAction<Location[]>>;
}

// Change from default export to named export
export const useGeocoding = ({
  pickup,
  dropoffs,
  activeLocation,
  setPickup,
  setDropoffs
}: UseGeocodingProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSuggestionCoords, setSelectedSuggestionCoords] = useState<{lat: number, lng: number} | null>(null);
  const [typingCoordinates, setTypingCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isGeocodingTyping, setIsGeocodingTyping] = useState<boolean>(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleAddressSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update state
    if (activeLocation?.type === 'pickup') {
      setPickup(prev => ({ ...prev, address: value }));
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index] = {
        ...updatedDropoffs[activeLocation.index],
        address: value
      };
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
        setIsLoading(true);
        try {
          const results = await geocodeAddress(value, 'auto');
          setSuggestions(results);
        } catch (error) {
          console.error('Geocoding error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 600);

    // Separate timeout for real-time geocoding
    geocodeTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 5) {
        await geocodeWhileTyping(
          value, 
          setIsGeocodingTyping, 
          setTypingCoordinates
        );
      } else {
        setTypingCoordinates(null);
      }
    }, 1000);
  }, [activeLocation, dropoffs, setPickup, setDropoffs]);

  const selectSuggestion = useCallback((suggestion: Suggestion) => {
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

    // Store the selected coordinates
    setSelectedSuggestionCoords({
      lat: suggestion.geometry.location.lat,
      lng: suggestion.geometry.location.lng
    });
    setTypingCoordinates(null); // Clear typing coordinates

    setSuggestions([]);
    showToast("Address selected successfully", 'success');
  }, [activeLocation, pickup, dropoffs, setPickup, setDropoffs]);

  const handleUseCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", 'error');
      return;
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
      if (!address) {
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
      
      if (activeLocation?.type === 'pickup') {
        setPickup({
          ...pickup,
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          houseNumber: location.houseNumber
        });
        setSelectedSuggestionCoords({
          lat: location.lat!,
          lng: location.lng!
        });
        setTypingCoordinates(null);
      } else if (activeLocation?.index !== null) {
        const updatedDropoffs = [...dropoffs];
        updatedDropoffs[activeLocation.index] = {
          ...updatedDropoffs[activeLocation.index],
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          houseNumber: location.houseNumber
        };
        setDropoffs(updatedDropoffs);
        setSelectedSuggestionCoords({
          lat: location.lat!,
          lng: location.lng!
        });
        setTypingCoordinates(null);
      }
      
      showToast("Current location set successfully", 'success');
      
    } catch (error: any) {
      console.error('Location error:', error);
      showToast(`Location error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeLocation, pickup, dropoffs, setPickup, setDropoffs]);

  const validateCoordinates = useCallback(async (location: Location): Promise<Location | null> => {
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
  }, []);

  return {
    suggestions,
    isLoading,
    selectedSuggestionCoords,
    typingCoordinates,
    isGeocodingTyping,
    handleAddressSearch,
    selectSuggestion,
    handleUseCurrentLocation,
    validateCoordinates
  };
};

// Also export as default for backward compatibility
export default useGeocoding;
