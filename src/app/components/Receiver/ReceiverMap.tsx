"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

type ReceiverMapProps = {
  riderLocation: [number, number];
  receiverLocation: [number, number];
};

export default function ReceiverMap({
  riderLocation,
  receiverLocation,
}: ReceiverMapProps) {
  const riderIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/rider-icon.png", // replace with actual icon path
        iconSize: [35, 35],
      }),
    []
  );

  const receiverIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/receiver-icon.png", // replace with actual icon path
        iconSize: [30, 30],
      }),
    []
  );

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
