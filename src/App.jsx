import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ReadingPrefsProvider } from './contexts/ReadingPrefsContext';
import { LocationProvider } from './contexts/LocationContext';
import { AudioProvider } from './contexts/AudioContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { AppRouter } from './router';
import { useLenis } from './hooks/useLenis';
import { useServiceWorker } from './hooks/useServiceWorker';

function AppBoot() {
  useLenis();
  useServiceWorker();
  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ReadingPrefsProvider>
          <LocationProvider>
            <AudioProvider>
              <UserDataProvider>
                <AppBoot />
                <AppRouter />
              </UserDataProvider>
            </AudioProvider>
          </LocationProvider>
        </ReadingPrefsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}