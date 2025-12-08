// api/password-reset.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PasswordResetService } from '../../Services/PasswordResetService';
import { EmailServiceConfig } from '../../Services/EmailService';

// Configuration for email service
const emailConfig: EmailServiceConfig = {
  service: 'nodemailer',
  apiKey: process.env.EMAIL_API_KEY || 'bqbtblpnwsllnaze',
  fromEmail: process.env.FROM_EMAIL || 'noreply@adiviso.com',
  appName: process.env.APP_NAME || 'Pramatiso Express',
  baseUrl: process.env.BASE_URL || 'https://adiviso.com'
};

const passwordResetService = new PasswordResetService(emailConfig);

// Type definitions for request body
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

// Type definitions for results
interface PasswordResetResult {
  success: boolean;
  message?: string;
  email?: string;
  expiresAt?: Date;
  userId?: string | number;
}

interface TokenValidationResult {
  valid: boolean;
  message?: string;
  email?: string;
  expiresAt?: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'POST':
        const { action, ...data } = req.body;

        switch (action) {
          case 'request-reset':
            await handleRequestPasswordReset(data as RequestPasswordResetInput, res);
            break;
          
          case 'reset-password':
            await handleResetPassword(data as ResetPasswordInput, res);
            break;
          
          case 'validate-token':
            await handleValidateToken(data as ValidateResetTokenInput, res);
            break;
          
          default:
            res.status(400).json({ 
              success: false, 
              message: 'Invalid action specified' 
            });
        }
        break;

      case 'GET':
        // Handle token validation via GET (for email links)
        const { token } = req.query;
        if (token) {
          await handleValidateToken({ token: token as string }, res);
        } else {
          res.status(400).json({ 
            success: false, 
            message: 'Token parameter is required' 
          });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        res.status(405).json({ 
          success: false, 
          message: `Method ${req.method} not allowed` 
        });
    }
  } catch (error: any) {
    console.error('Password reset API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Handler for requesting password reset
async function handleRequestPasswordReset(
  data: RequestPasswordResetInput,
  res: NextApiResponse
) {
  const { email } = data;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Valid email address is required' 
    });
  }

  try {
    const result = await passwordResetService.requestPasswordReset(email) as PasswordResetResult;
    
    if (result.success) {
      console.log('Password reset result:', result);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
        data: {
          // Only include email and expiresAt if they exist in the result
          email: result.email || email, // Fall back to the input email
          expiresAt: result.expiresAt || null
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to send password reset email'
      });
    }
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
}

// Handler for resetting password
async function handleResetPassword(
  data: ResetPasswordInput,
  res: NextApiResponse
) {
  const { token, newPassword } = data;

  if (!token || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token and new password are required' 
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters long' 
    });
  }

  try {
    const result = await passwordResetService.resetPassword(token, newPassword) as PasswordResetResult;
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
        data: {
          userId: result.userId || null,
          email: result.email || null
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to reset password'
      });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
}

// Handler for validating reset token
async function handleValidateToken(
  data: ValidateResetTokenInput,
  res: NextApiResponse
) {
  const { token } = data;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token is required' 
    });
  }

  try {
    const result = await passwordResetService.validateResetToken(token) as TokenValidationResult;
    
    if (result.valid) {
      res.status(200).json({
        success: true,
        valid: true,
        message: 'Token is valid',
        data: {
          email: result.email || null,
          expiresAt: result.expiresAt || null
        }
      });
    } else {
      res.status(400).json({
        success: false,
        valid: false,
        message: result.message || 'Token is invalid or expired'
      });
    }
  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({
      success: false,
      valid: false,
      message: 'Failed to validate token'
    });
  }
}

// Utility function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
