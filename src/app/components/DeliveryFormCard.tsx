'use client';

import { useEffect, useState } from 'react';
import { MapPin, Trash2, Plus, Crosshair, X } from 'lucide-react';

type Stop = {
  id: number;
  address: string;
  lat?: number;
  lon?: number;
};

export default function DeliveryFormCard() {
  const [pickup, setPickup] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editingType, setEditingType] = useState<'pickup' | number | null>(null);

  const [stops, setStops] = useState<Stop[]>([]);

  const [houseNumber, setHouseNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);

  const addStop = () => {
    setStops((prev) => [...prev, { id: Date.now(), address: '' }]);
  };

  const removeStop = (id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditingType(null);
    setSearchQuery('');
    setSearchSuggestions([]);
  };

  const submitPopup = () => {
    console.log('Pickup details:', {
      pickup,
      houseNumber,
      contactNumber,
      recipientName,
    });
    setShowPopup(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&format=json&limit=5`
        )
          .then((res) => res.json())
          .then((data) => setSearchSuggestions(data))
          .catch((err) => console.error(err));
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

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
            className="w-full border rounded p-2 text-sm bg-white cursor-pointer"
            placeholder="Enter pick-up address"
            value={pickup}
            readOnly
            onClick={() => {
              setEditingType('pickup');
              setSearchQuery('');
              setSearchSuggestions([]);
              setShowPopup(true);
            }}
          />
        </div>
      </div>

      {/* Drop-off Stops */}
      {stops.map((stop, index) => (
        <div key={stop.id} className="border rounded-xl p-4 bg-white mb-2">
          <div className="flex items-start gap-3">
            <MapPin className="text-green-600 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Drop-off Stop {index + 1}</p>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm bg-white cursor-pointer"
                placeholder="Enter drop-off address"
                value={stop.address}
                readOnly
                onClick={() => {
                  setEditingType(stop.id);
                  setSearchQuery('');
                  setSearchSuggestions([]);
                  setShowPopup(true);
                }}
              />
            </div>
            <button onClick={() => removeStop(stop.id)} className="text-red-500 hover:text-red-700">
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

      {/* Full-Screen Search Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-4 left-2 right-2 bottom-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">📍 Search Address</h3>
              <button onClick={closePopup} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm mb-4"
              placeholder="🔍 Search for a location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul className="flex-1 overflow-auto space-y-2">
              {searchSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    if (editingType === 'pickup') {
                      setPickup(s.display_name);
                    } else if (typeof editingType === 'number') {
                      setStops((prev) =>
                        prev.map((stop) =>
                          stop.id === editingType
                            ? {
                                ...stop,
                                address: s.display_name,
                                lat: parseFloat(s.lat),
                                lon: parseFloat(s.lon),
                              }
                            : stop
                        )
                      );
                    }
                    closePopup();
                  }}
                  className="p-2 border rounded hover:bg-blue-100 cursor-pointer text-sm"
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
            }
