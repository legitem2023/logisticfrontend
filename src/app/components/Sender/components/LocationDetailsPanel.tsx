import { useState, useRef, useEffect } from 'react';
import {
  Home,
  MapPin,
  User,
  Phone,
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
  const [isFormMinimized, setIsFormMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (activeLocation && inputRef.current && !isFormMinimized) {
      inputRef.current.focus();
    }
  }, [activeLocation, isFormMinimized]);
  
  const currentLocation = activeLocation.type === 'pickup'
    ? pickup
    : dropoffs[activeLocation.index!];
    
  const showMapCoords = selectedSuggestionCoords || typingCoordinates;
  
  const handleToggleForm = () => {
    setIsAnimating(true);
    setIsFormMinimized(!isFormMinimized);
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-end md:items-center justify-end md:justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      {/* Full Map at the back/outside - Always visible when coordinates exist */}
      {showMapCoords && (
        <div className={`absolute inset-0 transition-all duration-300 ${isFormMinimized ? 'opacity-100' : 'opacity-40'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
          <MapPreview
            coordinates={showMapCoords}
            isGeocodingTyping={isGeocodingTyping}
            isSelected={!!selectedSuggestionCoords}
            isFullView={true}
          />
        </div>
      )}
      
      {/* Form Panel with Slide-up Animation */}
      <div 
        className={`bg-white/95 backdrop-blur-lg w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-200 relative z-20 transition-all duration-300 ease-in-out ${
          isFormMinimized 
            ? 'translate-y-[calc(100%-80px)] md:translate-y-[calc(100%-60px)]' 
            : 'translate-y-0'
        } ${isAnimating ? 'pointer-events-none' : ''}`}
        style={{
          height: isFormMinimized ? 'auto' : '75vh',
          maxHeight: isFormMinimized ? '80px' : '75vh',
          marginBottom: isFormMinimized ? '0' : 'auto',
        }}
      >
        {/* Drag Handle / Toggle Header */}
        <div 
          className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-lg sticky top-0 z-10 cursor-pointer"
          onClick={handleToggleForm}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 -top-1" />
              <h2 className="text-lg font-semibold flex items-center text-gray-800">
                {activeLocation.type === 'pickup'
                  ? <><Home className="h-5 w-5 mr-2 text-green-500" /> Pickup Details</>
                  : <><MapPin className="h-5 w-5 mr-2 text-orange-500" /> Drop-off #{activeLocation.index! + 1} Details</>}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleForm}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                title={isFormMinimized ? "Expand form" : "Minimize form"}
              >
                {isFormMinimized ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
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
          {isFormMinimized && (
            <div className="mt-2 text-sm text-gray-500 truncate">
              {currentLocation.address || "Enter address..."}
            </div>
          )}
        </div>
        
        {/* Form Content - Hidden when minimized */}
        {!isFormMinimized && (
          <div className="overflow-y-auto h-full">
            {/* Form Fields */}
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
            
            {/* Save Button */}
            <div className="p-5 border-t border-gray-200 bg-white/90 backdrop-blur-lg sticky bottom-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold flex items-center justify-center"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetailsPanel;
