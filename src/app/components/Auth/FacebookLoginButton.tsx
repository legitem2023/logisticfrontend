"use client";

import { signIn } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";

export default function FacebookLoginButton() {
  return (
    <button
      onClick={() => signIn("facebook", { callbackUrl: "/" })}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg shadow-sm hover:bg-[#165fce] transition-colors duration-200"
    >
      <FaFacebook className="text-lg" />
      <span className="text-sm font-medium">Sign in with Facebook</span>
    </button>
  );
}
