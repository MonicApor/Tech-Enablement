import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { isAuthenticated } from 'services/auth';
import Loader from 'components/atoms/Loader';
import routes from './routes';

function Router() {
  const AdminLayout = lazy(() => import('templates/Authenticated'));
  const UserLayout = lazy(() => import('templates/User'));
  const Logout = lazy(() => import('pages/guest/Logout'));

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route, i) => {
          const Page = lazy(() => import(`../${route.component}`));

          // Special handling for root route - check authentication
          if (route.path === '/') {
            const layout = isAuthenticated() ? (
              <AdminLayout />
            ) : (
              <UserLayout navbar={route.navbar} />
            );
            return (
              <Route key={i} element={layout}>
                <Route exact path={route.path} element={<Page />} />
              </Route>
            );
          }

          // Normal route handling
          const layout = route.auth ? <AdminLayout /> : <UserLayout navbar={route.navbar} />;

          return (
            <Route key={i} element={layout}>
              <Route exact path={route.path} element={<Page />} />
            </Route>
          );
        })}

        <Route exact path="/logout" element={<Logout />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
