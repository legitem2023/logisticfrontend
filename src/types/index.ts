export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  timestamp: number;
  token?: string;
  userId:string;
}

export interface StoredLocation extends LocationData {
  id?: number;
  synced: boolean;
  createdAt: number;
}
