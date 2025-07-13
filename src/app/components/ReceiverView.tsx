// components/ReceiverView.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Clock, Bike, PackageCheck, CheckCheck } from "lucide-react";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

// Lazy-load Map to avoid SSR issues
const Map = dynamic(() => import("./ReceiverMap"), { ssr: false });

export default function ReceiverView() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePanel = () => setIsFullScreen(!isFullScreen);

  const delivery = {
    id: "xyz123",
    pickup: "Warehouse A",
    dropoff: "Your Address, Makati",
    status: "In Transit",
    eta: "15 mins",
    rider: "Mark Reyes",
    riderLocation: [14.5566, 121.0234],
    receiverLocation: [14.5547, 121.0244],
  };

  return (
    <div className="relative h-screen w-full">
      {/* Map View */}
      <Map
        riderLocation={delivery.riderLocation}
        receiverLocation={delivery.receiverLocation}
      />

      {/* Sliding Panel */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        animate={{ y: isFullScreen ? 0 : 300 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className={`absolute left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 ${
          isFullScreen ? "top-0 h-full" : "bottom-0 h-[40%]"
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" onClick={togglePanel} />

        <div className="space-y-4">
          <div className="text-center text-xl font-bold">Incoming Delivery</div>
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
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            ETA: {delivery.eta}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-yellow-600">
            <PackageCheck className="w-4 h-4" />
            Status: {delivery.status}
          </div>
          <Button className="w-full" onClick={togglePanel}>
            {isFullScreen ? "Minimize" : "Expand"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
