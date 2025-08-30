import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers";

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
      console.log("Token received:", JSON.stringify(token, null, 2));
      console.log("Account received:", JSON.stringify(account, null, 2));
      
      if (account?.provider === "facebook") {
        console.log("Facebook account detected, processing...");
        token.accessToken = account.access_token;
        token.provider = account.provider;

        const token_en = account.access_token?.toString() || "";
        console.log("Facebook access token:", token_en);
        
        try {
          console.log("Attempting GraphQL mutation to server...");
          console.log("Server URL:", process.env.NEXT_PUBLIC_SERVER_LINK);
          
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken: token_en,
              },
            },
          });
          
          console.log("GraphQL mutation response:", JSON.stringify(data, null, 2));
          
          if (data?.loginWithFacebook?.token) {
            console.log("Server token received, setting in JWT");
            // Ensure serverToken is properly typed as string
            token.serverToken = data.loginWithFacebook.token as string;
            
            // Set cookie for server token
            const res = NextResponse.next();
            res.cookies.set("token", data.loginWithFacebook.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 30 * 24 * 60 * 60,
            });
            console.log("Token cookie set successfully");
          } else {
            console.log("No token received from GraphQL mutation");
            console.log("Response data:", data);
          }
        } catch (err) {
          console.error("GraphQL login error:", err);
          console.error("Error details:", JSON.stringify(err, null, 2));
          token.error = "Authentication failed";
        }
      } else {
        console.log("Account provider is not Facebook or account is missing:", account?.provider);
      }
      
      console.log("Final token being returned:", JSON.stringify(token, null, 2));
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback triggered");
      console.log("Session input:", JSON.stringify(session, null, 2));
      console.log("Token input:", JSON.stringify(token, null, 2));
      
      if (token) {
        // Ensure all token properties are properly typed before assignment
        session.accessToken = token.accessToken as string | undefined;
        session.provider = token.provider as string | undefined;
        session.serverToken = token.serverToken as string | undefined; // This fixes the TypeScript error
        session.error = token.error as string | undefined;
      }
      
      console.log("Final session being returned:", JSON.stringify(session, null, 2));
      return session;
    },

    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered");
      console.log("User:", JSON.stringify(user, null, 2));
      console.log("Account:", JSON.stringify(account, null, 2));
      console.log("Profile:", JSON.stringify(profile, null, 2));
      return true;
    },
  },

  debug: process.env.NODE_ENV !== "production",
  
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
