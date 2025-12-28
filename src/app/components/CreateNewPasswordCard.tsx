'use client'
import React, { useState, useEffect } from 'react'
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
import { RESETPASSWORD } from '../../../graphql/mutation'
import { PASSWORDRESETREPO } from '../../../graphql/query'

export default function CreateNewPasswordCard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [token, setToken] = useState('')

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

  // GraphQL query and mutation
  const { 
    data: queryData, 
    loading: queryLoading, 
    error: queryError,
    refetch: refetchQuery 
  } = useQuery(PASSWORDRESETREPO, {
    fetchPolicy: 'network-only', // Always fetch fresh data
    onCompleted: (data) => {
      console.log('✅ PASSWORDRESETREPO Query Completed Successfully!')
      console.log('📊 Full Query Response:', JSON.stringify(data, null, 2))
      
      // Log specific fields if they exist
      if (data.passwordResetRepo) {
        console.log('🎯 passwordResetRepo data:', data.passwordResetRepo)
        console.log('🔑 Token status:', data.passwordResetRepo.tokenStatus || 'N/A')
        console.log('👤 User info:', data.passwordResetRepo.user || 'N/A')
        console.log('📅 Expiry:', data.passwordResetRepo.expiry || 'N/A')
        console.log('✅ Valid:', data.passwordResetRepo.isValid || 'N/A')
      }
    },
    onError: (error) => {
      console.error('❌ PASSWORDRESETREPO Query Error:')
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((gqlError, index) => {
          console.error(`GraphQL Error ${index + 1}:`, gqlError)
          console.error(`  Message: ${gqlError.message}`)
          console.error(`  Locations:`, gqlError.locations)
          console.error(`  Path:`, gqlError.path)
        })
      }
      
      if (error.networkError) {
        console.error('🌐 Network Error:', error.networkError)
      }
    }
  })

  const [resetPasswordMutation, { 
    loading: mutationLoading, 
    error: mutationError, 
    data: mutationData 
  }] = useMutation(RESETPASSWORD)

  // Get token from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tokenFromUrl = urlParams.get('token')
      if (tokenFromUrl) {
        console.log('🔗 Token extracted from URL:', tokenFromUrl)
        console.log('📝 Full URL:', window.location.href)
        setToken(tokenFromUrl)
        
        // If query needs variables (like token), you might need to refetch with token
        // Example: refetchQuery({ token: tokenFromUrl })
      } else {
        console.error('❌ No token found in URL')
        console.log('🔍 URL Search Params:', window.location.search)
        showToast('Invalid or missing reset token', 'error')
      }
    }
  }, [])

  // Log query data on mount and when it changes
  useEffect(() => {
    console.log('🔄 Query Loading State:', queryLoading)
    console.log('📥 Query Data:', queryData)
    console.log('❓ Query Error:', queryError)
    
    if (queryData) {
      console.log('📋 Query Data Structure:')
      Object.keys(queryData).forEach(key => {
        console.log(`  ${key}:`, queryData[key])
      })
    }
  }, [queryData, queryLoading, queryError])

  // Log mutation states
  useEffect(() => {
    if (mutationData) {
      console.log('✅ Mutation Successful - Full Data:', mutationData)
      console.log('🔑 Reset Password Response:', mutationData.resetPassword)
    }
    if (mutationError) {
      console.error('❌ Mutation Error:', mutationError)
    }
  }, [mutationData, mutationError])

  const handleCreateNewPassword = async () => {
    console.log('🟢 handleCreateNewPassword triggered')
    console.log('🔐 Password:', password)
    console.log('🔏 Confirm Password:', confirmPassword)
    console.log('🎫 Token:', token)
    console.log('📊 Criteria met:', allCriteriaMet)
    console.log('🔁 Passwords match:', passwordsMatch)

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

    // Log current query data before mutation
    console.log('📈 Current PASSWORDRESETREPO query data:', queryData)

    setLoading(true)
    
    try {
      console.log('🚀 Calling resetPasswordMutation with:', {
        token,
        newPassword: password,
        timestamp: new Date().toISOString()
      })

      const response = await resetPasswordMutation({
        variables: {
          token: token,
          newPassword: password
        }
      })

      console.log('🎯 Mutation Response:', response)
      console.log('📦 Response Data:', response.data)
      console.log('🔐 Reset Password Result:', response.data?.resetPassword)

      if (response.data?.resetPassword?.statusText === 'Password has been successfully reset') {
        setPasswordChanged(true)
        showToast('Password updated successfully!', 'success')
        
        console.log('✅ Password reset successful! Details:', {
          timestamp: new Date().toISOString(),
          tokenUsed: token,
          response: response.data?.resetPassword
        })
      } else {
        console.warn('⚠️ Unexpected response format:', response.data)
        throw new Error(response.data?.resetPassword?.message || 'Password reset failed')
      }
      
    } catch (err: any) {
      console.error('❌ Password reset failed:', err)
      
      console.error('🔍 Error Details:', {
        name: err.name,
        message: err.message,
        networkError: err.networkError,
        graphQLErrors: err.graphQLErrors,
        stack: err.stack
      })

      let errorMessage = 'Failed to update password'
      
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        errorMessage = err.graphQLErrors[0].message
        console.error('📝 GraphQL Error Details:', err.graphQLErrors[0])
      } else if (err.networkError) {
        errorMessage = 'Network error. Please check your connection.'
        console.error('🌐 Network Error Details:', err.networkError)
      } else if (err.message) {
        errorMessage = err.message
      }
      
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    dispatch(setActiveIndex(12))
    router.push('/')
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  if (queryLoading) {
    console.log('⏳ PASSWORDRESETREPO query is loading...')
    return (
      <div className="flex justify-center p-0">
        <Card className="w-full max-w-2xl shadow-xl border border-green-100 overflow-hidden relative bg-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading password reset data...</p>
              <p className="text-sm text-gray-500 mt-2">(Check console for query logs)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (queryError) {
    console.log('❌ Query error state - rendering error UI')
    return (
      <div className="flex justify-center p-0">
        <Card className="w-full max-w-2xl shadow-xl border border-red-100 overflow-hidden relative bg-white">
          <CardHeader className="bg-gradient-to-r from-red-800 to-red-600 p-0">
            <CardTitle className="text-3xl font-bold text-white text-center p-6">
              Error Loading
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center text-red-600">
              <p>Error loading password reset data. Check console for details.</p>
              <p className="text-sm mt-2">{queryError.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (passwordChanged) {
    console.log('✅ Password changed successfully - rendering success UI')
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

  console.log('🎨 Rendering password reset form')
  console.log('📊 Current query data available:', queryData ? 'Yes' : 'No')

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
          {/* Query Data Info - Optional display */}
          {queryData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Query Loaded:</strong> Check console for detailed logs
              </p>
            </div>
          )}

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
