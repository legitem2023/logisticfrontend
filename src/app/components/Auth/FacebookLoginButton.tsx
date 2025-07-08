// components/FacebookLoginButton.tsx
"use client";

import { signIn } from "next-auth/react";

export default function FacebookLoginButton() {
  return (
    <button
      onClick={() => signIn("facebook")}
      className="px-4 py-2 bg-blue-800 text-white rounded"
    >
      Continue with Facebook
    </button>
  );
}
