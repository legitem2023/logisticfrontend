'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '/ui/button'
import { Input } from '/ui/input'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'

export default function LoginCard() {
  const handleGoogleLogin = () => {
    // Trigger your Google OAuth flow
    console.log('Google login clicked')
  }

  const handleFacebookLogin = () => {
    // Trigger your Facebook OAuth flow
    console.log('Facebook login clicked')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl p-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button className="w-full" variant="default">Login</Button>

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>

          <Button
            onClick={handleFacebookLogin}
            variant="outline"
            className="w-full flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <FaFacebook className="text-xl" />
            Continue with Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
