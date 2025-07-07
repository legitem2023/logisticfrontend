'use client';

import { useState } from 'react';
import { MapPin, Trash2, Plus, Crosshair, X } from 'lucide-react';

type Stop = {
  id: number;
  address: string;
};

export default function DeliveryFormCard() {
  const [pickup, setPickup] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);

  const addStop = () => {
    setStops((prev) => [...prev, { id: Date.now(), address: '' }]);
  };

  const updateStop = (id: number, value: string) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, address: value } : s)));
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
            setShowPopup(true); // Show popup after location is set
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
  };

  const submitPopup = () => {
    // Do something with pickupNote if needed
    console.log('Additional Note:', pickupNote);
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

      {/* Stop cards */}
      {stops.map((stop, index) => (
        <div key={stop.id} className="border rounded-xl p-4 flex gap-3 items-start bg-white">
          <MapPin className="text-green-600 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Drop-off Stop {index + 1}</p>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              placeholder="Enter drop-off address"
              value={stop.address}
              onChange={(e) => updateStop(stop.id, e.target.value)}
            />
          </div>
          <button onClick={() => removeStop(stop.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={18} />
          </button>
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
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
            <p className="text-sm text-gray-600 mb-3">You can add landmark or pickup note:</p>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm mb-4"
              placeholder="e.g. Near 7-Eleven or Sender name"
              value={pickupNote}
              onChange={(e) => setPickupNote(e.target.value)}
            />
            <button
              onClick={submitPopup}
              className="bg-blue-600 text-white rounded w-full py-2 text-sm hover:bg-blue-700 transition"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
