'use client'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useMutation } from '@apollo/client'
import FacebookLoginButton from './Auth/FacebookLoginButton'
import { LOGIN } from '../../../graphql/mutation'
import { decryptToken } from '../../../utils/decryptToken'
import { showToast } from '../../../utils/toastify'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginCard() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data?.login?.token
      if (token) {
        Cookies.set('token', token, {
          expires: 7,
          secure: true,
          sameSite: 'lax',
        })
        showToast('Login successful', 'success')
        window.location.reload();
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0a2e1d] to-[#1a4d2e] p-[1px]">
          <div className="bg-white p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0a2e1d] to-[#1a4d2e]">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </CardHeader>

            <CardContent className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent transition-all pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a4d2e] transition-colors"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                className="w-full py-3 customgrad hover:from-[#09281a] hover:to-[#164328] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={handleLogin} 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : 'Login'}
              </Button>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm">{error.message}</p>
                </div>
              )}

              <div className="flex items-center gap-3 my-6">
                <hr className="flex-grow border-gray-200" />
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">OR</span>
                <hr className="flex-grow border-gray-200" />
              </div>

              <FacebookLoginButton />
              <div className="text-center text-sm text-gray-500 mt-6">
                Dont have an account?{' '}
                <a href="#" className="text-[#1a4d2e] hover:text-[#0a2e1d] font-medium transition-colors">
                  Sign up
                </a>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
        }
