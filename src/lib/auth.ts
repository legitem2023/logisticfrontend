import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers";
import { LOGOUT_MUTATION, FBLOGIN } from "../../graphql/mutation";

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
    exp?: number;
    iat?: number;
    jti?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: { 
        params: { 
          scope: "email,public_profile" 
        } 
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: { 
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 *60 // 30 days
  },

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
      },
    },
    pkceCodeVerifier: {
      name: `__Secure-next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900,
      },
    },
    state: {
      name: `__Secure-next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900,
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if this sign in callback is being called in the credentials authentication flow.
      if (account.provider === "facebook") {
        try {
          // You can perform additional checks or operations here
          return true;
        } catch (error) {
          console.error("Sign-in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        // Call your GraphQL server to get a custom token
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: { accessToken: account.access_token },
          });
          token.serverToken = data.fbLogin.token;
        } catch (error) {
          console.error("Failed to get server token:", error);
          token.error = "Failed to get server token";
        }
      }
      
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.exp as number) * 1000) {
        return token;
      }
      
      // Refresh the token if it's expired
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      session.serverToken = token.serverToken;
      session.error = token.error;
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  events: {
    async signOut({ token }) {
      // Call your GraphQL server's logout mutation
      try {
        await client.mutate({
          mutation: LOGOUT_MUTATION,
          variables: { token: token.serverToken },
        });
      } catch (error) {
        console.error("Logout mutation failed", error);
      }
    },
    async linkAccount({ user, account, profile }) {
      // Account linked successfully
      console.log("Account linked:", account.provider);
    },
    async session({ session, token }) {
      // Session is active
    }
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in
  },

  debug: process.env.NODE_ENV === "development",

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
