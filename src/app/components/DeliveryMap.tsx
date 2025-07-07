'use client';

import { useEffect, useRef } from 'react';
import { useSubscription, gql } from '@apollo/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// const SUB_DRIVER_LOCATION = gql`
//   subscription {
//     driverLocationUpdated {
//       lat
//       lng
//     }
//   }
// `;

export default function DeliveryMap() {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routingRef = useRef<any>(null);

  const riderIcon = L.icon({
    iconUrl: '/icons/rider.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  
  const senderIcon = L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHYgpRPaXFg8x_RiFJXQRSXfxzmP8Ci1E18Q&s',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  
  const receiverIcon = L.icon({
    iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8ctukBNdRmOgtQjXzS2YP55ik9J2YtXFZg&s',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  



  const sender = L.latLng(14.5995, 120.9842);
  const receiver = L.latLng(14.8874, 120.3666);

  // const { data } = useSubscription(SUB_DRIVER_LOCATION);

  useEffect(() => {
    const map = L.map('map').setView(sender, 13);
    mapRef.current = map;


    L.marker(sender, { icon: senderIcon }).bindPopup('Rider').addTo(map);
    L.marker(receiver, { icon: receiverIcon }).bindPopup('Dropzone').addTo(map);
    


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker(sender,{ icon: senderIcon }).bindPopup('Rider').addTo(map);
    L.marker(receiver,{ icon: receiverIcon }).bindPopup('Dropzone').addTo(map);

    import('leaflet-routing-machine').then(() => {
      routingRef.current = L.Routing.control({
        waypoints: [sender, receiver],
        // @ts-expect-error - not typed in leaflet-routing-machine
        createMarker: () => null,
      }).addTo(map);
      
    });
  }, []);

  // useEffect(() => {
  //   if (!data) return;

  //   const { lat, lng } = data.driverLocationUpdated;
  //   const latLng = L.latLng(lat, lng);

  //   if (!markerRef.current) {
  //     markerRef.current = L.marker(latLng).addTo(mapRef.current!).bindPopup('Magdadala');
  //   } else {
  //     markerRef.current.setLatLng(latLng);
  //   }

  //   if (routingRef.current) {
  //     routingRef.current.setWaypoints([latLng, receiver]);
  //   }
  // }, [data]);

  return <div id="map" style={{ height: '500px' }} />;
}
