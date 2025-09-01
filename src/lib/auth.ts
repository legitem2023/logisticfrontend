// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers";
import { LOGOUT_MUTATION, FBLOGIN } from "../../graphql/mutation";

// Validate environment variables
const validateEnv = () => {
  const required = [
    'FACEBOOK_CLIENT_ID',
    'FACEBOOK_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_SERVER_LINK'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};

validateEnv();

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});

export default NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: { 
        params: { 
          scope: "email,public_profile",
          // Additional parameters to prevent 400 errors
          auth_type: 'rerequest',
          display: 'popup'
        } 
      },
      // Enhanced profile handling
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: { 
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60 
  },

  // Cookie configuration - simplified to avoid conflicts
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? 
          new URL(process.env.NEXTAUTH_URL).hostname : undefined
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Additional sign-in validation
      if (account.provider === "facebook") {
        if (!profile.email) {
          // Email is required for our application
          return "/auth/error?error=email_required";
        }
      }
      return true;
    },
    
    async jwt({ token, account, user }) {
      console.log("JWT callback triggered");
      
      if (account?.provider === "facebook") {
        console.log("Facebook account detected, processing...");
        token.accessToken = account.access_token;
        token.provider = account.provider;

        const token_en = account.access_token?.toString() || "";
        console.log("Facebook access token received");
        
        try {
          console.log("Attempting GraphQL mutation to server...");
          
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken: token_en,
              },
            },
          });
          
          console.log("GraphQL mutation response received");
          
          if (data?.loginWithFacebook?.token) {
            console.log("Server token received, setting in JWT");
            token.serverToken = data.loginWithFacebook.token;
            
            // Set the server token in a cookie
            const cookieStore = cookies();
            cookieStore.set("token", data.loginWithFacebook.token, {
              httpOnly: true,
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              domain: process.env.NODE_ENV === "production" ? 
                new URL(process.env.NEXTAUTH_URL).hostname : undefined
            });
          } else {
            console.error("No token received from GraphQL mutation");
            throw new Error("Authentication failed: No server token received");
          }
        } catch (err) {
          console.error("GraphQL login error:", err);
          // More specific error handling
          if (err.networkError) {
            throw new Error("Network error during authentication");
          } else if (err.graphQLErrors && err.graphQLErrors.length > 0) {
            throw new Error(`Authentication failed: ${err.graphQLErrors[0].message}`);
          } else {
            throw new Error("Authentication failed: Unknown error");
          }
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback triggered");
      
      if (token) {
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        session.serverToken = token.serverToken;
        session.error = token.error;
      }
      
      return session;
    },
    
    // Add redirect callback to handle potential issues
    async redirect({ url, baseUrl }) {
      // Ensure we always redirect to the baseUrl after auth
      return baseUrl;
    },
  },

  events: {
    async signOut({ token }) {
      console.log("User signed out");
      
      // Remove Facebook session and token
      if (token?.provider === "facebook" && token.accessToken) {
        try {
          console.log("Revoking Facebook access token...");
          const revokeResponse = await fetch(
            `https://graph.facebook.com/me/permissions?access_token=${token.accessToken}`, 
            { method: 'DELETE' }
          );
          
          if (revokeResponse.ok) {
            console.log("Facebook session successfully revoked");
          } else {
            console.warn("Facebook revocation failed:", await revokeResponse.text());
          }
        } catch (fbError) {
          console.error("Error revoking Facebook session:", fbError);
        }
      }
      
      try {
        // Your existing server token cleanup
        if (token?.serverToken) {
          console.log("Calling server logout endpoint");
          await client.mutate({
            mutation: LOGOUT_MUTATION,
            context: {
              headers: {
                Authorization: `Bearer ${token.serverToken}`,
              },
            },
          });
        }
        
        // Clear the token cookie
        const cookieStore = cookies();
        cookieStore.delete('token');
        
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
    
    // Add error handling event
    async error({ error }) {
      console.error("NextAuth error event:", error);
    },
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
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
});
