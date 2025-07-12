'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function TokenSyncer() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem("accessToken", session.accessToken)
      localStorage.setItem("provider", session.provider || "")
    }
  }, [session])

  return null
}
