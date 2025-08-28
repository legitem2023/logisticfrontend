"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import Cookies from "js-cookie";

const FBLOGIN = gql`
  mutation LoginWithFacebook($input: GoogleLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      statusText
    }
  }
`;

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK!,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});

export default function FacebookLoginButton() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleFBLogin = async () => {
    setLoading(true);
    await signIn("facebook", { redirect: false });
  };

  useEffect(() => {
    const sendTokenToGraphQL = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: { idToken: session.accessToken },
            },
          });

          // Save token to cookies
          Cookies.set("token", data?.loginWithFacebook.token, {
            expires: 7,
            secure: true,
            sameSite: "lax",
          });

          // Save token to localStorage - SAFE approach
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("fbToken", data?.loginWithFacebook.token);
              console.log("Token saved to localStorage successfully");
            } catch (storageError) {
              console.error("Failed to save to localStorage:", storageError);
            }
          }
        } catch (err) {
          console.error("GraphQL mutation failed:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    sendTokenToGraphQL();
  }, [session, status]);

  return (
    <button
      onClick={handleFBLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg shadow-sm hover:bg-[#165fce] transition-colors duration-200 disabled:opacity-50"
    >
      <FaFacebook className="text-lg" />
      <span className="text-sm font-medium">
        {loading ? "Signing in..." : "Sign in with Facebook"}
      </span>
    </button>
  );
}
