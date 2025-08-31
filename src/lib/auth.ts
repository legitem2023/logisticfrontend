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

  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, account }) {
      console.log("JWT callback triggered");
      
      if (account?.provider === "facebook") {
        console.log("Facebook account detected, processing...");
        token.accessToken = account.access_token;
        token.provider = account.provider;

        const token_en = account.access_token?.toString() || "";
        console.log("Facebook access token:", token_en);
        
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
          
          console.log("GraphQL mutation response:", JSON.stringify(data, null, 2));
          
          if (data?.loginWithFacebook?.token) {
            console.log("Server token received, setting in JWT and cookie");
            token.serverToken = data.loginWithFacebook.token as string;
            
            // Set the server token in a cookie here
            const cookieStore = await cookies();
            cookieStore.set("token", data.loginWithFacebook.token, {
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/"
            });
          } else {
            console.log("No token received from GraphQL mutation");
          }
        } catch (err) {
          console.error("GraphQL login error:", err);
          token.error = "Authentication failed";
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback triggered");
      
      if (token) {
        session.accessToken = token.accessToken as string | undefined;
        session.provider = token.provider as string | undefined;
        session.serverToken = token.serverToken as string | undefined;
        session.error = token.error as string | undefined;
      }
      
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      console.log("User signed out");
      
      // Remove Facebook session and token
      if (token?.provider === "facebook" && token.accessToken) {
        try {
          console.log("Revoking Facebook access token...");
          const revokeResponse = await fetch(`https://graph.facebook.com/me/permissions?access_token=${token.accessToken}`, {
            method: 'DELETE'
          });
          
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
        const cookieStore = await cookies();
        cookieStore.delete('token');
        
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },

  pages: {
    signOut: '/auth/signout',
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
