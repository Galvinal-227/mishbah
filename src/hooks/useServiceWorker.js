import { useEffect } from 'react';

/**
 * Registrasi service worker untuk PWA.
 * Hanya aktif di production build (agar dev tidak di-cache).
 */
export function useServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (import.meta.env.DEV) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        if (import.meta.env.DEV) {
          console.log('[SW] registered', reg.scope);
        }
      } catch (err) {
        console.warn('[SW] registration failed', err);
      }
    };

    // Delay sampai window load
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);

    return () => window.removeEventListener('load', register);
  }, []);
}

export default useServiceWorker;