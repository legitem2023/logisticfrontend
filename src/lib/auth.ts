/*import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import Cookies from "js-cookie";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    error?: string;
  }
  
  interface JWT {
    accessToken?: string;
    provider?: string;
    error?: string;
  }
}

// 🔸 GraphQL Mutation (kept but not used now)
export const FBLOGIN = gql`
  mutation LoginWithFacebook($input: GoogleLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      statusText
    }
  }
`;

// 🔸 Apollo Client Setup (kept but not used now)
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK!,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});

// 🔸 NextAuth Options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        url: "https://www.facebook.com/v11.0/dialog/oauth",
        params: { scope: "email,public_profile" },
      },
      userinfo: {
        url: "https://graph.facebook.com/me?fields=id,name,email,picture",
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email ?? "",
          image: profile.picture?.data?.url ?? null,
        };
      },
    }),
  ],
  secret: 'o6Dp5qYH5mUl+eZ7bgHs88qRyd5M5PZxR2+yMN2O1WQ=',

  cookies: {
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  useSecureCookies: process.env.NODE_ENV === 'production',

  logger: {
    error(code, metadata) {
      console.error("❌ NextAuth ERROR:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth WARNING:", code);
      console.warn("Facebook Client ID:", process.env.FACEBOOK_CLIENT_ID);
    },
    debug(code, metadata) {
      console.debug("🐛 NextAuth DEBUG:", code, metadata);
    },
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "facebook") {
        try {
          // 🚧 TEMPORARILY COMMENTED OUT GRAPHQL CALL
          // const { data } = await client.mutate({
          //   mutation: FBLOGIN,
          //   variables: { input: { idToken: account.access_token } },
          // });

          // 🚀 Just store the raw Facebook access_token
          token.accessToken = account.access_token;
          token.provider = account.provider;

          // Save to localStorage (client-side safe only)
          if (typeof window !== "undefined") {
            localStorage.setItem("fb_access_token", account.access_token);
            localStorage.setItem("fb_provider", account.provider);
          }
        } catch (error) {
          console.error("Facebook authentication failed:", error);
          return {
            ...token,
            provider: account.provider,
            error: "Facebook authentication failed",
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.accessToken) {
        Cookies.set("token", token.accessToken as string, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "lax",
        });

        // Save to localStorage on session creation
        if (typeof window !== "undefined") {
          localStorage.setItem("session_token", token.accessToken as string);
        }
      }

      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;

      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  debug: true,
};
*/

import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

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
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});

// src/types/next-auth.d.ts or in your auth.ts file
import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    serverToken?: string; // Add this line
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    provider?: string;
    serverToken?: string; // Add this line
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

  // Fixed secret handling - ensure proper length
  secret: process.env.NEXTAUTH_SECRET?.length >= 32 
    ? process.env.NEXTAUTH_SECRET 
    : Buffer.from(process.env.NEXTAUTH_SECRET || 'default-fallback-secret-32-chars-long').toString('base64').slice(0, 32),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "facebook") {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        // Optional: Send to GraphQL server here in JWT callback
        // This might be better than doing it in session callback
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: { input: { idToken: account.access_token } },
          });
          
          // Store your server token in JWT if needed
          token.serverToken = data.loginWithFacebook.token;
        } catch (error) {
          console.error('GraphQL mutation error:', error);
          token.error = 'Failed to authenticate with server';
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Make the tokens available in session
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      session.serverToken = token.serverToken as string; // If you want to store server token

      if (token.error) session.error = token.error as string;
      return session;
    },
  },

  debug: process.env.NODE_ENV !== 'production',
};
