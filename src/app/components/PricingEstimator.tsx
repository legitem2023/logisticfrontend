'use client';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { VEHICLEQUERY } from '../../../graphql/query';
import { getDistanceInKm } from '../../../utils/getDistanceInKm';
import {
  MapPin,
  Truck,
  Home,
  X,
  Calculator,
  DollarSign,
  Route,
  Package
} from 'lucide-react';

interface Location {
  address: string;
  lat: number | null;
  lng: number | null;
}

interface VehicleType {
  id: string;
  name: string;
  description: string;
  cost: number;
  perKmRate: number;
  icon: string;
}

const PricingEstimator = () => {
  const { loading, error, data } = useQuery(VEHICLEQUERY);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [pickup, setPickup] = useState<Location>({ address: '', lat: null, lng: null });
  const [dropoff, setDropoff] = useState<Location>({ address: '', lat: null, lng: null });
  const [distance, setDistance] = useState<number>(0);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [activeLocation, setActiveLocation] = useState<'pickup' | 'dropoff' | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize selected vehicle when data loads
  useEffect(() => {
    if (data?.getVehicleTypes?.length > 0 && !selectedVehicle) {
      setSelectedVehicle(data.getVehicleTypes[0]);
    }
  }, [data, selectedVehicle]);

  // Calculate distance and cost when locations or vehicle change
  useEffect(() => {
    const calculateEstimate = async () => {
      if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng && selectedVehicle) {
        try {
          const dist = await getDistanceInKm(
            { lat: pickup.lat, lng: pickup.lng },
            { lat: dropoff.lat, lng: dropoff.lng }
          );
          setDistance(dist);
          
          // Calculate cost: base cost + (distance * per km rate)
          const cost = selectedVehicle.cost + (dist * selectedVehicle.perKmRate);
          setEstimatedCost(cost);
        } catch (error) {
          console.error('Error calculating distance:', error);
        }
      }
    };

    calculateEstimate();
  }, [pickup, dropoff, selectedVehicle]);

  // Geocoding function using OpenStreetMap Nominatim
  const geocodeAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return [];
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      return data.map((result: any) => ({
        formatted_address: result.display_name,
        geometry: {
          location: {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          }
        }
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced address search
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (activeLocation === 'pickup') {
      setPickup({ ...pickup, address: value });
    } else if (activeLocation === 'dropoff') {
      setDropoff({ ...dropoff, address: value });
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounce
    timeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        const results = await geocodeAddress(value);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 500);
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: any) => {
    const address = suggestion.formatted_address;

    if (activeLocation === 'pickup') {
      setPickup({
        address,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      });
    } else if (activeLocation === 'dropoff') {
      setDropoff({
        address,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      });
    }

    setActiveLocation(null);
    setSuggestions([]);
  };

  if (loading) return <div className="p-6 text-center">Loading vehicle options...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="w-full max-w-md mx-auto bg-white mt-5 shadow-lg overflow-hidden">
      <div className="customgrad p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center">
          <Calculator className="h-8 w-8 mr-3" />
          Delivery Price Estimator
        </h1>
        <p className="mt-2 opacity-90">Get an instant estimate for your delivery</p>
      </div>

      <div className="p-6">
        {/* Pickup Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <Home className="h-4 w-4 inline mr-1" />
            Pickup Location
          </label>
          <button
            type="button"
            onClick={() => setActiveLocation('pickup')}
            className="w-full text-left p-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {pickup.address ? (
              <span className="text-blue-600">{pickup.address}</span>
            ) : (
              <span className="text-gray-500">Enter pickup address</span>
            )}
          </button>
        </div>

        {/* Dropoff Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <MapPin className="h-4 w-4 inline mr-1" />
            Dropoff Location
          </label>
          <button
            type="button"
            onClick={() => setActiveLocation('dropoff')}
            className="w-full text-left p-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {dropoff.address ? (
              <span className="text-blue-600">{dropoff.address}</span>
            ) : (
              <span className="text-gray-500">Enter dropoff address</span>
            )}
          </button>
        </div>

        {/* Vehicle Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <Truck className="h-4 w-4 inline mr-1" />
            Vehicle Type
          </label>
          <select
            value={selectedVehicle?.id || ''}
            onChange={(e) => {
              const vehicle = data.getVehicleTypes.find((v: VehicleType) => v.id === e.target.value);
              setSelectedVehicle(vehicle);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {data.getVehicleTypes.map((vehicle: VehicleType) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} - ₱{vehicle.cost} base + ₱{vehicle.perKmRate}/km
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Cost Display */}
        {(pickup.address && dropoff.address) && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">
                <Route className="h-4 w-4 inline mr-1" />
                Distance:
              </span>
              <span className="font-medium">{distance.toFixed(2)} km</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">
                <Package className="h-4 w-4 inline mr-1" />
                Base rate:
              </span>
              <span className="font-medium">₱{selectedVehicle?.cost}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">
                <Truck className="h-4 w-4 inline mr-1" />
                Distance cost:
              </span>
              <span className="font-medium">₱{(distance * (selectedVehicle?.perKmRate || 0)).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="text-lg font-bold text-blue-700">
                <DollarSign className="h-5 w-5 inline mr-1" />
                Estimated total:
              </span>
              <span className="text-lg font-bold text-blue-700">₱{estimatedCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Address Search Panel */}
      {activeLocation && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-2xl animate-slide-up">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {activeLocation === 'pickup' ? 'Pickup Location' : 'Dropoff Location'}
              </h2>
              <button
                onClick={() => {
                  setActiveLocation(null);
                  setSuggestions([]);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={activeLocation === 'pickup' ? pickup.address : dropoff.address}
                  onChange={handleAddressSearch}
                  className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search address..."
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              {isLoading && (
                <div className="mt-2 text-sm text-gray-500">Searching...</div>
              )}

              {suggestions.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none"
                    >
                      {suggestion.formatted_address}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingEstimator;
