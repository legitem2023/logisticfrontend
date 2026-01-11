import { useState, useRef } from 'react';
import { showToast } from '../../../../utils/toastify';
import { geocodeAddress, reverseGeocode, geocodeWhileTyping } from '../utils/geocoding';
import { Location, ActiveLocation, Suggestion } from '../types';

interface UseGeocodingProps {
  pickup: Location;
  dropoffs: Location[];
  activeLocation: ActiveLocation | null;
  setPickup: React.Dispatch<React.SetStateAction<Location>>;
  setDropoffs: React.Dispatch<React.SetStateAction<Location[]>>;
}

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
  const addressCache = useRef<Map<string, any>>(new Map());
  
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update state
    if (activeLocation?.type === 'pickup') {
      setPickup({ ...pickup, address: value });
    } else if (activeLocation?.index !== null) {
      const updatedDropoffs = [...dropoffs];
      updatedDropoffs[activeLocation.index].address = value;
      setDropoffs(updatedDropoffs);
    }
    
    // Debounced search
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        const results = await geocodeAddress(value, 'auto');
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 600);
    
    geocodeTimeoutRef.current = setTimeout(async () => {
      await handleGeocodeWhileTyping(value);
    }, 1000);
  };
  
  const handleGeocodeWhileTyping = async (query: string) => {
    const result = await geocodeWhileTyping(query, setIsGeocodingTyping, setTypingCoordinates);
    
    if (result && activeLocation) {
      // Update coordinates in state
      if (activeLocation.type === 'pickup') {
        setPickup(prev => ({
          ...prev,
          lat: result.lat,
          lng: result.lng
        }));
      } else if (activeLocation.index !== null) {
        const updatedDropoffs = [...dropoffs];
        updatedDropoffs[activeLocation.index] = {
          ...updatedDropoffs[activeLocation.index],
          lat: result.lat,
          lng: result.lng
        };
        setDropoffs(updatedDropoffs);
      }
    }
  };
  
  const selectSuggestion = (suggestion: Suggestion) => {
    // Implementation similar to original
  };
  
  const handleUseCurrentLocation = async () => {
    // Implementation similar to original
  };
  
  const validateCoordinates = async (location: Location): Promise<Location | null> => {
    // Implementation similar to original
  };
  
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
