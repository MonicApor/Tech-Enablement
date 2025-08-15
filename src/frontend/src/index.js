import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// handle windows display scaling
const scale = +1 / window.devicePixelRatio > 1 ? +1 / window.devicePixelRatio : 1;
document
  .querySelector('meta[name=viewport]')
  .setAttribute('content', `width=device-width, initial-scale=${scale}`);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const token = localStorage.getItem('access_token');
const { REACT_APP_WEBSOCKET_KEY, REACT_APP_WEBSOCKET_HOST, REACT_APP_WEBSOCKET_CLUSTER } =
  process.env;

if (token) {
  window.Pusher = Pusher;
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: REACT_APP_WEBSOCKET_KEY,
    wsHost: REACT_APP_WEBSOCKET_HOST,
    cluster: REACT_APP_WEBSOCKET_CLUSTER,
    authEndpoint: '/api/v1/broadcasting/auth',
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
}

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
