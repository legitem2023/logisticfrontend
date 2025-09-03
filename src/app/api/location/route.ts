import { NextRequest, NextResponse } from 'next/server';
import { LocationData } from '@/types';
import { decryptToken } from '../../../../utils/decryptToken';
import { LOCATIONTRACKING } from '../../../../graphql/mutation';
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

function getApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_SERVER_LINK!,
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
    ssrMode: true,
  });
}

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


    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'JWT secret not configured' },
        { status: 500 }
      );
    }

    const payload = await decryptToken(locationData.token, secret);
    const client = getApolloClient();

    await client.mutate({
      mutation: LOCATIONTRACKING,
      variables: {
        input: {
          userID: locationData.userId,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          speed: locationData.speed || 0,
          heading: locationData.heading || 0,
          accuracy: locationData.accuracy,
          timestamp: new Date(locationData.timestamp).toISOString()
        },
      },
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
