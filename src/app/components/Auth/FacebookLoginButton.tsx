// FacebookLoginButton.jsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useMutation } from '@apollo/client'
import { useEffect, useState } from "react";
import { FaFacebook, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import Cookies from "js-cookie";
import { FBLOGIN } from '../../../../graphql/mutation'
import { useDispatch,useSelector } from 'react-redux';
import { setActiveIndex } from '../../../../Redux/activeIndexSlice';

export default function FacebookLoginButton() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [storageStatus, setStorageStatus] = useState({
    cookies: false,
    localStorage: false,
    message: ''
  });

  const handleFBLogin = async () => {
    setLoading(true);
    await signIn("facebook", { redirect: false });
    dispatch(setActiveIndex(1));
  };

  useEffect(() => {
    const sendTokenToGraphQL = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
       Cookies.set("token", session.serverToken, {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
        } catch (err) {
          console.error("GraphQL mutation failed:", err);
          setStorageStatus({
            cookies: false,
            localStorage: false,
            message: 'Authentication failed'
          });
        } finally {
          setLoading(false);
        }
      }
    };

    sendTokenToGraphQL();
  }, [session, status]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <button
        onClick={handleFBLogin}
        disabled={loading || status === "authenticated"}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg shadow-sm hover:bg-[#165fce] transition-colors duration-200 disabled:opacity-50 mb-4"
      >
        <FaFacebook className="text-xl" />
        <span className="text-base font-medium">
          {loading ? "Signing in..." : (status === "authenticated" ? "Signed In" : "Sign in with Facebook")}
        </span>
      </button>
    </div>
  );
              }
