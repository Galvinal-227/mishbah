import { useCallback, useEffect, useRef, useState } from 'react';
import { getSurahDetail, getTafsir } from '../services/quranService';

/**
 * Ambil detail surah + tafsir dalam satu hook.
 * Cache di memory (per session), tidak di localStorage (data besar).
 */
export function useSurahDetail(surahNumber) {
  const [detail, setDetail] = useState(null);
  const [tafsirMap, setTafsirMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  const fetchData = useCallback(
    async (num, { force = false } = {}) => {
      if (!num) return;

      if (!force && cacheRef.current.has(num)) {
        const cached = cacheRef.current.get(num);
        setDetail(cached.detail);
        setTafsirMap(cached.tafsirMap);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch paralel: detail surah + tafsir
        const [detailRes, tafsirRes] = await Promise.allSettled([
          getSurahDetail(num),
          getTafsir(num),
        ]);

        if (detailRes.status !== 'fulfilled') {
          throw new Error('Gagal memuat surah');
        }

        const det = detailRes.value;

        // Bangun map tafsir { ayahNumber: teks }
        const tMap = {};
        if (tafsirRes.status === 'fulfilled') {
          tafsirRes.value.forEach((t) => {
            tMap[t.ayat ?? t.nomorAyat] = t.teks;
          });
        }

        cacheRef.current.set(num, { detail: det, tafsirMap: tMap });
        setDetail(det);
        setTafsirMap(tMap);
      } catch (err) {
        setError(err.message || 'Gagal memuat surah');
        setDetail(null);
        setTafsirMap({});
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (surahNumber) fetchData(surahNumber);
  }, [surahNumber, fetchData]);

  return {
    detail,
    tafsirMap,
    loading,
    error,
    reload: () => fetchData(surahNumber, { force: true }),
  };
}

export default useSurahDetail;