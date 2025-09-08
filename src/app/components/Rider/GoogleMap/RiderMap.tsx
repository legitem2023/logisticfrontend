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
import { FaMotorcycle, FaMapMarkerAlt, FaCrown, FaChevronUp,FaChevronDown, FaExclamationTriangle, FaStore, FaRoute } from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import { calculateEta, convertMinutesToHours } from '../../../../../utils/calculateEta';

type Coordinates = {
  lat: number;
  lng: number;
}

// Google Maps types
interface GoogleMapRef {
  map: google.maps.Map | null;
  directionsService: google.maps.DirectionsService | null;
  directionsRenderer: google.maps.DirectionsRenderer | null;
  riderMarker: google.maps.Marker | null;
  senderMarker: google.maps.Marker | null;
  receiverMarker: google.maps.Marker | null;
}

export default function RiderMap({ PickUpCoordinates, DropOffCoordinates, deliveryId, senderId, setMap, delivery }: { 
  PickUpCoordinates: Coordinates,
  DropOffCoordinates: Coordinates,
  deliveryId: any,
  senderId: any,
  setMap: () => void,
  delivery:any
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleNotification = async (message: string) => {
    await sendNotification({
      variables: {
        userId: globalUserId, 
        title: message, 
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

    const mapStyle = mapTheme === 'dark' 
      ? [
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
        ]
      : [];

    googleMapRef.current.map.setOptions({ styles: mapStyle });
  }, [mapTheme, isGoogleMapsLoaded]);

  // 1. Set acceptance point when rider first appears
  useEffect(() => {
    if (riderLatLng && !acceptancePoint && senderLatLng) {
      setAcceptancePoint(riderLatLng);
      progressRef.current.totalDistance = calculateDistance(riderLatLng, senderLatLng);
      console.log(`Total distance to pickup: ${progressRef.current.totalDistance?.toFixed(0)} meters`);
      
      // Calculate estimated time (1.5 minutes per 100 meters)
      const timeEstimate = (progressRef.current.totalDistance / 100) * 1.5;
      setEstimatedTime(Math.round(timeEstimate));
    }
  }, [riderLatLng]);

  // 2. Automatic progress tracking
  useEffect(() => {
    if (!riderLatLng || !acceptancePoint || !progressRef.current.totalDistance || notificationSent || !senderLatLng) return;

    const checkProgress = () => {
      const currentDistance = calculateDistance(acceptancePoint, riderLatLng);
      const progressRatio = currentDistance / progressRef.current.totalDistance!;

      console.log(`Progress: ${(progressRatio * 100).toFixed(1)}%`);

      if (progressRatio >= 0.25) {
        handleNotification("🚀 Rider is on the way to pick up your order!");
        setNotificationSent(true);
        
        // Clean up interval
        if (progressRef.current.checkInterval) {
          clearInterval(progressRef.current.checkInterval);
        }
      }
    };

    // Check every 10 seconds
    progressRef.current.checkInterval = setInterval(checkProgress, 10000);
    
    // Initial check
    checkProgress();

    return () => {
      if (progressRef.current.checkInterval) {
        clearInterval(progressRef.current.checkInterval);
      }
    };
  }, [acceptancePoint, notificationSent]);

  // Initialize Google Map
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapContainerRef.current) return;

    // Set initial view based on current target
    const initialView = proofOfPickup === 0 ? senderLatLng : receiverLatLng;
    
    // Create map
    const map = new google.maps.Map(mapContainerRef.current, {
      center: initialView || riderLatLng || { lat: 0, lng: 0 },
      zoom: 13,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: mapTheme === 'dark' ? [
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
      ] : [],
    });

    // Add zoom control
    const zoomControlDiv = document.createElement('div');
    const zoomControl = createZoomControl(mapTheme);
    zoomControlDiv.appendChild(zoomControl);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);

    // Create directions service and renderer
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#fbbf24',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });

    directionsRenderer.setMap(map);

    // Create custom markers
    const createCustomMarker = (iconSvg: string, position: google.maps.LatLng, title: string) => {
      return new google.maps.Marker({
        position,
        map,
        title,
        icon: {
          url: `data:image/svg+xml;base64,${btoa(iconSvg)}`,
          scaledSize: new google.maps.Size(48, 48),
          anchor: new google.maps.Point(24, 48)
        }
      });
    };

    // Create rider marker
    let riderMarker: google.maps.Marker | null = null;
    if (riderLatLng) {
      const riderSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="24" fill="url(#riderGradient)"/>
          <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z" fill="#fef3c7"/>
          <path d="M5 6h5v2H5zm14 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="#fef3c7"/>
          <defs>
            <linearGradient id="riderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#065f46"/>
              <stop offset="100%" stop-color="#064e3b"/>
            </linearGradient>
          </defs>
        </svg>
      `;
      riderMarker = createCustomMarker(riderSvg, riderLatLng, "Rider");
    }

    // Create sender marker if needed
    let senderMarker: google.maps.Marker | null = null;
    if (proofOfPickup === 0 && senderLatLng) {
      const senderSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="24" fill="url(#senderGradient)"/>
          <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H8v-2h8v2zm0-3H8V9h8v2zm0-3H8V6h8v2z" fill="white"/>
          <defs>
            <linearGradient id="senderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#065f46"/>
              <stop offset="100%" stop-color="#047857"/>
            </linearGradient>
          </defs>
        </svg>
      `;
      senderMarker = createCustomMarker(senderSvg, senderLatLng, "Pickup Point");
    }

    // Create receiver marker if needed
    let receiverMarker: google.maps.Marker | null = null;
    if (proofOfPickup > 0 && receiverLatLng) {
      const receiverSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="24" fill="url(#receiverGradient)"/>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
          <defs>
            <linearGradient id="receiverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#047857"/>
              <stop offset="100%" stop-color="#059669"/>
            </linearGradient>
          </defs>
        </svg>
      `;
      receiverMarker = createCustomMarker(receiverSvg, receiverLatLng, "Delivery Point");
    }

    // Calculate and display route
    if (riderLatLng && (senderLatLng || receiverLatLng)) {
      const waypoints = [];
      
      if (proofOfPickup === 0 && senderLatLng) {
        waypoints.push(senderLatLng);
      }
      
      if (proofOfPickup > 0 && receiverLatLng) {
        waypoints.push(receiverLatLng);
      }

      if (waypoints.length > 0) {
        directionsService.route(
          {
            origin: riderLatLng,
            destination: waypoints[0],
            travelMode: google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error(`Error fetching directions: ${status}`);
            }
          }
        );
      }
    }

    // Store references
    googleMapRef.current = {
      map,
      directionsService,
      directionsRenderer,
      riderMarker,
      senderMarker,
      receiverMarker
    };

    // Update map on window resize
    const handleResize = () => {
      google.maps.event.trigger(map, 'resize');
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up map
      if (googleMapRef.current.map) {
        googleMapRef.current.map = null;
      }
    };
  }, [isGoogleMapsLoaded]);

  // Update rider position when location changes
  useEffect(() => {
    if (!googleMapRef.current.riderMarker || !riderLatLng) return;
    
    googleMapRef.current.riderMarker.setPosition(riderLatLng);
    
    // Update route if rider moves
    if (googleMapRef.current.directionsService && targetLatLng) {
      googleMapRef.current.directionsService.route(
        {
          origin: riderLatLng,
          destination: targetLatLng,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && googleMapRef.current.directionsRenderer) {
            googleMapRef.current.directionsRenderer.setDirections(result);
          }
        }
      );
    }
  }, [riderLatLng]);

  // Handle panel dragging
  useEffect(() => {
    if (!panelRef.current) return;

    const panel = panelRef.current;
    let startY: number, startHeight: number;

    const initDrag = (e: MouseEvent | TouchEvent) => {
      startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startHeight = panelHeight;
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
      panel.classList.add('transition-none');
    };

    const drag = (e: MouseEvent | TouchEvent) => {
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - currentY;
      const newHeight = Math.min(Math.max(startHeight + deltaY, 120), window.innerHeight - 100);
      
      setPanelHeight(newHeight);
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
      panel.classList.remove('transition-none');
      
      // Snap to open/closed positions
      if (panelHeight < 200) {
        setIsPanelOpen(false);
      } else {
        setIsPanelOpen(true);
      }
    };

    const dragHandle = panel.querySelector('.drag-handle');
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', initDrag);
      dragHandle.addEventListener('touchstart', initDrag);
    }

    return () => {
      if (dragHandle) {
        dragHandle.removeEventListener('mousedown', initDrag);
        dragHandle.removeEventListener('touchstart', initDrag);
      }
    };
  }, [panelHeight]);

  // Helper function to create zoom control
  const createZoomControl = (theme: 'dark' | 'light') => {
    const controlDiv = document.createElement('div');
    controlDiv.style.margin = '10px';
    
    // Zoom in button
    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '+';
    zoomInButton.style.cssText = `
      background-color: ${theme === 'dark' ? '#002000' : '#088936'};
      border: none;
      color: ${theme === 'dark' ? '#fef3c7' : 'white'};
      width: 30px;
      height: 30px;
      border-radius: 2px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 4px;
      display: block;
    `;
    zoomInButton.onclick = () => {
      if (googleMapRef.current.map) {
        googleMapRef.current.map.setZoom(googleMapRef.current.map.getZoom() + 1);
      }
    };
    
    // Zoom out button
    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '-';
    zoomOutButton.style.cssText = `
      background-color: ${theme === 'dark' ? '#002000' : '#088936'};
      border: none;
      color: ${theme === 'dark' ? '#fef3c7' : 'white'};
      width: 30px;
      height: 30px;
      border-radius: 2px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      display: block;
    `;
    zoomOutButton.onclick = () => {
      if (googleMapRef.current.map) {
        googleMapRef.current.map.setZoom(googleMapRef.current.map.getZoom() - 1);
      }
    };
    
    controlDiv.appendChild(zoomInButton);
    controlDiv.appendChild(zoomOutButton);
    
    return controlDiv;
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
            Delivery
          </span>
        </h2>
        <div className="flex gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleMapTheme}
            className={`p-2 rounded-full transition-colors shadow-lg ${
              mapTheme === 'dark' 
                ? 'text-yellow-300 bg-[#002000]/80 hover:bg-[#001800]/80' 
                : 'text-yellow-200 bg-green-800/80 hover:bg-green-700/80'
            }`}
            title={`Switch to ${mapTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mapTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={setMap}
            className={`p-2 rounded-full transition-colors shadow-lg ${
              mapTheme === 'dark' 
                ? 'text-yellow-300 bg-[#002000]/80 hover:bg-[#001800]/80' 
                : 'text-yellow-200 bg-green-800/80 hover:bg-green-700/80'
            }`}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map container */}
      <div 
        ref={mapContainerRef}
        id="map"
        className="w-full h-full pt-14 z-0"
      />

      {/* Luxury Control Panel */}
      <div className="absolute top-20 left-4 z-10">
        <div className={`rounded-2xl p-4 shadow-2xl border backdrop-blur-xl ${
          mapTheme === 'dark' 
            ? 'bg-gradient-to-br from-[#002000]/80 to-[#001800]/80 border-lime-400/30' 
            : 'bg-[linear-gradient(301deg,rgba(8,137,54,0.6)_0%,rgba(0,44,16,0.6)_50%)] backdrop-blur-md border-lime-300/30'
        }`}>
          <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              mapTheme === 'dark' ? 'bg-yellow-400 animate-pulse' : 'bg-yellow-300'
            }`}></div>
            <h3 className={`font-bold text-lg ${
              mapTheme === 'dark' ? 'text-yellow-100' : 'text-yellow-100'
            }`}>Delivery #{deliveryId.slice(0, 8)}</h3>
          </div>
          
          <div className="flex items-center text-sm mb-2">
            <GiPathDistance className={`mr-2 ${
              mapTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-200'
            }`} />
            <span className={mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-200'}>
              {distanceInKm > 0 ? `${distanceInKm} km away` : 'Calculating...'}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className={`mr-2 w-4 h-4 ${
              mapTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-200'
            }`} />
            <span className={mapTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-200'}>
              {ETA}
            </span>
          </div>
        </div>
      </div>

      {/* Luxury Status Panel - Fixed height and z-index */}
      <div
        ref={panelRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 backdrop-blur-2xl
          rounded-t-3xl shadow-[0_-20px_50px_-10px_rgba(0,30,0,0.7)]
          transition-all duration-300 ease-out
          ${isPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}
          ${mapTheme === 'dark' 
            ? 'bg-gradient-to-t from-[#001a00]/95 to-[#001200]/95 border-t border-yellow-400/30' 
            : 'bg-[linear-gradient(301deg,rgba(8,137,54,0.6)_0%,rgba(0,44,16,0.6)_50%)] backdrop-blur-md border-t border-yellow-300/30'}
        `}
        style={{ height: `${panelHeight}px` }}
      >
        {/* Draggable Handle */}
        {isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(false)}
          className="mb-10 fixed left-1/2 transform z-50 -translate-x-1/2 
            rounded-full p-3 shadow-lg hover:shadow-xl animate-bounce
            flex items-center justify-center w-12 h-12"
          style={{
            background: mapTheme === 'dark' 
              ? 'linear-gradient(to right, rgba(0, 32, 0, 0.9), rgba(0, 24, 0, 0.9))' 
              : 'linear-gradient(to right, rgba(0, 100, 0, 0.9), rgba(0, 80, 0, 0.9))',
            color: 'white'
          }}
        >
          <FaChevronDown className="text-lg" />
        </button>
      )}

        <div className="pt-8 h-full flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-100 mb-1">Delivery Operations</h2>
            <p className="text-sm" style={{ color: mapTheme === 'dark' ? '#d9f99d' : '#d9f99d' }}>Premium Express Service</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={() => {
                setStatus('arrived');
                handleNotification("🏍️ Rider has arrived at pickup location");
                setIsPanelOpen(false);
              }}
              className={`
                ${proofOfPickup > 0 ? 'hidden' : 'flex' }
                items-center justify-center gap-3 py-4 rounded-xl
                text-white font-semibold shadow-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                focus:ring-2 focus:ring-opacity-50
                border
                ${status === 'arrived' ? 'ring-2' : ''}
                ${mapTheme === 'dark' 
                  ? 'bg-gradient-to-r from-[#002000]/90 to-[#001800]/90 border-yellow-400/30 focus:ring-yellow-500 ring-yellow-400' 
                  : 'bg-gradient-to-r from-cyan-700/90 to-cyan-800/90 border-yellow-300/30 focus:ring-yellow-400 ring-yellow-300'}
              `}>
              <FaStore className="text-xl" />
              <span>Arrived at Pickup Location</span>
            </button>
            
            <button
              onClick={() => {
                setStatus('delivered');
                handleNotification("📦 Package has been successfully delivered");
                setIsPanelOpen(false);
              }}
              className={`
                flex items-center justify-center gap-3 py-4 rounded-xl
                text-white font-semibold shadow-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                focus:ring-2 focus:ring-opacity-50
                border
                ${status === 'delivered' ? 'ring-2' : ''}
                ${mapTheme === 'dark' 
                  ? 'bg-gradient-to-r from-[#001800]/90 to-[#001400]/90 border-yellow-300/30 focus:ring-yellow-400 ring-yellow-300' 
                  : 'bg-gradient-to-r from-green-600/90 to-green-700/90 border-yellow-300/30 focus:ring-yellow-400 ring-yellow-300'}
              `}>
              <MdOutlineDeliveryDining className="text-xl" />
              <span>Mark as Delivered</span>
            </button>
            
            <button
              onClick={() => {
                setStatus('failed');
                handleNotification("⚠️ Delivery attempt failed - Package not delivered");
                setIsPanelOpen(false);
              }}
              className={`
                flex items-center justify-center gap-3 py-4 rounded-xl
                text-white font-semibold shadow-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                focus:ring-2 focus:ring-opacity-50
                border
                ${status === 'failed' ? 'ring-2' : ''}
                ${mapTheme === 'dark' 
                  ? 'bg-gradient-to-r from-rose-800/90 to-rose-700/90 border-rose-400/30 focus:ring-rose-500 ring-rose-400' 
                  : 'bg-gradient-to-r from-rose-700/90 to-rose-600/90 border-rose-300/30 focus:ring-rose-400 ring-rose-300'}
              `}>
              <FaExclamationTriangle className="text-xl" />
              <span>Delivery Attempt Failed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Open Panel Button (when minimized) */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50
            rounded-full p-3 shadow-lg hover:shadow-xl animate-bounce
            flex items-center justify-center w-12 h-12"
          style={{
            background: mapTheme === 'dark' 
              ? 'linear-gradient(to right, rgba(0, 32, 0, 0.9), rgba(0, 24, 0, 0.9))' 
              : 'linear-gradient(to right, rgba(0, 100, 0, 0.9), rgba(0, 80, 0, 0.9))',
            color: 'white'
          }}
        >
          <FaChevronUp className="text-lg" />
        </button>
      )}
    </div>
  );
}
