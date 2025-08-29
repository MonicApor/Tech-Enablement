import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const createEcho = () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    console.warn('No access token found for WebSocket connection');
    return null;
  }

  return new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_WEBSOCKET_KEY || 'DRcpFZv3w5a4',
    cluster: process.env.REACT_APP_WEBSOCKET_CLUSTER || 'mt1',
    wsHost: process.env.REACT_APP_WEBSOCKET_HOST || 'localhost',
    wsPort: 6001,
    authEndpoint: `http://localhost:8000/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    forceTLS: false,
    encrypted: true,
    enableLogging: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  });
};

const echo = createEcho();

export const getEcho = () => {
  if (!echo) {
    return createEcho();
  }
  return echo;
};

export default echo;
