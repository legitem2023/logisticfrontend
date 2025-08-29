import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers"; // 👈 added for cookie

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

  secret:
    process.env.NEXTAUTH_SECRET?.length >= 32
      ? process.env.NEXTAUTH_SECRET
      : Buffer.from(
          process.env.NEXTAUTH_SECRET ||
            "default-fallback-secret-32-chars-long"
        )
          .toString("base64")
          .slice(0, 32),

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "facebook") {
        token.accessToken = account.access_token;
        token.provider = account.provider;

        const token_en = account.access_token.toString();
        try {
          const { data } = await client.mutate({
            mutation: FBLOGIN,
            variables: {
              input: {
                idToken:
                  "EAA5BpUxFUHEBPWoH6pkrCXASSyj2UxbDxOJkwXoa2LaF6zzuZAuUVZA3Qk5iFKtu6Wh4jqRf3TmjM2qgZB4sZCZCMZB1cnRqI8AHL5CoIfhRTZBprUHNhV6hM92GIGU9WXZC6V8UMRzSjJl2w08zmEEwbrZAEbqqcZCPZCyzA1IygrG6BIaUYZBcI73ysfZCZADLFri4FJrcbqIWvCCzv2Yorxvf7zqRtguj8AC2VM8pDRE1Xa4DpwdBFTLKJ5W9XA",
              },
            },
          });

          // 👇 Save the GraphQL token in cookie named "token"
          if (data?.loginWithFacebook?.token) {
            cookies().set("token", data.loginWithFacebook.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 30 * 24 * 60 * 60,
            });
          }
        } catch (err) {
          console.error("GraphQL login error:", err);
        }
      }
      return token;
    },
  },

  debug: process.env.NODE_ENV !== "production",
};
