import { NextRequest, NextResponse } from 'next/server';
import { LocationData } from '@/types';
import { decryptToken } from '../../../../utils/decryptToken';

import Cookies from 'js-cookie';
export async function POST(request: NextRequest) {
  try {
    const locationData: LocationData & { token?: string } = await request.json();

    // Validate required fields
    if (!locationData.latitude || !locationData.longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (!locationData.token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    // Here you would:
    // 1. Verify the JWT token
    // 2. Extract user ID from token
    // 3. Save to your database (GraphQL, PostgreSQL, etc.)
    // 4. Process the location data

    const token = Cookies.get('token');
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    const payload = await decryptToken(token, secret);
    
    console.log('Received location:', {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy,
      timestamp: new Date(locationData.timestamp).toISOString(),
      userID: payload.userId,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Location received successfully' 
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
