import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { NextAuthOptions } from "next-auth"
import Cookies from 'js-cookie'
import { gql, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// 🔸 GraphQL Mutation
export const FBLOGIN = gql`
  mutation LoginWithFacebook($input: GoogleLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      statusText
    }
  }
`

// 🔸 Apollo Client Setup
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    fetch,
  }),
  cache: new InMemoryCache(),
})

// 🔸 NextAuth Options
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
    async jwt({ token, account }) {
      if (account && account.provider === "facebook") {
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken: account.access_Token, // ✅ use idToken here
              },
            },
          });

          // ✅ Optional: store in localStorage (only in browser)
          if (typeof window !== 'undefined' && data?.loginWithFacebook?.token) {
            localStorage.setItem(
              "localstorage",
              JSON.stringify(data.loginWithFacebook)
            );
          }

          // ✅ Save backend token to JWT
          token.accessToken = data?.loginWithFacebook?.token;
          //token.statusText = data?.loginWithFacebook?.statusText;
        } catch (error) {
          console.error("GraphQL loginWithFacebook mutation failed:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // ✅ Save backend token to a cookie
      if (token.accessToken) {
        Cookies.set('token', token.accessToken as string, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        });
      }

      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      session.statusText = token.statusText as string;

      return session;
    },
  },
}
