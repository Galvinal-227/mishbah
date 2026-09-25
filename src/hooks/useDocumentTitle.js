import { useEffect } from 'react';
import { BRAND } from '../config/brand';

/**
 * Set document.title per halaman.
 * useDocumentTitle("Al-Qur'an") → "Al-Qur'an — Mishbah"
 * useDocumentTitle() → hanya nama brand
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const base = BRAND.name;
    document.title = title ? `${title} — ${base}` : `${base} — ${BRAND.tagline}`;
    return () => {
      document.title = `${base} — ${BRAND.tagline}`;
    };
  }, [title]);
}

export default useDocumentTitle;