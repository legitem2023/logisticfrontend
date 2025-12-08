// hooks/usePasswordReset.ts
import { useState } from 'react';

interface UsePasswordResetReturn {
  requestReset: (email: string) => Promise<ApiResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<ApiResponse>;
  validateToken: (token: string) => Promise<ApiResponse>;
  loading: boolean;
  error: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function usePasswordReset(): UsePasswordResetReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = async (email: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request-reset',
          email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset-password',
          token,
          newPassword,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/password-reset?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to validate token');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    requestReset,
    resetPassword,
    validateToken,
    loading,
    error,
  };
}
