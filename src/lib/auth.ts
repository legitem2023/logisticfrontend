/*import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import Cookies from "js-cookie";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// 🔸 GraphQL Mutation - UPDATED mutation name and input type
export const FBLOGIN = gql`
  mutation LoginWithFacebook($input: FacebookLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      statusText
    }
  }
`;

// 🔸 Apollo Client Setup
const client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_SERVER_LINK!,
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
    ssrMode: true,
});

// 🔸 NextAuth Options - UPDATED with critical fixes
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
        url: "https://www.facebook.com/v23.0/dialog/oauth", // UPDATED API version
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
  secret: process.env.NEXTAUTH_SECRET || 'o6Dp5qYH5mUl+eZ7bgHs88qRyd5M5PZxR2+yMN2O1WQ=',
  
  // ✅ Cookie configuration
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
    async jwt({ token, account, user }) {
      // Handle Facebook authentication
      if (account?.provider === "facebook") {
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken: account.access_token, // FIXED: Changed from idToken to accessToken
              },
            },
          });

          if (data?.loginWithFacebook?.token) {
            // ✅ Return a new object with the updated properties
            return {
              ...token,
              accessToken: data.loginWithFacebook.token,
              provider: account.provider,
              refreshToken: account.refresh_token,
              accessTokenExpires: account.expires_at,
            };
          } else {
            throw new Error("No token received from backend");
          }
        } catch (error) {
          console.error("Facebook authentication failed:", error);
          // Return the original token with error information
          return {
            ...token,
            provider: account.provider,
            error: "Facebook authentication failed",
          };
        }
      }
      
      // Handle token refresh if needed
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires * 1000) {
        return refreshAccessToken(token);
      }
      
      // ✅ Always return the token object
      return token;
    },

    async session({ session, token }) {
      // Set session data
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
        
        // Note: Cookies.set() doesn't work in server-side callbacks
        // Consider setting cookies on the client side in a useEffect hook
      }
      
      // ✅ Pass any error information to the session
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

  debug: process.env.NODE_ENV === 'development', // Only debug in development
};

// 🔸 Helper function to refresh access token (if needed)
async function refreshAccessToken(token: any) {
  try {
    // Implement token refresh logic here if your backend supports it
    // This is just a placeholder implementation
    return {
      ...token,
      error: "RefreshAccessTokenError", // Flag that refresh failed
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}*/
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// 🔸 GraphQL Mutation (kept your idToken field)
export const FBLOGIN = gql`
  mutation LoginWithFacebook($input: FacebookLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      statusText
    }
  }
`;

// 🔸 Apollo Client Setup (server-safe)
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK!,
    // ❌ removed credentials: 'include' (not needed server-side, causes CORS issues)
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
        url: "https://www.facebook.com/v23.0/dialog/oauth",
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

  // ✅ Make sure NEXTAUTH_SECRET is exactly 32 bytes base64-encoded
  secret: process.env.NEXTAUTH_SECRET || "o6Dp5qYH5mUl+eZ7bgHs88qRyd5M5PZxR2+yMN2O1WQ=",

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ✅ Removed manual cookies override (causing state-cookie errors)
  useSecureCookies: process.env.NODE_ENV === "production",

  logger: {
    error(code, metadata) {
      console.error("❌ NextAuth ERROR:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth WARNING:", code);
    },
    debug(code, metadata) {
      console.debug("🐛 NextAuth DEBUG:", code, metadata);
    },
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // Handle Facebook authentication
      if (account?.provider === "facebook") {
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken: account.access_token, // ✅ kept your GraphQL naming
              },
            },
          });

          if (data?.loginWithFacebook?.token) {
            return {
              ...token,
              accessToken: data.loginWithFacebook.token,
              provider: account.provider,
              accessTokenExpires: account.expires_at,
            };
          } else {
            throw new Error("No token received from backend");
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

      // Handle token refresh (if ever needed)
      const expiresAt = Number(token.accessTokenExpires);
     if (expiresAt && Date.now() > expiresAt * 1000) {
      return refreshAccessToken(token);
     }

      return token;
    },

    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
      }

      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

// 🔸 Helper function to refresh access token (placeholder)
async function refreshAccessToken(token: any) {
  try {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
