import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { NextAuthOptions } from "next-auth"
import Cookies from 'js-cookie'
import { gql, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// 🔸 GraphQL Mutation
const GOOGLELOGIN = gql`
  mutation LoginWithGoogle($input: GoogleLoginInput!) {
    loginWithGoogle(input: $input) {
      token
      statusText
    }
  }
`

// 🔸 Apollo Client Setup
const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, fetch }),
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
      if (account && account.provider === "google") {
        token.accessToken = account.access_token
        token.provider = account.provider

        // 🔸 Call backend with Google access token
        try {
          const { data } = await client.mutate({
            mutation: GOOGLELOGIN,
            variables: {
              input: {
                accessToken: account.access_token,
              },
            },
          })

          // 🔸 Save backend token and optional status
          token.token = data?.loginWithGoogle?.token
          token.statusText = data?.loginWithGoogle?.statusText
        } catch (error) {
          console.error("GraphQL loginWithGoogle mutation failed:", error)
        }
      }

      return token
    },

    async session({ session, token }) {
      // 🔸 Store backend token in cookie
      if (token.token) {
        Cookies.set('token', token.token as string, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        })

      }

      session.accessToken = token.token as string
      session.provider = token.provider as string
      return session
    },
  },
}
