/*"use client";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    FB: any;
    google: any;
    fbAsyncInit: () => void;
    __fbReady?: boolean;
  }
}

// Facebook SDK loader
function loadFacebookSDK(): Promise<void> {
  if (window.__fbReady) return Promise.resolve();

  return new Promise((resolve) => {
    if (window.FB && window.__fbReady) return resolve();

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.FACEBOOK_CLIENT_ID!,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
      window.__fbReady = true;
      resolve();
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  });
}



export function FacebookLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      await loadFacebookSDK(); // ensures FB.init() has run

      const response: any = await new Promise((resolve) => {
        window.FB.login(resolve, { scope: "email,public_profile" });
      });

      if (response.authResponse?.accessToken) {
        const result = await signIn("facebook-graphql", {
          accessToken: response.authResponse.accessToken,
          redirect: false,
        });

        if (result?.error) throw new Error(result.error);
        router.push("/dashboard");
      } else {
        throw new Error("User cancelled login or did not authorize.");
      }
    } catch (error) {
      console.error("Facebook login failed:", error);
      router.push("/auth-error?code=facebook_failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] disabled:opacity-50"
    >
      <FaFacebook />
      <span>{isLoading ? "Processing..." : "Continue with Facebook"}</span>
    </button>
  );
}*/


"use client";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    FB: any;
    google: any;
    fbAsyncInit: () => void;
    __fbReady?: boolean;
  }
}

// Module-level cache for SDK promise
let fbSDKPromise: Promise<void> | null = null;

// Improved Facebook SDK loader with caching
function loadFacebookSDK(): Promise<void> {
  // Return cached promise if available
  if (fbSDKPromise) return fbSDKPromise;

  // Resolve immediately if already initialized
  if (window.__fbReady) return Promise.resolve();

  fbSDKPromise = new Promise((resolve) => {
    // Create a stable initialization function
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.FACEBOOK_CLIENT_ID!,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
      window.__fbReady = true;
      resolve();
    };

    // Inject script only if not already present
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error("Facebook SDK failed to load");
        resolve(); // Prevent hanging promises
      };
      document.body.appendChild(script);
    }
  });

  return fbSDKPromise;
}

export function FacebookLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);

  // Load SDK on component mount
  useEffect(() => {
    loadFacebookSDK()
      .then(() => setIsSdkReady(true))
      .catch(console.error);
  });

  const handleFacebookLogin = async () => {
    if (!isSdkReady) return;
    
    setIsLoading(true);
    try {
      const response: any = await new Promise((resolve) => {
        window.FB.login(resolve, { scope: "email,public_profile" });
      });

      if (response.authResponse?.accessToken) {
        const result = await signIn("facebook-graphql", {
          accessToken: response.authResponse.accessToken,
          redirect: false,
        });

        if (result?.error) throw new Error(result.error);
        router.push("/dashboard");
      } else {
        throw new Error("User cancelled login or did not authorize.");
      }
    } catch (error) {
      console.error("Facebook login failed:", error);
      router.push("/auth-error?code=facebook_failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={isLoading || !isSdkReady}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg ${
        isSdkReady ? "hover:bg-[#166FE5]" : "opacity-70 cursor-not-allowed"
      } disabled:opacity-50`}
    >
      <FaFacebook />
      <span>
        {!isSdkReady ? "Loading SDK..." : 
         isLoading ? "Processing..." : "Continue with Facebook"}
      </span>
    </button>
  );
}

// GoogleLoginButton remains unchanged
export function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.google) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google SDK loaded");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = async () => {
    if (!window.google) {
      console.error("Google SDK not loaded");
      return;
    }

    setIsLoading(true);
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        scope: "openid profile email",
        callback: async (response) => {
          if (response.error) throw new Error(response.error);
          if (response.credential) {
            const result = await signIn("google-graphql", {
              idToken: response.credential,
              redirect: false,
            });
            if (result?.error) throw new Error(result.error);
            router.push("/dashboard");
          }
        },
      });
      client.requestAccessToken();
    } catch (error) {
      console.error("Google login failed:", error);
      router.push("/auth-error?code=google_failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="w-[100%] flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
    >
      <FaGoogle />
      <span>{isLoading ? "Processing..." : "Continue with Google"}</span>
    </button>
  );
}
