// src/types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    provider?: string
  }

  interface User {
    accessToken?: string
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    provider?: string
  }
}
