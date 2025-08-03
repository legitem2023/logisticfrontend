const GRAPHQL_ENDPOINT = 'https://your-backend.com/graphql'; // Your actual GraphQL endpoint

// GraphQL location mutation
const LOCATION_MUTATION = `
  mutation TrackLocation($input: LocationInput!) {
    trackLocation(input: $input) {
      success
      message
    }
  }
`;

async function sendLocationToGraphQL(locationData) {
  const variables = {
    input: {
      latitude: locationData.lat,
      longitude: locationData.lng,
      accuracy: locationData.accuracy,
      timestamp: locationData.timestamp,
      userId: locationData.userId  // Add user ID from your PWA
    }
  };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (await getAuthToken()) // Optional auth
      },
      body: JSON.stringify({
        query: LOCATION_MUTATION,
        variables
      })
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data.trackLocation;
  } catch (error) {
    console.error('GraphQL error:', error);
    // Store failed mutations for retry
    await cacheFailedMutation({ query: LOCATION_MUTATION, variables });
    throw error;
  }
}

// Cache failed GraphQL operations
async function cacheFailedMutation(mutation) {
  const cache = await caches.open('graphql-failures');
  await cache.put(
    new Request('failed_mutation_' + Date.now()),
    new Response(JSON.stringify(mutation))
  );
}

// Retrieve auth token from IndexedDB
async function getAuthToken() {
  return new Promise((resolve) => {
    if (!self.indexedDB) return resolve(null);
    
    const request = indexedDB.open('auth-store');
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction('tokens', 'readonly');
      const store = tx.objectStore('tokens');
      const getReq = store.get('authToken');
      
      getReq.onsuccess = () => resolve(getReq.result?.token || null);
      getReq.onerror = () => resolve(null);
    };
    request.onerror = () => resolve(null);
  });
      }
