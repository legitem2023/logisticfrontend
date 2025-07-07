'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Trash2, Plus, Crosshair, X, Loader2 } from 'lucide-react';
import debounce from 'lodash.debounce';

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
};

type Stop = {
  id: number;
  address: string;
  lat?: number;
  lon?: number;
  suggestions?: Suggestion[];
  loading?: boolean;
  error?: string;
};

export default function DeliveryFormCard() {
  const [pickup, setPickup] = useState<Stop>({
    id: 0,
    address: '',
    suggestions: [],
    loading: false,
  });
  const [stops, setStops] = useState<Stop[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formDetails, setFormDetails] = useState({
    houseNumber: '',
    contactNumber: '',
    recipientName: '',
  });

  // Debounced suggestion fetcher
  const fetchSuggestions = useCallback(
    debounce(async (id: number, query: string, isPickup: boolean = false) => {
      if (query.length < 3) return;

      try {
        if (isPickup) {
          setPickup((prev) => ({ ...prev, loading: true, error: undefined }));
        } else {
          setStops((prev) =>
            prev.map((s) => (s.id === id ? { ...s, loading: true, error: undefined } : s))
          );
        }

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5&countrycodes=us,ca,mx`
        );
        
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        
        const results: Suggestion[] = await res.json();

        if (isPickup) {
          setPickup((prev) => ({
            ...prev,
            suggestions: results.slice(0, 5),
            loading: false,
          }));
        } else {
          setStops((prev) =>
            prev.map((s) =>
              s.id === id
                ? { ...s, suggestions: results.slice(0, 5), loading: false }
                : s
            )
          );
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch suggestions';
        if (isPickup) {
          setPickup((prev) => ({ ...prev, error, loading: false }));
        } else {
          setStops((prev) =>
            prev.map((s) => (s.id === id ? { ...s, error, loading: false } : s))
          );
        }
      }
    }, 500),
    []
  );

  const addStop = () => {
    setStops((prev) => [...prev, { id: Date.now(), address: '', suggestions: [] }]);
  };

  const removeStop = (id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateAddress = (id: number, address: string, isPickup: boolean = false) => {
    if (isPickup) {
      setPickup((prev) => ({ ...prev, address, suggestions: [] }));
    } else {
      setStops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, address, suggestions: [] } : s))
      );
    }

    fetchSuggestions(id, address, isPickup);
  };

  const selectSuggestion = (
    id: number,
    suggestion: Suggestion,
    isPickup: boolean = false
  ) => {
    const formattedAddress = formatAddress(suggestion);

    if (isPickup) {
      setPickup((prev) => ({
        ...prev,
        address: formattedAddress,
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
        suggestions: [],
      }));
      // Auto-fill house number if available
      if (suggestion.address?.house_number) {
        setFormDetails((prev) => ({
          ...prev,
          houseNumber: suggestion.address?.house_number || '',
        }));
      }
    } else {
      setStops((prev) =>
        prev.map((s) =>
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

  const useCurrentLocation = async (id?: number, isPickup: boolean = false) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    if (isPickup) {
      setPickup((prev) => ({ ...prev, loading: true, error: undefined }));
    } else if (id) {
      setStops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, loading: true, error: undefined } : s))
      );
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      
      if (!res.ok) throw new Error('Failed to reverse geocode');
      
      const data: Suggestion = await res.json();

      if (data.display_name) {
        const formattedAddress = formatAddress(data);
        
        if (isPickup) {
          setPickup((prev) => ({
            ...prev,
            address: formattedAddress,
            lat: latitude,
            lon: longitude,
            loading: false,
          }));
          setShowPopup(true);
          // Auto-fill house number if available
          if (data.address?.house_number) {
            setFormDetails((prev) => ({
              ...prev,
              houseNumber: data.address?.house_number || '',
            }));
          }
        } else if (id) {
          setStops((prev) =>
            prev.map((s) =>
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
        setPickup((prev) => ({ ...prev, error: errorMessage, loading: false }));
      } else if (id) {
        setStops((prev) =>
          prev.map((s) => (s.id === id ? { ...s, error: errorMessage, loading: false } : s))
        );
      }
      alert(errorMessage);
    }
  };

  const closePopup = () => setShowPopup(false);

  const submitForm = () => {
    const deliveryData = {
      pickup: {
        address: pickup.address,
        coordinates: pickup.lat && pickup.lon ? { lat: pickup.lat, lon: pickup.lon } : undefined,
        details: formDetails,
      },
      stops: stops.map((stop) => ({
        address: stop.address,
        coordinates: stop.lat && stop.lon ? { lat: stop.lat, lon: stop.lon } : undefined,
      })),
    };

    console.log('Delivery data:', deliveryData);
    setShowPopup(false);
  };

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">
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
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="Enter pick-up address"
            value={pickup.address}
            onChange={(e) => updateAddress(0, e.target.value, true)}
          />
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
                  className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
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
                  {stop.loading ? 'Locating...' : 'Use my location'}
                </button>
              </div>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter drop-off address"
                value={stop.address}
                onChange={(e) => updateAddress(stop.id, e.target.value)}
              />
              {stop.loading && (
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
                      className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
              onClick={submitForm}
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
