"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Package,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";

// Lazy load the map to avoid SSR issues
const RiderMap = dynamic(() => import("./RiderMap"), { ssr: false });

export default function RiderView() {
  const [expanded, setExpanded] = useState(false);

  const delivery = {
    recipient: "Juan Dela Cruz",
    address: "123 Main St, Makati City",
    notes: "Leave at door.",
    status: "En Route",
    eta: "10-15 mins",
    riderLocation: [14.555, 121.023] as [number, number],
    receiverLocation: [14.5568, 121.025] as [number, number],
  };

  return (
    <div className="relative h-screen w-full">
      <RiderMap
        riderLocation={delivery.riderLocation}
        receiverLocation={delivery.receiverLocation}
      />

      {/* Bottom Panel */}
      <div
        className={`fixed left-0 right-0 transition-all duration-300 bg-white shadow-xl rounded-t-2xl px-4 pt-2 pb-6 border-t z-10 ${
          expanded ? "bottom-0 h-[85%]" : "bottom-0 h-[35%]"
        }`}
      >
        <div className="flex justify-center">
          <button
            className="w-8 h-1.5 bg-gray-300 rounded-full mb-2"
            onClick={() => setExpanded(!expanded)}
          />
        </div>

        <div className="flex justify-center mb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-800"
          >
            {expanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-full">
          <h2 className="text-center text-xl font-bold">Delivery Details</h2>

          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-indigo-600" />
            To: {delivery.recipient}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            Address: {delivery.address}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-600" />
            ETA: {delivery.eta}
          </div>
          <p className="text-sm italic text-gray-500">
            Note: {delivery.notes}
          </p>

          <Button className="w-full mt-2">Mark as Delivered</Button>
        </div>
      </div>
    </div>
  );
}
