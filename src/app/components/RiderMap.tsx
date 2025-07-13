"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

type RiderMapProps = {
  riderLocation: [number, number];
  receiverLocation: [number, number];
};

export default function RiderMap({
  riderLocation,
  receiverLocation,
}: RiderMapProps) {
  const riderIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/rider-icon.png",
        iconSize: [35, 35],
      }),
    []
  );

  const receiverIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/receiver-icon.png",
        iconSize: [30, 30],
      }),
    []
  );

  return (
    <MapContainer
      center={riderLocation}
      zoom={15}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={riderLocation} icon={riderIcon}>
        <Popup>You (Rider)</Popup>
      </Marker>
      <Marker position={receiverLocation} icon={receiverIcon}>
        <Popup>Receiver</Popup>
      </Marker>
      <Polyline
        positions={[riderLocation, receiverLocation]}
        pathOptions={{ color: "blue", weight: 4, dashArray: "6" }}
      />
    </MapContainer>
  );
}
