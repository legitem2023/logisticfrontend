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
      clientId:process.env.FACEBOOK_CLIENT_ID!,
      clientSecret:process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
async jwt({ token, account }) {
  if (account?.provider === "facebook") {
    try {
      const { data } = await client.mutate({
        mutation: FBLOGIN,
        variables: {
          input: {
            idToken: account.access_token,
          },
        },
      })
      
      if (data?.loginWithFacebook?.token) {
        token.accessToken = data.loginWithFacebook.token
      } else {
        throw new Error('No token received from backend')
      }
    } catch (error) {
      console.error('Facebook authentication failed:', error)
      // This will fail the authentication flow
      return null
    }
  }
  return token
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
      //session.statusText = token.statusText as string;

      return session;
    },
  },
}
