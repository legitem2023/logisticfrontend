import { Suggestion, CacheEntry } from '../types';

export const GEOCODING_CONFIG = {
  NOMINATIM: {
    baseUrl: 'https://nominatim.openstreetmap.org/search',
    reverseUrl: 'https://nominatim.openstreetmap.org/reverse',
    params: {
      format: 'json',
      addressdetails: 1,
      countrycodes: 'ph',
      'accept-language': 'en',
      bounded: 1,
      limit: 8
    }
  },
  GOOGLE: {
    baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  }
};

// Address cache (moved from component) - FIXED: Changed to const
const addressCache = new Map<string, CacheEntry>();

// Helper function for confidence calculation
const calculateNominatimConfidence = (result: any): string => {
  let confidence = 'low';
  
  if (result.address) {
    const hasHouseNumber = result.address.house_number || result.address.house;
    const hasStreet = result.address.road || result.address.street;
    const hasCity = result.address.city || result.address.town || result.address.village;
    
    if (hasHouseNumber && hasStreet && hasCity) {
      confidence = 'high';
    } else if ((hasHouseNumber || hasStreet) && hasCity) {
      confidence = 'medium';
    }
  }
  
  return confidence;
};

// Nominatim geocoding
const geocodeWithNominatim = async (query: string): Promise<Suggestion[]> => {
  const params = new URLSearchParams({
    q: encodeURIComponent(query),
    format: String(GEOCODING_CONFIG.NOMINATIM.params.format),
    addressdetails: String(GEOCODING_CONFIG.NOMINATIM.params.addressdetails),
    countrycodes: String(GEOCODING_CONFIG.NOMINATIM.params.countrycodes),
    'accept-language': String(GEOCODING_CONFIG.NOMINATIM.params['accept-language']),
    bounded: String(GEOCODING_CONFIG.NOMINATIM.params.bounded),
    limit: String(GEOCODING_CONFIG.NOMINATIM.params.limit)
  });

  try {
    const response = await fetch(
      `${GEOCODING_CONFIG.NOMINATIM.baseUrl}?${params}`
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.place_id,
      name: item.display_name,
      formatted_address: item.display_name,
      geometry: {
        location: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      },
      provider: 'nominatim',
      confidence: calculateNominatimConfidence(item),
      address: {
        street: item.address?.road || '',
        city: item.address?.city || item.address?.town || item.address?.village || '',
        state: item.address?.state || '',
        country: item.address?.country || '',
        postalCode: item.address?.postcode || ''
      }
    }));
    
  } catch (error) {
    console.error('Nominatim geocoding error:', error);
    return [];
  }
};

// Google geocoding
const geocodeWithGoogle = async (query: string): Promise<Suggestion[]> => {
  if (!GEOCODING_CONFIG.GOOGLE.apiKey) {
    console.warn('Google Maps API key not configured');
    return [];
  }

  const params = new URLSearchParams({
    address: encodeURIComponent(query),
    key: GEOCODING_CONFIG.GOOGLE.apiKey,
    components: 'country:PH'
  });

  const response = await fetch(
    `${GEOCODING_CONFIG.GOOGLE.baseUrl}?${params}`
  );

  if (!response.ok) {
    throw new Error('Google geocoding failed');
  }

  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error(`Google geocoding error: ${data.status}`);
  }

  return data.results.map((result: any) => ({
    formatted_address: result.formatted_address,
    geometry: {
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      }
    },
    provider: 'google',
    confidence: result.geometry.location_type === 'ROOFTOP' ? 'high' : 'medium'
  }));
};

const shouldFallbackToGoogle = (nominatimResults: Suggestion[], query: string): boolean => {
  if (nominatimResults.length === 0) return true;
  
  const firstResult = nominatimResults[0];
  
  const vagueTerms = ['unclassified road', 'unknown', 'unnamed'];
  if (vagueTerms.some(term => 
    firstResult.formatted_address.toLowerCase().includes(term))) {
    return true;
  }
  
  const queryWords = query.toLowerCase().split(' ');
  const addressWords = firstResult.formatted_address.toLowerCase();
  const matchCount = queryWords.filter(word => 
    addressWords.includes(word)
  ).length;
  
  if (matchCount / queryWords.length < 0.5) {
    return true;
  }
  
  return false;
};

// Main geocoding function
export const geocodeAddress = async (query: string, provider: 'nominatim' | 'google' | 'auto' = 'auto'): Promise<Suggestion[]> => {
  if (!query || query.length < 3) {
    return [];
  }

  const cacheKey = `${provider}:${query.toLowerCase().trim()}`;
  
  if (addressCache.has(cacheKey)) {
    const cached = addressCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < (1000 * 60 * 60)) {
      return cached.results;
    }
  }

  try {
    let results: Suggestion[] = [];
    
    if (provider === 'nominatim' || provider === 'auto') {
      results = await geocodeWithNominatim(query);
      
      if (provider === 'auto' && (results.length === 0 || shouldFallbackToGoogle(results, query))) {
        console.log('Falling back to Google for:', query);
        const googleResults = await geocodeWithGoogle(query);
        if (googleResults.length > 0) {
          results = googleResults;
        }
      }
    } else if (provider === 'google') {
      results = await geocodeWithGoogle(query);
    }
    
    addressCache.set(cacheKey, {
      results,
      timestamp: Date.now()
    });
    
    if (addressCache.size > 200) {
      const firstKey = addressCache.keys().next().value;
      addressCache.delete(firstKey);
    }
    
    return results;
    
  } catch (error) {
    console.error('Geocoding error:', error);
    
    if (provider !== 'auto') {
      const fallbackProvider = provider === 'nominatim' ? 'google' : 'nominatim';
      try {
        return await geocodeAddress(query, fallbackProvider);
      } catch (fallbackError) {
        console.error('Fallback geocoding also failed:', fallbackError);
      }
    }
    
    return [];
  }
};

// Reverse geocoding
export const reverseGeocode = async (lat: number, lng: number, provider: 'nominatim' | 'google' = 'nominatim'): Promise<string> => {
  const cacheKey = `reverse:${lat.toFixed(6)}:${lng.toFixed(6)}:${provider}`;
  
  if (addressCache.has(cacheKey)) {
    const cached = addressCache.get(cacheKey);
    if (cached && cached.results[0]) {
      return cached.results[0].formatted_address || '';
    }
  }

  try {
    let address = '';
    
    if (provider === 'nominatim') {
      const response = await fetch(
        `${GEOCODING_CONFIG.NOMINATIM.reverseUrl}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        address = data.display_name;
      }
    } else if (provider === 'google' && GEOCODING_CONFIG.GOOGLE.apiKey) {
      const response = await fetch(
        `${GEOCODING_CONFIG.GOOGLE.baseUrl}?latlng=${lat},${lng}&key=${GEOCODING_CONFIG.GOOGLE.apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK' && data.results[0]) {
          address = data.results[0].formatted_address;
        }
      }
    }
    
    if (address) {
      addressCache.set(cacheKey, {
        results: [{ 
          formatted_address: address, 
          geometry: { location: { lat, lng } },
          provider,
          confidence: 'high'
        }],
        timestamp: Date.now()
      });
    }
    
    return address;
    
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return '';
  }
};

// Real-time geocoding while typing
export const geocodeWhileTyping = async (
  query: string,
  setIsGeocodingTyping: (loading: boolean) => void,
  setTypingCoordinates: (coords: {lat: number, lng: number} | null) => void
): Promise<{lat: number, lng: number} | null> => {
  if (!query || query.length < 5) {
    setTypingCoordinates(null);
    return null;
  }

  setIsGeocodingTyping(true);
  
  try {
    const results = await geocodeAddress(query, 'auto');
    
    if (results.length > 0) {
      const bestResult = results.reduce((best, current) => {
        const bestScore = best.confidence === 'high' ? 3 : best.confidence === 'medium' ? 2 : 1;
        const currentScore = current.confidence === 'high' ? 3 : current.confidence === 'medium' ? 2 : 1;
        return currentScore > bestScore ? current : best;
      }, results[0]);

      const coords = {
        lat: bestResult.geometry.location.lat,
        lng: bestResult.geometry.location.lng
      };
      
      setTypingCoordinates(coords);
      return coords;
    } else {
      setTypingCoordinates(null);
      return null;
    }
  } catch (error) {
    console.error('Real-time geocoding error:', error);
    setTypingCoordinates(null);
    return null;
  } finally {
    setIsGeocodingTyping(false);
  }
};
