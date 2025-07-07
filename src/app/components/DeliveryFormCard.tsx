'use client';

import { useState } from 'react';
import { MapPin, Trash2, Plus } from 'lucide-react';

type Stop = {
  id: number;
  address: string;
};

export default function DeliveryFormCard() {
  const [pickup, setPickup] = useState('');
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

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">📦 Create Delivery</h2>

      {/* Pickup card */}
      <div className="border rounded-xl p-4 flex gap-3 items-start bg-gray-50">
        <MapPin className="text-blue-600 mt-1" />
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">Pick-up Location</p>
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
    </div>
  );
}
