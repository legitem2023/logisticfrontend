// src/services/PasswordResetService.ts
import { EmailService, EmailServiceConfig } from './EmailService';

export interface ResetTokenData {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}

export interface PasswordResetResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface PasswordValidationResult {
  valid: boolean;
  email?: string;
  message: string;
}

// Simple in-memory store (replace with database in production)
const resetTokens = new Map<string, ResetTokenData>();

// Clean up expired tokens every hour
setInterval(() => {
  const now = new Date();
  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expiresAt) {
      resetTokens.delete(token);
    }
  }
}, 60 * 60 * 1000);

// ========== HELPER FUNCTIONS ==========

function generateResetToken(): string {
  // Use crypto for secure token generation
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

function generateExpiryDate(hours: number = 1): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true, message: 'Password is strong' };
}

// ========== MAIN FUNCTIONS ==========

/**
 * Generate a reset token for a user
 */
export async function generateResetTokenForUser(userId: string): Promise<string> {
  return generateResetToken();
}

/**
 * Send a password reset email
 */
export async function sendResetEmail(email: string, token: string): Promise<void> {
  // Get email configuration from environment
  const config: EmailServiceConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || ''
    },
    from: process.env.EMAIL_FROM || 'noreply@example.com'
  };
  
  try {
    const emailService = new EmailService(config);
    const emailSent = await emailService.sendPasswordResetEmail(email, token);
    
    if (!emailSent) {
      throw new Error('Failed to send reset email');
    }
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
}

/**
 * Request a password reset
 */
export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Generate reset token
    const token = generateResetToken();
    const expiresAt = generateExpiryDate();

    // Store token
    resetTokens.set(token, {
      email,
      token,
      expiresAt,
      used: false
    });

    // Send email
    await sendResetEmail(email, token);

    return { 
      success: true, 
      message: 'Password reset instructions sent to your email',
      token // In production, you might not want to return the token
    };
  } catch (error) {
    console.error('Password reset request failed:', error);
    return { 
      success: false, 
      message: 'An error occurred while processing your request' 
    };
  }
}

/**
 * Validate a reset token
 */
export function validateResetToken(token: string): PasswordValidationResult {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData) {
    return { valid: false, message: 'Invalid or expired reset token' };
  }

  if (tokenData.used) {
    return { valid: false, message: 'This reset token has already been used' };
  }

  if (new Date() > tokenData.expiresAt) {
    resetTokens.delete(token);
    return { valid: false, message: 'Reset token has expired' };
  }

  return { 
    valid: true, 
    email: tokenData.email,
    message: 'Token is valid' 
  };
}

/**
 * Reset password using a token
 */
export async function resetPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
  try {
    const validation = validateResetToken(token);
    
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message };
    }

    // Mark token as used
    const tokenData = resetTokens.get(token);
    if (tokenData) {
      tokenData.used = true;
      resetTokens.set(token, tokenData);
    }

    return { 
      success: true, 
      message: 'Password has been successfully reset' 
    };
  } catch (error) {
    console.error('Password reset failed:', error);
    return { 
      success: false, 
      message: 'An error occurred while resetting your password' 
    };
  }
}

/**
 * Get statistics about reset tokens
 */
export function getResetTokenStats(): { activeTokens: number } {
  return {
    activeTokens: resetTokens.size
  };
}

// ========== COMPATIBILITY EXPORT ==========

/**
 * Export as an object to maintain compatibility with existing code
 * This matches the static method interface your resolver expects
 */
export const PasswordResetService = {
  generateResetToken: generateResetTokenForUser,
  sendResetEmail: sendResetEmail,
  requestPasswordReset: requestPasswordReset,
  validateResetToken: validateResetToken,
  resetPassword: resetPassword,
  getStats: getResetTokenStats
};
