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
    maxAge: 30 * 24 * 60 * 60 // 30 days
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
      if (account.provider === "facebook") {
        try {
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
          
          // Set the "token" cookie with the server token
          const cookieStore = cookies();
          cookieStore.set("token", data.fbLogin.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
          });
        } catch (error) {
          console.error("Failed to get server token:", error);
          token.error = "Failed to get server token";
        }
      }
      
      // Return previous token if the access token has not expired yet
      if (token.exp && Date.now() < token.exp * 1000) {
        return token;
      }
      
      return token;
    },

    async session({ session, token }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
    
      if (typeof token.provider === 'string') {
        session.provider = token.provider;
      }
    
      if (typeof token.serverToken === 'string') {
        session.serverToken = token.serverToken;
      }
    
      if (typeof token.error === 'string') {
        session.error = token.error;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  events: {
    async signOut({ token }) {
      try {
        await client.mutate({
          mutation: LOGOUT_MUTATION,
          variables: { token: token.serverToken },
        });
        
        // Clear the "tiken" cookie on signout
        const cookieStore = cookies();
        cookieStore.delete("tiken");
      } catch (error) {
        console.error("Logout mutation failed", error);
      }
    },
    async linkAccount({ user, account, profile }) {
      console.log("Account linked:", account.provider);
    },
    async session({ session, token }) {
      // Session is active
    }
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
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
