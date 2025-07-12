'use client'
import Cookies from 'js-cookie'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useMutation } from '@apollo/client'
// import FacebookLoginButton from './Auth/FacebookLoginButton'
// import GoogleLoginButton from './Auth/GoogleLoginButton'
import { GoogleLoginButton } from './Auth/SocialLoginButtons'
import { FacebookLoginButton } from './Auth/SocialLoginButtons'
import { LOGIN } from '../../../graphql/mutation'
import { decryptToken } from '../../../utils/decryptToken'

export default function LoginCard() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data?.login?.token
      if (token) {
        Cookies.set('token', token, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        })

      } else {
        console.error('No token returned')
      }
    },
    onError: (err) => {
      console.error('Login failed:', err.message)
    }
  })

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter email and password.')
      return
    }

    login({
      variables: {
        input: {
          email,
          password
        }
      }
    })
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md shadow-xl p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full text-[#ffffff] shadow rounded-lg customgrad" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {error && <p className="text-red-500 text-sm">{error.message}</p>}

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <GoogleLoginButton />
          <FacebookLoginButton />
        </CardContent>
      </Card>
    </div>
  )
}
