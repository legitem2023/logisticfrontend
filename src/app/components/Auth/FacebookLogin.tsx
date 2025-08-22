'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FacebookLogin = () => {
  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) return;

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.FACEBOOK_CLIENT_ID, // ← replace this!
          cookie: true,
          xfbml: true,
          version: 'v19.0',
        });
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) return;

    window.FB.login(
      function (response: any) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          console.log(accessToken,"fb");
          alert('Login successful! Access token: ' + accessToken);
        } else {
          console.error('User cancelled login or did not authorize');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <button onClick={handleFacebookLogin} disabled className="bg-blue-600 text-white px-4 py-2 rounded w-full">
      Login with Facebook
    </button> 
  );
};

export default FacebookLogin;
