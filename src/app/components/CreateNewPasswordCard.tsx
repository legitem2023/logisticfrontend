'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setActiveIndex } from '../../../Redux/activeIndexSlice'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { showToast } from '../../../utils/toastify'
import { FiLock, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { Eye, EyeOff } from 'lucide-react'
import CityScape from './AnimatedCityscape'
import { useMutation, useQuery } from '@apollo/client'
import { RESETPASSWORD } from '../../../graphql/mutation' // Adjust path as needed
import { PASSWORDRESETREPO  } from '../../../graphql/query'
export default function CreateNewPasswordCard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  
  // Add token state (you'll likely get this from URL params or props)
  const [token, setToken] = useState('') // You should set this from URL params

  // Password strength criteria
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  // GraphQL mutation

  const {data,loading,error} = useQuery(PASSWORDRESETREPO);
  if (loading) return
  console.log(data);
  const [resetPasswordMutation] = useMutation(RESETPASSWORD)

  // Get token from URL (add this effect)
  React.useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      // Or you might get it from props or other sources
      showToast('Invalid or missing reset token', 'error')
      // Optionally )redirect back to forgot password
      // router.push('/forgot-password')
    }
  }, [])

  const handleCreateNewPassword = async () => {
    if (!password || !confirmPassword) {
      showToast('Please fill in all fields.', 'error')
      return
    }

    if (!allCriteriaMet) {
      showToast('Please meet all password requirements.', 'error')
      return
    }

    if (!passwordsMatch) {
      showToast('Passwords do not match.', 'error')
      return
    }

    if (!token) {
      showToast('Reset token is missing or invalid', 'error')
      return
    }

    setLoading(true)
    
    try {
      // Call GraphQL mutation
      const { data } = await resetPasswordMutation({
        variables: {
          token: token,
          newPassword: password
        }
      })
      console.log(data?.resetPassword,"<==");
      if (data?.resetPassword?.statusText === 'success') {
        setPasswordChanged(true)
        showToast('Password updated successfully!', 'success')
      } else {
        throw new Error('Password reset failed')
      }
      
    } catch (err: any) {
      console.error('Password reset failed:', err)
      // Handle specific GraphQL errors
      const errorMessage = err.message || 'Failed to update password'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    dispatch(setActiveIndex(12)) // Assuming 0 is login index
    router.push('/');
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  if (passwordChanged) {
    return (
      <div className="flex justify-center p-0">
        <Card className="w-full max-w-2xl shadow-xl border border-green-100 overflow-hidden relative bg-white">
          <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 relative overflow-hidden p-0">
            <CityScape>
              <CardTitle className="text-3xl font-bold text-white text-center relative z-10">
                Password Updated!
              </CardTitle>
              <p className="text-green-100 text-center mt-2 relative z-10">
                Your password has been successfully reset
              </p>
            </CityScape>
          </CardHeader>
        
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600">
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
              </div>

              <Button
                onClick={handleBackToLogin}
                className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center p-0">
      <Card className="w-full max-w-2xl shadow-xl border border-green-100 overflow-hidden relative bg-white">
        <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 relative overflow-hidden p-0">
          <CityScape>
            <CardTitle className="text-3xl font-bold text-white text-center relative z-10">
              Create New Password
            </CardTitle>
            <p className="text-green-100 text-center mt-2 relative z-10">
              Enter your new password below
            </p>
          </CityScape>
        </CardHeader>
      
        <CardContent className="p-8 space-y-6">
          {/* New Password */}
          <div className="relative">
            <Label htmlFor="password" className="text-gray-700">New Password</Label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <FiLock className="text-green-600" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
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

          {/* Confirm Password */}
          <div className="relative">
            <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <FiLock className="text-green-600" />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-green-600 transition-colors"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-700 text-sm mb-2">Password Requirements:</h4>
            {[
              { met: passwordCriteria.minLength, text: 'At least 8 characters' },
              { met: passwordCriteria.hasUpperCase, text: 'One uppercase letter' },
              { met: passwordCriteria.hasLowerCase, text: 'One lowercase letter' },
              { met: passwordCriteria.hasNumber, text: 'One number' },
              { met: passwordCriteria.hasSpecialChar, text: 'One special character' },
              { met: passwordsMatch && confirmPassword.length > 0, text: 'Passwords match' },
            ].map((requirement, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                  requirement.met ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {requirement.met && <FiCheck className="text-white text-xs" />}
                </div>
                <span className={requirement.met ? 'text-green-700' : 'text-gray-500'}>
                  {requirement.text}
                </span>
              </div>
            ))}
          </div>

          {/* Update Password Button */}
          <Button
            className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
            onClick={handleCreateNewPassword}
            disabled={loading || !allCriteriaMet || !passwordsMatch || !token}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : 'Update Password'}
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
                }
