import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { 
  LOGOUT_MUTATION, 
  LOGOUT_ALL_MUTATION, 
  AUTH_STATUS_QUERY
} from "../../../../graphql/mutation";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface AuthStatus {
  authenticated: boolean;
  user: User | null;
}

export const useAuth = () => {
  const router = useRouter();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const [logoutAllMutation] = useMutation(LOGOUT_ALL_MUTATION);
  const [loginFacebookMutation] = useMutation(LOGIN_FACEBOOK_MUTATION);
  
  const { data, loading, error, refetch } = useQuery<{ authStatus: AuthStatus }>(AUTH_STATUS_QUERY);

  const logout = async (allDevices: boolean = false): Promise<void> => {
    try {
      if (allDevices) {
        await logoutAllMutation();
      } else {
        await logoutMutation();
      }
      
      // Clear client-side storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('auth-token');
      }
      
      // Redirect to login
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const loginWithFacebook = async (idToken: string): Promise<string> => {
    try {
      const { data } = await loginFacebookMutation({
        variables: { input: { idToken } }
      });
      
      if (data?.loginWithFacebook?.token) {
        // Store token
        localStorage.setItem('auth-token', data.loginWithFacebook.token);
        return data.loginWithFacebook.token;
      }
      throw new Error('Login failed');
    } catch (err) {
      console.error('Facebook login error:', err);
      throw err;
    }
  };

  return {
    user: data?.authStatus.user,
    isAuthenticated: data?.authStatus.authenticated,
    loading,
    error,
    refetch,
    logout: () => logout(false),
    logoutAllDevices: () => logout(true),
    loginWithFacebook
  };
};
