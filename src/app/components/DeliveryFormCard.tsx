'use client';

import { useState, useEffect } from 'react';
import { MapPin, Trash2, Plus, Crosshair, X } from 'lucide-react';

type Stop = {
  id: number;
  address: string;
  lat?: number;
  lng?: number;
  suggestions?: { display_name: string; lat: string; lon: string }[];
};

export default function DeliveryFormCard() {
  const [pickup, setPickup] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);

  const [houseNumber, setHouseNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const addStop = () => {
    setStops((prev) => [...prev, { id: Date.now(), address: '' }]);
  };

  const removeStop = (id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStopAddress = (id: number, address: string) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, address, suggestions: [] } : s))
    );

    // Trigger auto-suggest
    if (address.length > 3) {
      fetchSuggestions(id, address);
    }
  };

  const fetchSuggestions = async (id: number, query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setStops((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, suggestions: data.slice(0, 5) } : s
        )
      );
    } catch (error) {
      console.error('Autocomplete failed:', error);
    }
  };

  const selectSuggestion = (id: number, suggestion: any) => {
    setStops((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              address: suggestion.display_name,
              lat: parseFloat(suggestion.lat),
              lng: parseFloat(suggestion.lon),
              suggestions: [],
            }
          : s
      )
    );
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data.display_name) {
            setPickup(data.display_name);
            setShowPopup(true);
          } else {
            alert('Could not determine address.');
          }
        } catch (error) {
          console.error(error);
          alert('Failed to retrieve address.');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        alert('Error getting location: ' + error.message);
        setLoadingLocation(false);
      }
    );
  };

  const closePopup = () => setShowPopup(false);

  const submitPopup = () => {
    console.log('Pickup details:', {
      pickup,
      houseNumber,
      contactNumber,
      recipientName,
    });
    setShowPopup(false);
  };

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {/* Pickup Section */}
      <div className="border rounded-xl p-4 flex gap-3 items-start bg-gray-50">
        <MapPin className="text-blue-600 mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-500">Pick-up Location</p>
            <button
              onClick={useCurrentLocation}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              disabled={loadingLocation}
            >
              <Crosshair size={14} />
              {loadingLocation ? 'Locating...' : 'Use my location'}
            </button>
          </div>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="Enter pick-up address"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>
      </div>

      {/* Drop-off Stops */}
      {stops.map((stop, index) => (
        <div key={stop.id} className="border rounded-xl p-4 bg-white">
          <div className="flex gap-3 items-start">
            <MapPin className="text-green-600 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Drop-off Stop {index + 1}</p>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter drop-off address"
                value={stop.address}
                onChange={(e) => updateStopAddress(stop.id, e.target.value)}
              />
              {/* Suggestions */}
              {stop.suggestions && stop.suggestions.length > 0 && (
                <div className="bg-white border rounded mt-1 max-h-32 overflow-y-auto">
                  {stop.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100"
                      onClick={() => selectSuggestion(stop.id, sug)}
                    >
                      {sug.display_name}
                    </button>
                  ))}
                </div>
              )}

              {/* Coordinates */}
              {stop.lat && stop.lng && (
                <p className="text-xs text-gray-500 mt-1">
                  📍 Lat: {stop.lat.toFixed(5)}, Lng: {stop.lng.toFixed(5)}
                </p>
              )}
            </div>
            <button
              onClick={() => removeStop(stop.id)}
              className="text-red-500 hover:text-red-700 mt-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Add Stop Button */}
      <button
        onClick={addStop}
        className="flex items-center justify-center w-full border-2 border-dashed rounded-xl py-2 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
      >
        <Plus className="mr-1" size={18} />
        Add Drop-off Stop
      </button>

      {/* Additional Info Popup */}
      {showPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4">📍 Additional Pickup Info</h3>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm mb-3"
              placeholder="🏠 House No. / Street"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
            <input
              type="text"
              className="w-full border rounded p-2 text-sm mb-3"
              placeholder="📞 Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <input
              type="text"
              className="w-full border rounded p-2 text-sm mb-4"
              placeholder="👤 Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <button
              onClick={submitPopup}
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
