/*import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Cookies from 'js-cookie'

// Initialize Apollo Client
const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SERVER_LINK,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

// GraphQL Mutations
export const FBLOGIN = gql`
  mutation LoginWithFacebook($input: GoogleLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      statusText
    }
  }
`;

export const GOOGLELOGIN = gql`
  mutation LoginWithGoogle($input: GoogleLoginInput!) {
    loginWithGoogle(input: $input) {
      token
      statusText
    }
  }
`;

export const authOptions: NextAuthOptions = {
  providers: [
    // Facebook Credentials Provider
    CredentialsProvider({
      id: "facebook-graphql",
      name: "Facebook",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { data } = await apolloClient.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                token: credentials?.accessToken,
              },
            },
            context: {
              headers: {
                "x-operation-name": "LoginWithFacebook",
                "x-request-id": crypto.randomUUID(),
              },
            },
          });

          if (!data?.loginWithFacebook?.token) {
            throw new Error(data?.loginWithFacebook?.statusText || "Authentication failed");
          }
        Cookies .set('token', data?.loginWithFacebook?.token, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        })
          // localStorage.setItem('token', data.loginWithFacebook.token);
          // return {
          //   id: crypto.randomUUID(),
          //   email: "", // Populate from your API if available
          //   name: "Facebook User",
          //   accessToken: data.loginWithFacebook.token,
          // };
        } catch (error) {
          console.error("Facebook GraphQL login error:", error);
          return null;
        }
      },
    }),

    // Google Credentials Provider
    CredentialsProvider({
      id: "google-graphql",
      name: "Google",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { data } = await apolloClient.mutate({
            mutation: GOOGLELOGIN,
            variables: {
              input: {
                token: credentials?.idToken,
              },
            },
            context: {
              headers: {
                "x-operation-name": "LoginWithGoogle",
                "x-request-id": crypto.randomUUID(),
              },
            },
          });

          if (!data?.loginWithGoogle?.token) {
            throw new Error(data?.loginWithGoogle?.statusText || "Authentication failed");
          }
        Cookies.set('token', data?.loginWithGoogle?.token, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        })
          // return {
          //   id: crypto.randomUUID(),
          //   email: "", // Populate from your API if available
          //   name: "Google User",
          //   accessToken: data.loginWithGoogle.token,
          // };
        } catch (error) {
          console.error("Google GraphQL login error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour session
    updateAge: 15 * 60, // 15 minute update window
  },

  cookies: {
    sessionToken: {
      name: '__Secure-auth.token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth-error",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};*/

import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { NextAuthOptions } from "next-auth"
import Cookies from 'js-cookie'
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // Store accessToken from Facebook or Google in JWT token
      if (account) {
        Cookies.set('token', account.access_token, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        })
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      // Pass accessToken to session
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      return session
    },
  },
}
