"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
  return (
    <button
      disabled={true}
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-[100%] flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
    >
      <FcGoogle className="text-xl" />
      <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
    </button>
  );
}
