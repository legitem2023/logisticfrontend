"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function ReceiverMap({
  riderLocation,
  receiverLocation,
}: {
  riderLocation: [number, number];
  receiverLocation: [number, number];
}) {
  const riderIcon = L.icon({
    iconUrl: "/rider-icon.png", // Replace with your icon path
    iconSize: [35, 35],
  });

  const receiverIcon = L.icon({
    iconUrl: "/receiver-icon.png",
    iconSize: [30, 30],
  });

  return (
    <MapContainer
      center={receiverLocation}
      zoom={15}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={riderLocation} icon={riderIcon}>
        <Popup>Rider</Popup>
      </Marker>
      <Marker position={receiverLocation} icon={receiverIcon}>
        <Popup>You</Popup>
      </Marker>
    </MapContainer>
  );
}
