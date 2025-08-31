// app/auth/signout/page.tsx
'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutPage() {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: '/',
    });
  }, []);

  return (
    <div className="signout-container">
      <h2>Signing out...</h2>
      <p>Please wait while we sign you out.</p>
    </div>
  );
}
