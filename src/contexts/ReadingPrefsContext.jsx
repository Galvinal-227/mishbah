import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../config/constants';

const DEFAULT_PREFS = {
  arabicSize: 'base',      // sm | base | lg | xl
  arabicFont: 'arabic',    // arabic (Amiri) | arabicAlt (Scheherazade)
  latinSize: 15,           // px
  translationSize: 15,     // px
  lineHeight: 2.0,         // untuk teks Arab
  showLatin: true,
  showTranslation: true,
  showTafsir: false,
  autoScroll: false,
};

const ReadingPrefsContext = createContext(null);

export function ReadingPrefsProvider({ children }) {
  const [prefs, setPrefs, resetPrefs] = useLocalStorage(
    STORAGE_KEYS.READING_PREFS,
    DEFAULT_PREFS
  );

  const value = useMemo(() => {
    const merged = { ...DEFAULT_PREFS, ...(prefs || {}) };

    const update = (patch) =>
      setPrefs((prev) => ({ ...DEFAULT_PREFS, ...(prev || {}), ...patch }));

    const toggle = (key) =>
      update({ [key]: !merged[key] });

    return {
      prefs: merged,
      update,
      toggle,
      reset: () => setPrefs(DEFAULT_PREFS),
      defaults: DEFAULT_PREFS,
    };
  }, [prefs, setPrefs]);

  return (
    <ReadingPrefsContext.Provider value={value}>
      {children}
    </ReadingPrefsContext.Provider>
  );
}

export function useReadingPrefs() {
  const ctx = useContext(ReadingPrefsContext);
  if (!ctx)
    throw new Error('useReadingPrefs harus dipakai di dalam <ReadingPrefsProvider>');
  return ctx;
}

export default ReadingPrefsContext;