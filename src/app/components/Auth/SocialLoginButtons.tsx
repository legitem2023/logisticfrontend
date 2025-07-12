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
  }
}

// Shared Facebook SDK loader to ensure FB.init runs before FB.login
let fbInitPromise: Promise<void> | null = null;
function loadFacebookSDK(): Promise<void> {
  if (fbInitPromise) return fbInitPromise;

  fbInitPromise = new Promise((resolve) => {
    if (window.FB) return resolve();

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.FACEBOOK_CLIENT_ID,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.id = "facebook-jssdk";
    document.body.appendChild(script);
  });

  return fbInitPromise;
}

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

export function FacebookLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      await loadFacebookSDK();

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
}
