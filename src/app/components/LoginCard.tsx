'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { setActiveIndex } from '../../../Redux/activeIndexSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { signIn } from 'next-auth/react'; // Import signIn from next-auth
import FacebookLoginButton from './Auth/FacebookLoginButton'
import GoogleLoginButton from './Auth/GoogleLoginButton'
import { showToast } from '../../../utils/toastify'
import { Eye, EyeOff } from 'lucide-react'
import { FiMail, FiLock } from 'react-icons/fi'
import CityScape from './AnimatedCityscape';

export default function LoginCard() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Local loading state

  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter email and password.', 'error')
      return
    }

    setLoading(true)
    
    try {
      // Use NextAuth's signIn function with credentials
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Don't redirect automatically
      })
     console.log(result);
      if (result?.error) {
        showToast('Login failed: ' + result.error, 'error')
        console.error('Login error:', result.error)
      } else {
        showToast('Login successful', 'success')
        dispatch(setActiveIndex(1))
        // Redirect or reload as needed
        window.location.reload()
      }
    } catch (err) {
      console.error('Login failed:', err)
      showToast('Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="flex justify-center p-0">
      <Card className="w-full max-w-2xl shadow-xl border border-green-100 overflow-hidden relative bg-white">
        <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 relative overflow-hidden p-0">
          <CityScape>
            <CardTitle className="text-3xl font-bold text-white text-center relative z-10">Welcome Back</CardTitle>
            <p className="text-green-100 text-center mt-2 relative z-10">Sign in to your account</p>
          </CityScape>
        </CardHeader>
      
        <CardContent className="p-8 space-y-6">
          {/* Email */}
          <div className="relative">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <FiMail className="text-green-600" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <FiLock className="text-green-600" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-green-600 transition-colors"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

  <div className="flex justify-end">
  <a href='/Forgotpassword' className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors">
    Forgot your password?
  </a>
</div>
          {/* Login button */}
          <Button
            className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 
                    3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </Button>

          {/*
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">OR</span>
            <hr className="flex-grow border-gray-200" />
          </div>
          
          <GoogleLoginButton />
          <FacebookLoginButton />
          */}
          
          {/* Footer link */}
          <div className="text-center text-sm text-gray-500 mt-6">
            Dont have an account?{' '}
            <span onClick={()=>{dispatch(setActiveIndex(11))}} className="text-green-600 hover:text-green-800 font-medium transition-colors">
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
          }
