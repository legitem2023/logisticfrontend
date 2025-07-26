'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

type SenderMapProps = {
  riderLocation: [number, number];
  senderLocation: [number, number];
  packageLocation?: [number, number]; // Optional package location
};

export default function SenderMap({
  riderLocation,
  senderLocation,
  packageLocation,
}: SenderMapProps) {
  const riderIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/Bike.svg", // replace with actual icon path
        iconSize: [35, 35],
      }),
    []
  );

  const senderIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535137.png", // replace with actual icon path
        iconSize: [30, 30],
      }),
    []
  );

  const packageIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/package-icon.png", // replace with actual icon path
        iconSize: [25, 25],
      }),
    []
  );

  return (
    <MapContainer
      center={senderLocation}
      zoom={15}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={senderLocation} icon={senderIcon}>
        <Popup>You (Sender)</Popup>
      </Marker>
      <Marker position={riderLocation} icon={riderIcon}>
        <Popup>Rider</Popup>
      </Marker>
      {packageLocation && (
        <Marker position={packageLocation} icon={packageIcon}>
          <Popup>Package</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}