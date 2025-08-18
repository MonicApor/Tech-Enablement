import admin from './admin';
import employee from './employee';
import hr from './hr';

const routes = [
  // Essential routes - Don't Remove. Handle 404 Pages
  {
    path: '*',
    component: 'pages/guest/NotFound',
    auth: false,
  },
  {
    path: '/',
    component: 'pages/guest/Landing',
    auth: false,
  },
  {
    path: '/auth/callback',
    component: 'pages/guest/AuthCallback',
    auth: false,
  },
  {
    path: '/auth/error',
    component: 'pages/guest/AuthError',
    auth: false,
  },

  ...admin,
  ...hr,
  ...employee,
];

// Don't include styleguide in production routes
if (process.env.ENVIRONMENT !== 'production') {
  routes.push({
    path: '/styleguide',
    component: 'pages/guest/Styleguide',
    auth: false,
  });
}

export default routes;
