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
import { Authentication, Game, Landing, Profile } from './pages';
import { Layout } from './components';

export const Routes = observer(function Routes() {
  const { authStore } = useMainStore();

  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route
        element={
          authStore.isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
        }
      >
        <Route element={<Layout />}>
          <Route element={<Landing />} path="/" />
          <Route element={<Profile />} path="/profiles/:profileId" />
          <Route element={<Game />} path="/games/:gameId" />
        </Route>
      </Route>,

      <Route element={!authStore.isLoggedIn ? <Outlet /> : <Navigate to="/" />}>
        <Route element={<Authentication />} path="/login" />
      </Route>,

      <Route path="*" element={<div>TODO, 404</div>} />,
    ]),
  );

  return <RouterProvider router={router} />;
});
