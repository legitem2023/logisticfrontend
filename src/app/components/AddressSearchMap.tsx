'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Trash2, Plus, Crosshair, X, Loader2, Search } from 'lucide-react';

type AddressDetails = {
  house_number?: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
  address?: AddressDetails;
};

type Stop = {
  id: number;
  address: string;
  lat?: number;
  lon?: number;
  suggestions?: Suggestion[];
  loading?: boolean;
  error?: string;
  isSearching?: boolean;
};

type FormDetails = {
  houseNumber: string;
  contactNumber: string;
  recipientName: string;
};

function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export default function DeliveryFormCard() {
  const [pickup, setPickup] = useState<Stop>({
    id: 0,
    address: '',
    suggestions: [],
    loading: false,
  });
  const [stops, setStops] = useState<Stop[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formDetails, setFormDetails] = useState<FormDetails>({
    houseNumber: '',
    contactNumber: '',
    recipientName: '',
  });
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addressCache, setAddressCache] = useState<Record<string, Suggestion[]>>({});
  const [lastApiCallTime, setLastApiCallTime] = useState(0);

  const debouncedFetchPickupSuggestions = useRef(
    debounce(async (query: string) => {
      if (query.length < 3) return;
      await fetchSuggestions(query, true);
    }, 500)
  ).current;

  const debouncedFetchStopSuggestions = useRef(
    debounce(async (id: number, query: string) => {
      if (query.length < 3) return;
      await fetchSuggestions(query, false, id);
    }, 500)
  ).current;

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('deliveryFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPickup(parsedData.pickup || { id: 0, address: '', suggestions: [] });
      setStops(parsedData.stops || []);
      setFormDetails(parsedData.formDetails || { houseNumber: '', contactNumber: '', recipientName: '' });
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    const savedData = {
      pickup,
      stops,
      formDetails
    };
    localStorage.setItem('deliveryFormData', JSON.stringify(savedData));
  }, [pickup, stops, formDetails]);

  const fetchSuggestions = async (query: string, isPickup: boolean, id?: number) => {
    const now = Date.now();
    if (now - lastApiCallTime < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - (now - lastApiCallTime)));
    }
    setLastApiCallTime(Date.now());

    try {
      if (isPickup) {
        setPickup(prev => ({ ...prev, loading: true, error: undefined }));
      } else if (id) {
        setStops(prev =>
          prev.map(s => (s.id === id ? { ...s, loading: true, error: undefined, isSearching: true } : s))
        );
      }

      let results: Suggestion[];
      if (addressCache[query]) {
        results = addressCache[query];
      } else {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5&countrycodes=us,ca,mx`
        );
        
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        
        results = await res.json();
        setAddressCache(prev => ({ ...prev, [query]: results }));
      }

      if (isPickup) {
        setPickup(prev => ({
          ...prev,
          suggestions: results.slice(0, 5),
          loading: false,
        }));
      } else if (id) {
        setStops(prev =>
          prev.map(s =>
            s.id === id
              ? { ...s, suggestions: results.slice(0, 5), loading: false, isSearching: false }
              : s
          )
        );
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch suggestions';
      if (isPickup) {
        setPickup(prev => ({ ...prev, error, loading: false }));
      } else if (id) {
        setStops(prev =>
          prev.map(s => (s.id === id ? { ...s, error, loading: false, isSearching: false } : s))
        );
      }
    }
  };

  const validateAddress = (address: string): boolean => {
    return address.length >= 5 && /\d/.test(address) && /[a-zA-Z]/.test(address);
  };

  const addStop = () => {
    setStops(prev => [...prev, { id: Date.now(), address: '', suggestions: [] }]);
  };

  const removeStop = (id: number) => {
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const updateAddress = (id: number, address: string, isPickup: boolean = false) => {
    setActiveSuggestionIndex(-1);
    if (isPickup) {
      setPickup(prev => ({ ...prev, address, suggestions: [] }));
      debouncedFetchPickupSuggestions(address);
    } else {
      setStops(prev =>
        prev.map(s => (s.id === id ? { ...s, address, suggestions: [] } : s))
      );
      debouncedFetchStopSuggestions(id, address);
    }
  };

  const formatAddress = (suggestion: Suggestion): string => {
    const addr = suggestion.address || {};
    const parts = [
      addr.house_number,
      addr.road,
      addr.suburb,
      addr.city,
      addr.state,
      addr.postcode,
      addr.country,
    ].filter(Boolean);
    return parts.join(', ') || suggestion.display_name;
  };

  const selectSuggestion = (
    id: number,
    suggestion: Suggestion,
    isPickup: boolean = false
  ) => {
    const formattedAddress = formatAddress(suggestion);

    if (isPickup) {
      setPickup(prev => ({
        ...prev,
        address: formattedAddress,
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
        suggestions: [],
      }));
      if (suggestion.address?.house_number) {
        setFormDetails(prev => ({
          ...prev,
          houseNumber: suggestion.address?.house_number || '',
        }));
      }
    } else {
      setStops(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                address: formattedAddress,
                lat: parseFloat(suggestion.lat),
                lon: parseFloat(suggestion.lon),
                suggestions: [],
              }
            : s
        )
      );
    }
    setActiveSuggestionIndex(-1);
  };

  async function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  const useCurrentLocation = async (id?: number, isPickup: boolean = false) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    if (isPickup) {
      setPickup(prev => ({ ...prev, loading: true, error: undefined }));
    } else if (id) {
      setStops(prev =>
        prev.map(s => (s.id === id ? { ...s, loading: true, error: undefined } : s))
      );
    }

    try {
      let position = await getPosition({ enableHighAccuracy: true, timeout: 5000 });
      
      if (position.coords.accuracy > 50) {
        position = await getPosition({ enableHighAccuracy: true, timeout: 10000 });
      }

      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      
      if (!res.ok) throw new Error('Failed to reverse geocode');
      
      const data: Suggestion = await res.json();

      if (data.display_name) {
        const formattedAddress = formatAddress(data);
        
        if (isPickup) {
          setPickup(prev => ({
            ...prev,
            address: formattedAddress,
            lat: latitude,
            lon: longitude,
            loading: false,
          }));
          setShowPopup(true);
          if (data.address?.house_number) {
            setFormDetails(prev => ({
              ...prev,
              houseNumber: data.address?.house_number || '',
            }));
          }
        } else if (id) {
          setStops(prev =>
            prev.map(s =>
              s.id === id
                ? {
                    ...s,
                    address: formattedAddress,
                    lat: latitude,
                    lon: longitude,
                    loading: false,
                  }
                : s
            )
          );
        }
      } else {
        throw new Error('Could not determine address');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      if (isPickup) {
        setPickup(prev => ({ ...prev, error: errorMessage, loading: false }));
      } else if (id) {
        setStops(prev =>
          prev.map(s => (s.id === id ? { ...s, error: errorMessage, loading: false } : s))
        );
      }
      alert(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number, isPickup: boolean) => {
    const suggestions = isPickup ? pickup.suggestions : stops.find(s => s.id === id)?.suggestions;
    
    if (!suggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          selectSuggestion(id, suggestions[activeSuggestionIndex], isPickup);
        }
        break;
      case 'Escape':
        if (isPickup) {
          setPickup(prev => ({ ...prev, suggestions: [] }));
        } else {
          setStops(prev => 
            prev.map(s => s.id === id ? { ...s, suggestions: [] } : s)
          );
        }
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const getBoundingBox = (): string => {
    if (!pickup.lat || !pickup.lon) return '';
    
    const lat = parseFloat(pickup.lat.toString());
    const lon = parseFloat(pickup.lon.toString());
    const offset = 0.02; // ~2km
    
    return `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`;
  };

  const closePopup = () => setShowPopup(false);

  const handleSubmit = async () => {
    if (!validateAddress(pickup.address)) {
      setSubmitError('Please enter a valid pickup address');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup: {
            address: pickup.address,
            coordinates: pickup.lat && pickup.lon ? 
              { lat: pickup.lat, lon: pickup.lon } : undefined,
            details: formDetails,
          },
          stops: stops.map(stop => ({
            address: stop.address,
            coordinates: stop.lat && stop.lon ? 
              { lat: stop.lat, lon: stop.lon } : undefined,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit delivery');
      }

      // Clear form on success
      setPickup({ id: 0, address: '', suggestions: [] });
      setStops([]);
      setFormDetails({ houseNumber: '', contactNumber: '', recipientName: '' });
      localStorage.removeItem('deliveryFormData');
      
      alert('Delivery created successfully!');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      debouncedFetchPickupSuggestions.cancel?.();
      debouncedFetchStopSuggestions.cancel?.();
    };
  }, [debouncedFetchPickupSuggestions, debouncedFetchStopSuggestions]);

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {/* Pickup card */}
      <div className="border rounded-xl p-4 flex gap-3 items-start bg-gray-50">
        <MapPin className="text-blue-600 mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-500">Pick-up Location</p>
            <button
              onClick={() => useCurrentLocation(0, true)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              disabled={pickup.loading}
            >
              {pickup.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Crosshair size={14} />
              )}
              {pickup.loading ? 'Locating...' : 'Use my location'}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              aria-label="Pick-up address"
              className="w-full border rounded p-2 text-sm pl-8"
              placeholder="Enter pick-up address"
              value={pickup.address}
              onChange={(e) => updateAddress(0, e.target.value, true)}
              onKeyDown={(e) => handleKeyDown(e, 0, true)}
            />
            <Search className="absolute left-2 top-3 text-gray-400" size={16} />
          </div>
          {pickup.loading && (
            <div className="flex justify-center mt-1">
              <Loader2 className="animate-spin text-blue-500" size={16} />
            </div>
          )}
          {pickup.error && (
            <p className="text-red-500 text-xs mt-1">{pickup.error}</p>
          )}
          {pickup.suggestions && pickup.suggestions.length > 0 && (
            <ul className="border mt-1 rounded bg-white shadow text-sm max-h-40 overflow-auto z-10">
              {pickup.suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => selectSuggestion(0, s, true)}
                  className={`px-2 py-1 hover:bg-blue-100 cursor-pointer ${
                    i === activeSuggestionIndex ? 'bg-blue-100' : ''
                  }`}
                >
                  {formatAddress(s)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Stop cards */}
      {stops.map((stop, index) => (
        <div key={stop.id} className="border rounded-xl p-4 bg-white mb-2 relative">
          <div className="flex items-start gap-3">
            <MapPin className="text-green-600 mt-1" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-500">Drop-off Stop {index + 1}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => useCurrentLocation(stop.id)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    disabled={stop.loading}
                  >
                    {stop.loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Crosshair size={14} />
                    )}
                    {stop.loading ? 'Locating...' : 'My location'}
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  aria-label={`Drop-off address for stop ${index + 1}`}
                  className="w-full border rounded p-2 text-sm pl-8"
                  placeholder="Search drop-off address"
                  value={stop.address}
                  onChange={(e) => updateAddress(stop.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, stop.id, false)}
                />
                <Search className="absolute left-2 top-3 text-gray-400" size={16} />
              </div>
              {stop.loading && stop.isSearching && (
                <div className="flex justify-center mt-1">
                  <Loader2 className="animate-spin text-blue-500" size={16} />
                </div>
              )}
              {stop.error && (
                <p className="text-red-500 text-xs mt-1">{stop.error}</p>
              )}
              {stop.suggestions && stop.suggestions.length > 0 && (
                <ul className="border mt-1 rounded bg-white shadow text-sm max-h-40 overflow-auto z-10">
                  {stop.suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => selectSuggestion(stop.id, s)}
                      className={`px-2 py-1 hover:bg-blue-100 cursor-pointer ${
                        i === activeSuggestionIndex ? 'bg-blue-100' : ''
                      }`}
                    >
                      {formatAddress(s)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => removeStop(stop.id)}
              className="text-red-500 hover:text-red-700"
              disabled={stop.loading}
              aria-label={`Remove stop ${index + 1}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Add stop button */}
      <button
        onClick={addStop}
        className="flex items-center justify-center w-full border-2 border-dashed rounded-xl py-2 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
      >
        <Plus className="mr-1" size={18} />
        Add Drop-off Stop
      </button>

      {/* Map Preview */}
      {pickup.lat && pickup.lon && (
        <div className="mt-4">
          <button
            onClick={() => setShowMapPreview(!showMapPreview)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            {showMapPreview ? 'Hide Map' : 'Show Map Preview'}
          </button>
          {showMapPreview && (
            <div className="mt-2 border rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${getBoundingBox()}&layer=mapnik&marker=${pickup.lat},${pickup.lon}`}
              ></iframe>
              <div className="p-2 bg-gray-50 text-center text-sm">
                <a
                  href={`https://www.openstreetmap.org/#map=15/${pickup.lat}/${pickup.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Larger Map
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !validateAddress(pickup.address)}
        className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm hover:bg-blue-700 transition disabled:bg-blue-300"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Processing...
          </span>
        ) : (
          'Create Delivery'
        )}
      </button>
      {submitError && (
        <p className="text-red-500 text-sm text-center">{submitError}</p>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4">📍 Additional Pickup Info</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Pickup Address</label>
              <div className="p-2 bg-gray-50 rounded text-sm">{pickup.address}</div>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">🏠 House No. / Street</label>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                value={formDetails.houseNumber}
                onChange={(e) =>
                  setFormDetails({ ...formDetails, houseNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">📞 Contact Number</label>
              <input
                type="tel"
                className="w-full border rounded p-2 text-sm"
                value={formDetails.contactNumber}
                onChange={(e) =>
                  setFormDetails({ ...formDetails, contactNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">👤 Recipient Name</label>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                value={formDetails.recipientName}
                onChange={(e) =>
                  setFormDetails({ ...formDetails, recipientName: e.target.value })
                }
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded w-full py-2 text-sm hover:bg-blue-700 transition"
            >
              Save Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
          }
