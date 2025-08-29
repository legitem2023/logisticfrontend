// FacebookLoginButton.jsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useMutation } from '@apollo/client'
import { useEffect, useState } from "react";
import { FaFacebook, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import Cookies from "js-cookie";
import { FBLOGIN } from '../../../../graphql/mutation'


export default function FacebookLoginButton() {
  const { data: session, status } = useSession();
 const [loginWithFacebook] = useMutation(FBLOGIN,{
   onCompleted:(result:any) =>{
     console.log(result);
     Cookies.set("Token", result.Token, {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
   },
   onError:(e:any) =>{
     console.log(e);
   }
 })
  const [loading, setLoading] = useState(false);
  const [storageStatus, setStorageStatus] = useState({
    cookies: false,
    localStorage: false,
    message: ''
  });

  const handleFBLogin = async () => {
    setLoading(true);
    await signIn("facebook", { redirect: false });
  };

  useEffect(() => {
    const sendTokenToGraphQL = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          await loginWithFacebook({
            variables: {
              input: { idToken: session.accessToken },
            },
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
      
      {status === "authenticated" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Authentication Status</h3>
          
          <div className="space-y-2">
            <div className="flex items-center">
              {storageStatus.cookies ? (
                <FaCheckCircle className="text-green-500 mr-2" />
              ) : (
                <FaExclamationTriangle className="text-yellow-500 mr-2" />
              )}
              <span>Cookies: {storageStatus.cookies ? 'Token stored' : 'No token found'}</span>
            </div>
            
            <div className="flex items-center">
              {storageStatus.localStorage ? (
                <FaCheckCircle className="text-green-500 mr-2" />
              ) : (
                <FaExclamationTriangle className="text-yellow-500 mr-2" />
              )}
              <span>Local Storage: {storageStatus.localStorage ? 'Token stored' : 'No token found'}</span>
            </div>
          </div>
          
          {storageStatus.message && (
            <p className={`mt-2 text-sm ${storageStatus.cookies && storageStatus.localStorage ? 'text-green-600' : 'text-yellow-600'}`}>
              {storageStatus.message}
            </p>
          )}
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Debug Info</h4>
        <p className="text-sm text-blue-700">Session status: {status}</p>
        <p className="text-sm text-blue-700">User: {session?.user?.name || 'Not authenticated'}</p>
        <p className="text-sm text-blue-700">Token: {session?.accessToken || 'Not authenticated'}</p>
     
      </div>
    </div>
  );
              }
