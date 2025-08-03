// /public/sw.js
const CACHE_NAME = 'location-cache-v1';
const ENDPOINT = 'https://your-api.com/locations';

// Install service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'location-update') {
    event.waitUntil(getAndSendLocation());
  }
});

// Handle push notifications (optional wake-up)
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  if (data?.type === 'wake-up-for-location') {
    getAndSendLocation();
  }
});

// Location tracking function
async function getAndSendLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000
      });
    });

    const locationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date().toISOString()
    };

    // Store in cache if offline
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      new Request('LOCATION_DATA', { 
        body: JSON.stringify(locationData) 
      })
    );

    // Try to send to server
    await sendLocationToServer(locationData);
  } catch (error) {
    console.error('Location error:', error);
  }
}

async function sendLocationToServer(data) {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to send location');
    console.log('Location sent successfully');
  } catch (error) {
    console.error('Failed to send location:', error);
    throw error;
  }
}
