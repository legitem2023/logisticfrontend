"use client";
import { signIn } from "next-auth/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
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

// --- Facebook SDK Loader ---
let fbSDKReady: Promise<void> | null = null;

function loadFacebookSDK(): Promise<void> {
  if (window.__fbReady) return Promise.resolve(); // Already initialized

  if (!fbSDKReady) {
    fbSDKReady = new Promise((resolve) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
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
        script.onerror = () => {
          console.error("Failed to load Facebook SDK.");
          resolve(); // Prevents hanging
        };
        document.body.appendChild(script);
      }
    });
  }

  return fbSDKReady;
}

export function FacebookLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    loadFacebookSDK().then(() => setSdkReady(true));
  }, []);

  const handleFacebookLogin = async () => {
    setIsLoading(true);

    try {
      await loadFacebookSDK(); // Ensure init has run

      window.FB.login(async (response: any) => {
        if (response.authResponse?.accessToken) {
          const result = await signIn("facebook-graphql", {
            accessToken: response.authResponse.accessToken,
            redirect: false,
          });

          if (result?.error) throw new Error(result.error);
          router.push("/dashboard");
        } else {
          throw new Error("Facebook login failed or was cancelled.");
        }
      }, { scope: "email,public_profile" });

    } catch (err) {
      console.error("Facebook login error:", err);
      router.push("/auth-error?code=facebook_failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={isLoading || !sdkReady}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg ${
        sdkReady ? "hover:bg-[#166FE5]" : "opacity-70 cursor-not-allowed"
      } disabled:opacity-50`}
    >
      <FaFacebook />
      <span>
        {!sdkReady ? "Loading Facebook..." : isLoading ? "Processing..." : "Continue with Facebook"}
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
