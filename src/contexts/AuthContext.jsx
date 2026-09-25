import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  const clearError = () => setError(null);

  const wrap = async (fn) => {
    try {
      setError(null);
      return await fn();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      user,
      initializing,
      error,
      clearError,

      register: (email, password) =>
        wrap(() => createUserWithEmailAndPassword(auth, email, password)),

      login: (email, password) =>
        wrap(() => signInWithEmailAndPassword(auth, email, password)),

      loginWithGoogle: () =>
        wrap(() => signInWithPopup(auth, googleProvider)),

      logout: () => wrap(() => signOut(auth)),

      resetPassword: (email) =>
        wrap(() => sendPasswordResetEmail(auth, email)),

      updateDisplayName: (name) =>
        wrap(async () => {
          if (!auth.currentUser) throw new Error('Belum login');
          await updateProfile(auth.currentUser, { displayName: name });
          setUser({ ...auth.currentUser });
        }),
    }),
    [user, initializing, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}

export default AuthContext;