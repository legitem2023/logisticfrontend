export interface Location {
  address: string;
  houseNumber: string;
  contact: string;
  name: string;
  lat: number | null;
  lng: number | null;
}

export interface ActiveLocation {
  type: 'pickup' | 'dropoff';
  index: number | null;
}

export interface Suggestion {
  id?: string;
  name?: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  provider?: string;
  confidence?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface CacheEntry {
  results: Suggestion[];
  timestamp: number;
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  cost: number;
  perKmRate: number;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  icon: any;
  time: string;
  price: string;
}

export interface DeliveryInput {
  assignedRiderId: string | null;
  deliveryFee: number;
  deliveryType: string;
  dropoffAddress: string;
  dropoffLatitude: number | null;
  dropoffLongitude: number | null;
  estimatedDeliveryTime: string;
  eta: string;
  paymentMethod: string;
  paymentStatus: string;
  pickupAddress: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  recipientName: string;
  recipientPhone: string;
  senderId: string | undefined;
  baseRate: number;
  distance: number;
  perKmRate: number;
}
