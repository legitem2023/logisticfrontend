"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Clock,
  Bike,
  PackageCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import("./ReceiverMap"), { ssr: false });

export default function ReceiverView() {
  const [expanded, setExpanded] = useState(false);

  const delivery = {
    rider: "Mark Reyes",
    pickup: "Warehouse A",
    dropoff: "Your Address, Makati",
    status: "In Transit",
    eta: "15 mins",
    riderLocation: [14.5566, 121.0234] as [number, number],
    receiverLocation: [14.5547, 121.0244] as [number, number],
  };

  return (
    <div className="relative h-screen w-full">
      {/* Map */}
      <Map
        riderLocation={delivery.riderLocation}
        receiverLocation={delivery.receiverLocation}
      />

      {/* Bottom Panel */}
      <div
        className={`fixed left-0 right-0 transition-all duration-300 bg-white shadow-xl rounded-t-2xl px-4 pt-2 pb-6 border-t z-10 ${
          expanded ? "bottom-0 h-[90%]" : "bottom-0 h-[35%]"
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
          <h2 className="text-center text-xl font-bold">Delivery Info</h2>
          <div className="flex items-center gap-2 text-sm">
            <Bike className="w-4 h-4 text-blue-600" />
            Rider: {delivery.rider}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" />
            Pickup: {delivery.pickup}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-red-600" />
            Drop-off: {delivery.dropoff}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            ETA: {delivery.eta}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-yellow-600">
            <PackageCheck className="w-4 h-4" />
            Status: {delivery.status}
          </div>

          <Button
            className="w-full"
            onClick={() => alert("Contact rider or support")}
          >
            Contact Rider
          </Button>
        </div>
      </div>
    </div>
  );
}
