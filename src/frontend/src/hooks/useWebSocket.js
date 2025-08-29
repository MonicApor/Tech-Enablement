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
        wssPort: 6001,
        authEndpoint: `http://localhost:8000/api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        forceTLS: false,
        encrypted: false,
        enableLogging: true,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        activityTimeout: 30000,
        pongTimeout: 15000,
        maxReconnectionAttempts: 5,
        maxReconnectGap: 5000,
      });

      window.Echo = echo;
    } else if (!user || !user.id) {
      if (window.Echo) {
        window.Echo.disconnect();
        window.Echo = null;
      }
    }

    return () => {
      // Don't disconnect on unmount to keep connection alive for other components
    };
  }, [user]);

  return window.Echo;
};

export default useWebSocket;
