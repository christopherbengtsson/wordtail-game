import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import { useMainStore } from './stores';
import {
  Authentication,
  GamePresentation,
  Stats,
  Landing,
  Profile,
  ConfirmEmail,
} from './pages';
import { Layout } from './components';
import { LazyExoticComponent, Suspense, lazy } from 'react';
import { isDev } from './Constants';

let DevComponent: LazyExoticComponent<() => JSX.Element> | null = null;
if (isDev) {
  DevComponent = lazy(() => import('./pages/Dev'));
}

export const Routes = observer(function Routes() {
  const { authStore } = useMainStore();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        key="authenticated"
        element={
          authStore.isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
        }
      >
        <Route element={<Layout />}>
          <Route element={<Landing />} path="/" />
          <Route element={<Profile />} path="/profiles/:profileId" />
          <Route element={<GamePresentation />} path="/games/:gameId" />
          <Route element={<Stats />} path="/games/:gameId/stats" />

          {isDev && DevComponent && (
            <Route element={<DevComponent />} path="/dev" />
          )}
        </Route>
      </Route>,

      <Route
        key="unauthenticated"
        element={
          !authStore.isLoggedIn ? (
            <Outlet />
          ) : authStore.confirmEmail ? (
            <Navigate to="/confirm" />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route element={<Authentication />} path="/login" />
        <Route element={<ConfirmEmail />} path="/confirm" />
      </Route>,

      <Route key="404" path="*" element={<div>TODO, 404</div>} />,
    ]),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
});
