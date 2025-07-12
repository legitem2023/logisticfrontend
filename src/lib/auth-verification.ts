// Google Verification
export async function verifyGoogleToken(idToken: string) {
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return !!ticket.getPayload();
  } catch (error) {
    console.error("Google verification failed:", error);
    return false;
  }
}

// Facebook Verification (from previous example)
export async function verifyFacebookToken(accessToken: string) {
  const verifyUrl = `https://graph.facebook.com/v19.0/me?access_token=${accessToken}&fields=id`;
  
  try {
    const response = await fetch(verifyUrl);
    const data = await response.json();
    return !data.error && data.id;
  } catch (error) {
    console.error("Facebook verification failed:", error);
    return false;
  }
}