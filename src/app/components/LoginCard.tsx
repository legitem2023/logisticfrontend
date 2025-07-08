'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useMutation } from '@apollo/client'
import FacebookLoginButton from './Auth/FacebookLoginButton'
import GoogleLoginButton from './Auth/GoogleLoginButton'
import { LOGIN } from '../../../graphql/mutation'

export default function LoginCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      console.log('Login successful:', data)
      // TODO: Store token / decrypt it / navigate
    },
    onError: (err) => {
      console.error('Login failed:', err.message)
    }
  })

  const handleLogin = () => {
    if (!email || !password) return alert('Please enter email and password.')

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
    <div className="flex justify-center items-center shimmergreen p-4 min-h-screen">
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

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
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
