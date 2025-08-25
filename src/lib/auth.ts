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
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        url: "https://www.facebook.com/v11.0/dialog/oauth",
        params: { 
          auth_type: "reauthenticate", 
          scope: "email,public_profile"
        },
      },
      userinfo: {
        url: "https://graph.facebook.com/me?fields=id,name,email,picture",
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // ✅ Enable debugging + log details
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("❌ NextAuth ERROR:", code, metadata)
    },
    warn(code) {
      console.warn("⚠️ NextAuth WARNING:", code)
    },
    debug(code, metadata) {
      console.debug("🐛 NextAuth DEBUG:", code, metadata)
    },
  },

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
            throw new Error("No token received from backend")
          }
        } catch (error) {
          console.error("Facebook authentication failed:", error)
          // ❌ Fail auth flow if mutation fails
          return null
        }
      }
      return token
    },

    async session({ session, token }) {
      // ✅ Save backend token to a cookie
      if (token.accessToken) {
        Cookies.set("token", token.accessToken as string, {
          expires: 7,
          secure: true,
          sameSite: "lax",
        })
      }

      session.accessToken = token.accessToken as string
      session.provider = token.provider as string

      return session
    },
  },
}
