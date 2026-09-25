import { useCallback, useEffect, useState } from 'react';
import { getSurahList } from '../services/quranService';

const CACHE_KEY = 'mishbah.cache.surahList';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 hari

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function useSurahList() {
  const [surahs, setSurahs] = useState(() => readCache() ?? []);
  const [loading, setLoading] = useState(() => !readCache());
  const [error, setError] = useState(null);

  const fetchData = useCallback(async ({ force = false } = {}) => {
    if (!force) {
      const cached = readCache();
      if (cached?.length) {
        setSurahs(cached);
        setLoading(false);
        setError(null);
        return;
      }
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getSurahList();
      setSurahs(data);
      writeCache(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar surah');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    surahs,
    loading,
    error,
    reload: () => fetchData({ force: true }),
  };
}

export default useSurahList;