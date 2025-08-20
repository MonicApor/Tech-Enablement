import { PublicClientApplication } from '@azure/msal-browser';
import { useCallback, useState } from 'react';
import { loginRequest, msalConfig } from '../config/msalConfig';

const msalInstance = new PublicClientApplication(msalConfig);

export const useMicrosoftAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await msalInstance.initialize();
      const response = await msalInstance.loginPopup(loginRequest);

      if (response.idToken) {
        const backendResponse = await fetch('/api/auth/microsoft/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id_token: response.idToken,
          }),
        });

        const data = await backendResponse.json();

        if (backendResponse.ok) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          return data;
        } else {
          throw new Error(data.message || 'Authentication failed');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await msalInstance.initialize();
      await msalInstance.logoutPopup();

      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Notify backend
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUser = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = getToken();
    const user = getUser();
    return !!(token && user);
  }, [getToken, getUser]);

  return {
    login,
    logout,
    getUser,
    getToken,
    isAuthenticated,
    isLoading,
    error,
  };
};

export default useMicrosoftAuth;
