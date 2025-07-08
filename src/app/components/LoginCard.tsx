'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { FcGoogle } from 'react-icons/fc'
import FacebookLogin from './Auth/FacebookLogin'
import FacebookLoginButton from './Auth/FacebookLoginButton'
import GoogleLoginButton from './Auth/GoogleLoginButton'

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
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md shadow-xl p-6 ">
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
            <GoogleLoginButton/>
          </Button>

          <Button
            onClick={handleFacebookLogin}
            variant="outline"
            className="w-full flex items-center text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <FacebookLoginButton/>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
