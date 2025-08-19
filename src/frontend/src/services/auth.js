import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from 'config/msalConfig';
import api from 'utils/api';

const msalInstance = new PublicClientApplication(msalConfig);

const loginWithMicrosoft = async () => {
  if (
    !process.env.REACT_APP_AZURE_CLIENT_ID ||
    process.env.REACT_APP_AZURE_CLIENT_ID === 'placeholder-client-id'
  ) {
    throw new Error(
      'Microsoft 365 authentication is not configured. Please set REACT_APP_AZURE_CLIENT_ID and REACT_APP_AZURE_TENANT_ID environment variables.'
    );
  }

  try {
    await msalInstance.initialize();

    const response = await msalInstance.loginPopup(loginRequest);

    localStorage.setItem('microsoft_access_token', response.accessToken);
    localStorage.setItem('microsoft_id_token', response.idToken);

    const backendResponse = await api.post('/auth/microsoft/validate', {
      access_token: response.accessToken,
      id_token: response.idToken,
    });

    const { access_token, refresh_token } = backendResponse.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return backendResponse.data.user;
  } catch (error) {
    console.error('Microsoft login failed:', error);
    throw error;
  }
};

const login = async ({ ...props }) => {
  return await api
    .post('/oauth/token', {
      grant_type: 'password',
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      ...props,
    })
    .then(async ({ data }) => {
      const { access_token, refresh_token } = data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      return await api.get('/profile').then(({ data }) => data.data);
    });
};

const getCurrentUser = async () => {
  return await api.get('/auth/user').then(({ data }) => data.user);
};

const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Backend logout failed:', error);
  }

  localStorage.clear();

  try {
    // Initialize MSAL instance before using it
    await msalInstance.initialize();

    await msalInstance.logoutPopup({
      postLogoutRedirectUri: window.location.origin + '/login',
    });
  } catch (error) {
    console.error('Microsoft logout failed:', error);
    window.location.href = '/login';
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

export { login, loginWithMicrosoft, logout, getCurrentUser, isAuthenticated };
