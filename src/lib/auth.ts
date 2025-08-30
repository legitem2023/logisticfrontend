import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers"; // 👈 added for cookie

export const FBLOGIN = gql`
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

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    serverToken?: string;
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    provider?: string;
    serverToken?: string;
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: { params: { scope: "email,public_profile" } },
    }),
  ],

  secret:
    process.env.NEXTAUTH_SECRET?.length >= 32
      ? process.env.NEXTAUTH_SECRET
      : Buffer.from(
          process.env.NEXTAUTH_SECRET ||
            "default-fallback-secret-32-chars-long"
        )
          .toString("base64")
          .slice(0, 32),

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, account }) {
      console.log("JWT callback triggered");
      console.log("Token:", token);
      console.log("Account:", account);
      
      if (account?.provider === "facebook") {
        console.log("Facebook account detected");
        token.accessToken = account.access_token;
        token.provider = account.provider;

        const token_en = account.access_token.toString();
        console.log("Facebook access token:", token_en);
        
        try {
          console.log("Attempting GraphQL mutation to:", process.env.NEXT_PUBLIC_SERVER_LINK);
          
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken: token_en,
              },
            },
          });
          
          console.log("GraphQL mutation response:", data);
          
          const res = NextResponse.json({ success: true });
          
          // 👇 Save the GraphQL token in cookie named "token"
          if (data?.loginWithFacebook?.token) {
            console.log("Setting token cookie with value:", data.loginWithFacebook.token);
            res.cookies.set("token", data.loginWithFacebook.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 30 * 24 * 60 * 60,
            });
          } else {
            console.log("No token received from GraphQL mutation");
          }
        } catch (err) {
          console.error("GraphQL login error:", err);
          console.error("Error details:", JSON.stringify(err, null, 2));
        }
      } else {
        console.log("Account provider is not Facebook:", account?.provider);
      }
      
      console.log("Returning token:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback triggered");
      console.log("Session:", session);
      console.log("Token:", token);
      
      if (token) {
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        session.serverToken = token.serverToken;
        session.error = token.error;
      }
      
      console.log("Final session:", session);
      return session;
    },

    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      return true;
    },
  },

  debug: process.env.NODE_ENV !== "production",
  
  // Add logger for additional debugging
  logger: {
    error(code, metadata) {
      console.error("NextAuth error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth debug:", code, metadata);
    }
  }
};
