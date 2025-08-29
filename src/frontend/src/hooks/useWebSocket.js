import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

window.Pusher = Pusher;

const useWebSocket = () => {
  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    if (user && user.id && !window.Echo) {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.warn('No access token found for WebSocket connection');
        return;
      }

      if (window.Echo) {
        window.Echo.disconnect();
      }

      const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_WEBSOCKET_KEY || 'DRcpFZv3w5a4',
        cluster: process.env.REACT_APP_WEBSOCKET_CLUSTER || 'mt1',
        wsHost: process.env.REACT_APP_WEBSOCKET_HOST || 'localhost',
        wsPort: 6001,
        authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
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
        activityTimeout: 30000,
        pongTimeout: 15000,
        maxReconnectionAttempts: 5,
        maxReconnectGap: 5000,
      });

      window.Echo = echo;
      console.log('WebSocket connection established');
    } else if (!user || !user.id) {
      if (window.Echo) {
        window.Echo.disconnect();
        window.Echo = null;
        console.log('WebSocket connection disconnected');
      }
    }

    return () => {
      // Don't disconnect on unmount to keep connection alive for other components
    };
  }, [user]);

  return window.Echo;
};

export default useWebSocket;
