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
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import CityScape from './AnimatedCityscape'
import { useMutation } from '@apollo/client'
import { REQUESTPASSWORDRESET } from '../../../graphql/mutation'

import { PasswordResetService } from '../../Services/PasswordResetService.js';
import { EmailServiceConfig } from '../../Services/EmailService.js';

// Define input types for TypeScript
interface RequestPasswordResetInput {
  email: string;
}

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

interface ValidateResetTokenInput {
  token: string;
}

// Initialize the password reset service
const emailConfig: EmailServiceConfig = {
  service: 'nodemailer',
  apiKey: 'bqbtblpnwsllnaze',
  fromEmail: 'robert_sanco_marquez1988@yahoo.com',//'robertsancomarquez1988@gmail.com',// process.env.FROM_EMAIL || 'noreply@adiviso.com',
  appName: 'Pramatiso Express',
  baseUrl: 'https://adiviso.com'
};

const passwordResetService = new PasswordResetService(emailConfig);




export default function ForgotPasswordCard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // GraphQL mutation hook
  const [requestPasswordReset] = useMutation(REQUESTPASSWORDRESET)

  const handleResetPassword = async () => {
    if (!email) {
      showToast('Please enter your email address.', 'error')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }

    setLoading(true)
    
    try {
      // Call the GraphQL mutation
      const { data } = await requestPasswordReset({
        variables: { email }
      })

      if (data?.requestPasswordReset?.success) {
        setEmailSent(true)
        showToast('Reset instructions sent to your email', 'success')
        const sendInemail = async()=>{
            await passwordResetService.requestPasswordReset(email); 
        }
        sendInemail();
      } else {
        showToast(data?.requestPasswordReset?.message || 'Failed to send reset instructions', 'error')
      }
    } catch (err: any) {
      console.error('Reset password failed:', err)
      // Check for GraphQL errors
      const errorMessage = err.message;// || 'Failed to send reset instructions'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    dispatch(setActiveIndex(12)) // Assuming 0 is login index
    router.push('/');
  }

  // Handle form submission on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleResetPassword()
    }
  }

  return (
    <div className="flex justify-center p-0">
      <Card className="w-full max-w-2xl shadow-xl border border-green-100 overflow-hidden relative bg-white">
        <CardHeader className="bg-gradient-to-r from-green-800 to-green-600 relative overflow-hidden p-0">
          <CityScape>
            <CardTitle className="text-3xl font-bold text-white text-center relative z-10">
              Reset Your Password
            </CardTitle>
            <p className="text-green-100 text-center mt-2 relative z-10">
              {emailSent ? 'Check your email' : 'Enter your email to receive reset instructions'}
            </p>
          </CityScape>
        </CardHeader>
      
        <CardContent className="p-8 space-y-6">
          {!emailSent ? (
            <>
              {/* Email Input */}
              <div className="relative">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FiMail className="text-green-600" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-400 transition-all duration-200"
                  disabled={loading}
                />
              </div>

              {/* Reset Password Button */}
              <Button
                className="w-full py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Reset Instructions'}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  onClick={handleBackToLogin}
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-4">
                  Weve sent password reset instructions to:<br />
                  <span className="font-medium text-green-700">{email}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Didnt receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                  }}
                  className="flex-1 py-3"
                >
                  Try Different Email
                </Button>
                <Button
                  onClick={handleBackToLogin}
                  className="flex-1 py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
              }
