"use client";

import { signIn, useSession } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

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
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});


export default function FacebookLoginButton() {
  const { data: session } = useSession();

  const handleFBLogin = async () => {
    // If already logged in via NextAuth, send token to GraphQL
    if (session?.accessToken) {
      const { data } = await client.mutate({
        mutation: FBLOGIN,
        variables: {
          input: { idToken: session.accessToken }, // match your backend input
        },
      });

      console.log("GraphQL response:", data);
    } else {
      // Start Facebook login flow
      await signIn("facebook");
    }
  };

  return (
    <button
      onClick={handleFBLogin}
      className="w-[100%] flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg shadow-sm hover:bg-[#165fce] transition-colors duration-200"
    >
      <FaFacebook className="text-lg" />
      <span className="text-sm font-medium">Sign in with Facebook</span>
    </button>
  );
}
