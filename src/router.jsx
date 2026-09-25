import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AuthGuard from './components/auth/AuthGuard';
import GuestGuard from './components/auth/GuestGuard';

const Home = lazy(() => import('./pages/Home'));
const Quran = lazy(() => import('./pages/Quran'));
const QuranReader = lazy(() => import('./pages/QuranReader'));
const Search = lazy(() => import('./pages/Search'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const LastRead = lazy(() => import('./pages/LastRead'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div className="container-page py-20 text-center">
    <div className="mx-auto h-10 w-10 rounded-full border-2 border-emerald-main border-t-transparent animate-spin" />
    <p className="mt-4 text-ink-muted text-sm">Memuat…</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'quran', element: <Quran /> },
      { path: 'quran/:surah', element: <QuranReader /> },
      { path: 'search', element: <Search /> },
      {
        path: 'bookmarks',
        element: (
          <AuthGuard>
            <Bookmarks />
          </AuthGuard>
        ),
      },
      {
        path: 'last-read',
        element: (
          <AuthGuard>
            <LastRead />
          </AuthGuard>
        ),
      },
      { path: 'settings', element: <Settings /> },
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestGuard>
            <ForgotPassword />
          </GuestGuard>
        ),
      },
      {
        path: 'profile',
        element: (
          <AuthGuard>
            <Profile />
          </AuthGuard>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default AppRouter;