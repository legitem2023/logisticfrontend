export async function GET(request) {
  const targetUrl = 'https://logisticbackend-bkc3.onrender.com/graphql';
  
  // Simple GraphQL query to check if server is alive
  const graphqlQuery = JSON.stringify({
    query: `
      query HealthCheck {
        __typename
      }
    `
  });

  try {
    console.log(`🕐 Pinging: ${targetUrl}`);
    
    // Send GraphQL request
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: graphqlQuery,
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Ping successful to GraphQL server`);
      return new Response(JSON.stringify({ 
        success: true, 
        timestamp: new Date().toISOString() 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log(`⚠️ Ping received status: ${response.status}`);
      return new Response(JSON.stringify({ 
        success: false, 
        status: response.status 
      }), {
        status: 200, // Still return 200 so cron doesn't think it failed
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Ping failed:', error.message);
    return new Response(JSON.stringify({ 
      error: 'Ping failed', 
      message: error.message 
    }), {
      status: 200, // Still return 200 to avoid cron failure alerts
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
