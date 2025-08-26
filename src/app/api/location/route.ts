import { NextRequest, NextResponse } from 'next/server';
import { LocationData } from '@/types';
import { useMutation, useSubscription } from '@apollo/client';
import { decryptToken } from '../../../../utils/decryptToken';
import { LOCATIONTRACKING } from '../../../../graphql/mutation';
import { LocationTracking } from '../../../../graphql/subscription';
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
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
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK!,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});
    
    const token = Cookies.get('token');
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    const payload = await decryptToken(token, secret);

   await client.mutate({
        mutation: LOCATIONTRACKING,
        variables: {
          input: {
            userID: payload.userId,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            speed: coords.speed || 0,
            heading: coords.heading || 0,
            accuracy: locationData.accuracy,
            batteryLevel: null,
            timestamp:new Date(locationData.timestamp).toISOString()
          },
        },
      });
    
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
