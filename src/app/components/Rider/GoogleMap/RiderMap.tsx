'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from "../../ui/Button";
import { XIcon, Sun, Moon, Clock, MapPin, Navigation } from "lucide-react";
import { showToast } from '../../../../../utils/toastify';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../../Redux/tempUserSlice';
import { SENDNOTIFICATION } from "../../../../../graphql/mutation";
import { useMutation, useSubscription } from "@apollo/client";
import { LocationTracking } from '../../../../../graphql/subscription';
import { FaMotorcycle, FaMapMarkerAlt, FaCrown, FaChevronUp, FaChevronDown, FaExclamationTriangle, FaStore, FaRoute } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { calculateEta, convertMinutesToHours } from '../../../../../utils/calculateEta';

type Coordinates = { lat: number; lng: number; }

// Google Maps types
interface GoogleMapRef {
  map: google.maps.Map | null;
  directionsService: google.maps.DirectionsService | null;
  directionsRenderer: google.maps.DirectionsRenderer | null;
  riderMarker: google.maps.Marker | null;
  senderMarker: google.maps.Marker | null;
  receiverMarker: google.maps.Marker | null;
}

// Map styles
const darkMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
];

const lightMapStyle: google.maps.MapTypeStyle[] = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#dedede" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#e8e8e8" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c6c6c6" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#f2f2f2" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c6e6ff" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }]
  }
];

export default function RiderMap({ PickUpCoordinates, DropOffCoordinates, deliveryId, senderId, setMap, delivery }: {  
  PickUpCoordinates: Coordinates, 
  DropOffCoordinates: Coordinates, 
  deliveryId: any, 
  senderId: any, 
  setMap: () => void, 
  delivery: any 
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<GoogleMapRef>({
    map: null,
    directionsService: null,
    directionsRenderer: null,
    riderMarker: null,
    senderMarker: null,
    receiverMarker: null
  });

  // Tracking state
  const [acceptancePoint, setAcceptancePoint] = useState<google.maps.LatLng | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [panelHeight, setPanelHeight] = useState(320);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('light');
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const progressRef = useRef({
    totalDistance: null as number | null,
    checkInterval: null as NodeJS.Timeout | null
  });

  const [sendNotification] = useMutation(SENDNOTIFICATION, {
    onCompleted: () => showToast("Notification sent", "success"),
    onError: (e: any) => console.log('Notification Error', e)
  });

  const location = useSelector((state: any) => state.location.current);
  const globalUserId = useSelector(selectTempUserId);
  const [status, setStatus] = useState<'pending' | 'arrived' | 'failed' | 'delivered' | null>(null);

  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: globalUserId },
  });

  // Load Google Maps API
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    script.onerror = () => console.error('Google Maps failed to load');
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleNotification = async (message: string) => {
    await sendNotification({
      variables: { 
        userId: globalUserId, 
        title: "Delivery Update", 
        message: message, 
        type: 'Status Update' 
      }
    });
  };

  // Create Google Maps LatLng objects
  const riderLatLng = locationData?.LocationTracking  
    ? new google.maps.LatLng(locationData.LocationTracking.latitude, locationData.LocationTracking.longitude)
    : location  
    ? new google.maps.LatLng(location.latitude, location.longitude)
    : null;

  const proofOfPickup = delivery.proofOfPickup.length;

  // Conditionally set sender and receiver based on proofOfPickup
  const senderLatLng = proofOfPickup === 0 
    ? new google.maps.LatLng(PickUpCoordinates?.lat, PickUpCoordinates?.lng)
    : null;

  const receiverLatLng = proofOfPickup > 0 
    ? new google.maps.LatLng(DropOffCoordinates?.lat, DropOffCoordinates?.lng)
    : null;

  // Calculate ETA based on current target
  const targetLatLng = proofOfPickup === 0 ? senderLatLng : receiverLatLng;

  // Helper function to calculate distance between two LatLng points
  const calculateDistance = (point1: google.maps.LatLng | null, point2: google.maps.LatLng | null) => {
    if (!point1 || !point2) return 0;
    return google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
  };

  const distanceInKm = targetLatLng && riderLatLng 
    ? parseFloat((calculateDistance(riderLatLng, targetLatLng) / 1000).toFixed(2))
    : 0;

  const { eta, etaInMinutes } = calculateEta(distanceInKm, "Priority");
  const ETA = convertMinutesToHours(etaInMinutes);

  // Function to toggle map theme
  const toggleMapTheme = () => {
    setMapTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Update map theme when it changes
  useEffect(() => {
    if (!googleMapRef.current.map || !isGoogleMapsLoaded) return;

    const mapOptions: google.maps.MapOptions = {
      styles: mapTheme === 'dark' ? darkMapStyle : lightMapStyle
    };
    
    googleMapRef.current.map.setOptions(mapOptions);
  }, [mapTheme, isGoogleMapsLoaded]);

  // 1. Set acceptance point when rider first appears
  useEffect(() => {
    if (riderLatLng && !acceptancePoint && senderLatLng) {
      setAcceptancePoint(riderLatLng);
      progressRef.current.totalDistance = calculateDistance(riderLatLng, senderLatLng);
      console.log(`Total distance to pickup: ${progressRef.current.totalDistance?.toFixed(0)} meters`);
    }
  }, [riderLatLng, acceptancePoint, senderLatLng]);

  // 2. Automatic progress tracking
  useEffect(() => {
    if (!riderLatLng || !acceptancePoint || !progressRef.current.totalDistance || notificationSent || !senderLatLng) return;

    // Clear any existing interval
    if (progressRef.current.checkInterval) {
      clearInterval(progressRef.current.checkInterval);
    }

    // Set up new interval to check progress
    progressRef.current.checkInterval = setInterval(() => {
      const currentDistance = calculateDistance(riderLatLng, senderLatLng);
      const progress = ((progressRef.current.totalDistance! - currentDistance) / progressRef.current.totalDistance!) * 100;

      // Check if rider is close to the pickup location
      if (currentDistance < 100 && !notificationSent) { // 100 meters threshold
        handleNotification("Your delivery rider is approaching your location!");
        setNotificationSent(true);
        setStatus('arrived');
        if (progressRef.current.checkInterval) {
          clearInterval(progressRef.current.checkInterval);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => {
      if (progressRef.current.checkInterval) {
        clearInterval(progressRef.current.checkInterval);
      }
    };
  }, [acceptancePoint, notificationSent, riderLatLng, senderLatLng]);

  // Initialize Google Map
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapContainerRef.current) return;

    // Initialize map with theme
    const mapOptions: google.maps.MapOptions = {
      center: PickUpCoordinates,
      zoom: 13,
      styles: mapTheme === 'dark' ? darkMapStyle : lightMapStyle,
      disableDefaultUI: true,
      zoomControl: false,
    };

    googleMapRef.current.map = new google.maps.Map(mapContainerRef.current, mapOptions);
    
    // Initialize directions service and renderer
    googleMapRef.current.directionsService = new google.maps.DirectionsService();
    googleMapRef.current.directionsRenderer = new google.maps.DirectionsRenderer({
      map: googleMapRef.current.map,
      suppressMarkers: true,
      preserveViewport: true
    });

    // Create markers
    if (senderLatLng) {
      googleMapRef.current.senderMarker = new google.maps.Marker({
        position: senderLatLng,
        map: googleMapRef.current.map,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGN0YwMCI+PHBhdGggZD0iTTEyIDJDNy4wMyAyIDMgNi4wMyAzIDExYzAgMy4yNSAxLjg0IDYuMDIgNC41IDcuOTNsMy41IDQuMDcgMy41LTQuMDdjMi42Ni0xLjkxIDQuNS00LjY4IDQuNS03LjkzIDAtNC45Ny00LjAzLTktOS05em0wIDExLjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==',
          scaledSize: new google.maps.Size(32, 32)
        },
        title: "Pickup Location"
      });
    }

    if (receiverLatLng) {
      googleMapRef.current.receiverMarker = new google.maps.Marker({
        position: receiverLatLng,
        map: googleMapRef.current.map,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzM3ODgzMSI+PHBhdGggZD0iTTEyIDJDNy4wMyAyIDMgNi4wMyAzIDExYzAgMy4yNSAxLjg0IDYuMDIgNC41IDcuOTNsMy41IDQuMDcgMy41LTQuMDdjMi42Ni0xLjkxIDQuNS00LjY4IDQuNS03LjkzIDAtNC45Ny00LjAzLTktOS05em0wIDExLjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==',
          scaledSize: new google.maps.Size(32, 32)
        },
        title: "Drop-off Location"
      });
    }

    // Add custom zoom control
    const zoomControl = createZoomControl(mapTheme);
    googleMapRef.current.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControl);

    // Calculate and display route if we have both points
    if (senderLatLng && receiverLatLng) {
      calculateRoute(senderLatLng, receiverLatLng);
    }

    return () => {
      // Clean up map on component unmount
      if (googleMapRef.current.map) {
        googleMapRef.current.directionsRenderer?.setMap(null);
        googleMapRef.current.map = null;
      }
    };
  }, [isGoogleMapsLoaded]);

  // Update rider position when location changes
  useEffect(() => {
    if (!googleMapRef.current.riderMarker || !riderLatLng) return;

    // Update rider marker position
    googleMapRef.current.riderMarker.setPosition(riderLatLng);
    
    // Pan map to follow rider if map exists
    if (googleMapRef.current.map) {
      googleMapRef.current.map.panTo(riderLatLng);
    }
  }, [riderLatLng]);

  // Handle panel dragging
  useEffect(() => {
    if (!panelRef.current) return;

    let startY = 0;
    let startHeight = 0;

    const onMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = panelHeight;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const delta = startY - e.clientY;
      const newHeight = Math.min(Math.max(200, startHeight + delta), 500);
      setPanelHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const dragHandle = panelRef.current.querySelector('.drag-handle');
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', onMouseDown);
    }

    return () => {
      if (dragHandle) {
        dragHandle.removeEventListener('mousedown', onMouseDown);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [panelHeight]);

  // Helper function to create zoom control
  const createZoomControl = (theme: 'dark' | 'light') => {
    const controlDiv = document.createElement('div');
    controlDiv.style.margin = '10px';
    controlDiv.style.display = 'flex';
    controlDiv.style.flexDirection = 'column';
    controlDiv.style.gap = '2px';

    // Zoom in button
    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '+';
    zoomInButton.style.width = '30px';
    zoomInButton.style.height = '30px';
    zoomInButton.style.borderRadius = '2px';
    zoomInButton.style.border = 'none';
    zoomInButton.style.background = theme === 'dark' ? '#242f3e' : '#ffffff';
    zoomInButton.style.color = theme === 'dark' ? '#ffffff' : '#000000';
    zoomInButton.style.fontSize = '18px';
    zoomInButton.style.cursor = 'pointer';
    zoomInButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    zoomInButton.onclick = () => {
      if (googleMapRef.current.map) {
        googleMapRef.current.map.setZoom(googleMapRef.current.map.getZoom()! + 1);
      }
    };

    // Zoom out button
    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '-';
    zoomOutButton.style.width = '30px';
    zoomOutButton.style.height = '30px';
    zoomOutButton.style.borderRadius = '2px';
    zoomOutButton.style.border = 'none';
    zoomOutButton.style.background = theme === 'dark' ? '#242f3e' : '#ffffff';
    zoomOutButton.style.color = theme === 'dark' ? '#ffffff' : '#000000';
    zoomOutButton.style.fontSize = '18px';
    zoomOutButton.style.cursor = 'pointer';
    zoomOutButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    zoomOutButton.onclick = () => {
      if (googleMapRef.current.map) {
        googleMapRef.current.map.setZoom(googleMapRef.current.map.getZoom()! - 1);
      }
    };

    controlDiv.appendChild(zoomInButton);
    controlDiv.appendChild(zoomOutButton);

    return controlDiv;
  };

  // Function to calculate and display route
  const calculateRoute = (origin: google.maps.LatLng, destination: google.maps.LatLng) => {
    if (!googleMapRef.current.directionsService || !googleMapRef.current.directionsRenderer) return;

    googleMapRef.current.directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === 'OK' && response) {
          googleMapRef.current.directionsRenderer?.setDirections(response);
          
          // Calculate and set estimated time
          const route = response.routes[0];
          if (route.legs.length > 0) {
            setEstimatedTime(route.legs[0].duration?.value || null);
          }
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  // Create rider marker when map is ready
  useEffect(() => {
    if (!googleMapRef.current.map || !riderLatLng) return;

    // Create rider marker if it doesn't exist
    if (!googleMapRef.current.riderMarker) {
      googleMapRef.current.riderMarker = new google.maps.Marker({
        position: riderLatLng,
        map: googleMapRef.current.map,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGN0YwMCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzNzg4MzEiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkZGIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzM3ODgzMSIvPjwvc3ZnPg==',
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        },
        title: "Rider Position"
      });
    }
  }, [googleMapRef.current.map, riderLatLng]);

  // Toggle panel open/close
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    setPanelHeight(isPanelOpen ? 80 : 320);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${mapTheme === 'dark' ? 'bg-[#001a00]' : 'bg-[#e8f5e8]'}`}>
      {/* Fixed top bar with theme-appropriate background */}
      <div className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50 border-b backdrop-blur-md ${
        mapTheme === 'dark' 
          ? 'bg-gradient-to-r from-[#002000]/90 to-[#001800]/90 border-yellow-400/30' 
          : 'bg-[linear-gradient(301deg,rgba(8,137,54,1)_0%,rgba(0,44,16,1)_50%)] border-yellow-300/30'
      }`}>
        <h2 className={`text-lg font-semibold ${mapTheme === 'dark' ? 'text-yellow-100' : 'text-yellow-100'}`}>
          <span className="flex items-center gap-2">
            <MdOutlineDeliveryDining className="w-5 h-5" />
            Delivery #{deliveryId.slice(-6)}
          </span>
        </h2>
        <div className="flex gap-2">
          {/* Theme Toggle Button */}
          <button onClick={toggleMapTheme} className={`p-2 rounded-full transition-colors shadow-lg ${
            mapTheme === 'dark' 
              ? 'text-yellow-300 bg-[#002000]/80 hover:bg-[#001800]/80' 
              : 'text-yellow-200 bg-green-800/80 hover:bg-green-700/80'
          }`} title={`Switch to ${mapTheme === 'dark' ? 'light' : 'dark'} mode`}>
            {mapTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={setMap} className={`p-2 rounded-full transition-colors shadow-lg ${
            mapTheme === 'dark' 
              ? 'text-yellow-300 bg-[#002000]/80 hover:bg-[#001800]/80' 
              : 'text-yellow-200 bg-green-800/80 hover:bg-green-700/80'
          }`}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Bottom panel */}
      <div 
        ref={panelRef}
        className={`fixed left-4 right-4 rounded-t-xl shadow-lg transition-all duration-300 ${
          mapTheme === 'dark' 
            ? 'bg-gradient-to-b from-[#002000] to-[#001800] border border-yellow-400/20' 
            : 'bg-gradient-to-b from-green-800 to-green-900 border border-yellow-300/20'
        }`}
        style={{ 
          height: `${panelHeight}px`, 
          bottom: isPanelOpen ? '0' : `-${panelHeight - 80}px` 
        }}
      >
        {/* Drag handle */}
        <div 
          className="drag-handle absolute top-0 left-0 right-0 h-8 flex justify-center items-center cursor-row-resize"
          onClick={togglePanel}
        >
          <div className={`w-12 h-1 rounded-full ${mapTheme === 'dark' ? 'bg-yellow-400/50' : 'bg-yellow-300/50'}`}></div>
        </div>

        {/* Panel content */}
        <div className="pt-6 px-4 pb-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${mapTheme === 'dark' ? 'text-yellow-100' : 'text-yellow-100'}`}>
              Delivery Details
            </h3>
            <button onClick={togglePanel} className={`p-1 rounded-full ${mapTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-200'}`}>
              {isPanelOpen ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${mapTheme === 'dark' ? 'bg-[#001a00]' : 'bg-green-700'}`}>
              <div className="flex items-center gap-2 mb-1">
                <GiPathDistance className={`w-4 h-4 ${mapTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-300'}`} />
                <span className={`text-sm ${mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-100'}`}>Distance</span>
              </div>
              <p className={`text-lg font-bold ${mapTheme === 'dark' ? 'text-yellow-100' : 'text-white'}`}>
                {distanceInKm.toFixed(1)} km
              </p>
            </div>

            <div className={`p-3 rounded-lg ${mapTheme === 'dark' ? 'bg-[#001a00]' : 'bg-green-700'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Clock className={`w-4 h-4 ${mapTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-300'}`} />
                <span className={`text-sm ${mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-100'}`}>ETA</span>
              </div>
              <p className={`text-lg font-bold ${mapTheme === 'dark' ? 'text-yellow-100' : 'text-white'}`}>
                {ETA}
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg mb-4 ${mapTheme === 'dark' ? 'bg-[#001a00]' : 'bg-green-700'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FaRoute className={`w-4 h-4 ${mapTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-300'}`} />
              <span className={`text-sm font-semibold ${mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-100'}`}>Route Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                status === 'arrived' ? 'bg-green-500' : 
                status === 'delivered' ? 'bg-green-500' : 
                'bg-yellow-500'
              }`}></div>
              <span className={`text-sm ${mapTheme === 'dark' ? 'text-yellow-100' : 'text-white'}`}>
                {status === 'arrived' ? 'Rider has arrived at pickup' : 
                 status === 'delivered' ? 'Package delivered' : 
                 'Rider is on the way'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
              <FaMotorcycle className="mr-2" />
              Contact Rider
            </Button>
            <Button className={`flex-1 ${
              mapTheme === 'dark' 
                ? 'bg-gradient-to-r from-[#002000] to-[#001800] border border-yellow-400/30 text-yellow-300 hover:from-[#001800] hover:to-[#001400]' 
                : 'bg-gradient-to-r from-green-700 to-green-800 border border-yellow-300/30 text-yellow-200 hover:from-green-800 hover:to-green-900'
            }`}>
              <Navigation className="mr-2" />
              Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
        }
