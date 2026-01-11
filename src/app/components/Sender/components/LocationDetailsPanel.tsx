import { useState, useRef, useEffect } from 'react';
import {
  Home,
  MapPin,
  X,
  CheckCircle2,
  Loader2,
  LocateFixed,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Location, ActiveLocation, Suggestion } from '../types';
import MapPreview from './MapPreview';
import AddressDetailsFields from './AddressDetailsFields';

interface LocationDetailsPanelProps {
  activeLocation: ActiveLocation;
  pickup: Location;
  dropoffs: Location[];
  suggestions: Suggestion[];
  isGeocodingLoading: boolean;
  isGeocodingTyping: boolean;
  selectedSuggestionCoords: {lat: number, lng: number} | null;
  typingCoordinates: {lat: number, lng: number} | null;
  onClose: () => void;
  onAddressSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSuggestion: (suggestion: Suggestion) => void;
  onUseCurrentLocation: () => Promise<void>;
  onPickupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropoffChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({
  activeLocation,
  pickup,
  dropoffs,
  suggestions,
  isGeocodingLoading,
  isGeocodingTyping,
  selectedSuggestionCoords,
  typingCoordinates,
  onClose,
  onAddressSearch,
  onSelectSuggestion,
  onUseCurrentLocation,
  onPickupChange,
  onDropoffChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFormSlidUp, setIsFormSlidUp] = useState(true);
  
  useEffect(() => {
    if (activeLocation && inputRef.current && !isFormSlidUp) {
      inputRef.current.focus();
    }
  }, [activeLocation, isFormSlidUp]);
  
  const currentLocation = activeLocation.type === 'pickup'
    ? pickup
    : dropoffs[activeLocation.index!];
    
  const showMapCoords = selectedSuggestionCoords || typingCoordinates;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      {/* Full Screen Map at the back */}
      {showMapCoords && (
        <div className="absolute inset-0">
          <MapPreview
            coordinates={showMapCoords}
            isGeocodingTyping={isGeocodingTyping}
            isSelected={!!selectedSuggestionCoords}
          />
        </div>
      )}
      
      {/* Form Panel that slides up/down */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg w-full max-w-md mx-auto rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-200 transition-transform duration-300 ease-in-out ${
        isFormSlidUp ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
      }`}>
        {/* Toggle Handle */}
        <div 
          className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-lg cursor-pointer rounded-t-3xl md:rounded-3xl"
          onClick={() => setIsFormSlidUp(!isFormSlidUp)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 top-2" />
              <h2 className="text-lg font-semibold flex items-center text-gray-800">
                {activeLocation.type === 'pickup'
                  ? <><Home className="h-5 w-5 mr-2 text-green-500" /> Pickup Details</>
                  : <><MapPin className="h-5 w-5 mr-2 text-orange-500" /> Drop-off #{activeLocation.index! + 1} Details</>}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFormSlidUp(!isFormSlidUp)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
              >
                {isFormSlidUp ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Form Content - Hidden when slid down */}
        {isFormSlidUp && (
          <>
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="p-5 space-y-6">
                {/* Address Input */}
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
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={onUseCurrentLocation}
                        className="flex items-center text-sm text-blue-600 bg-transparent px-3 py-2"
                        disabled={isGeocodingLoading}
                      >
                        <LocateFixed className="h-4 w-4 mr-2" />
                        {isGeocodingLoading ? "Getting location..." : "Use Current Location"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      name="address"
                      value={currentLocation.address}
                      onChange={onAddressSearch}
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
                  
                  {isGeocodingLoading && (
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
                          onClick={() => onSelectSuggestion(suggestion)}
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
                <AddressDetailsFields
                  activeLocation={activeLocation}
                  currentLocation={currentLocation}
                  onPickupChange={onPickupChange}
                  onDropoffChange={onDropoffChange}
                />
              </div>
            </div>
            
            {/* Save Button */}
            <div className="p-5 border-t border-gray-200 bg-white/90 backdrop-blur-lg">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold flex items-center justify-center"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationDetailsPanel;
