import { useMemo, useState, useEffect } from 'react';
import { useSurahList } from './useSurahList';
import {
  isArabicQuery,
  normalizeArabic,
  normalizeLatin,
} from '../utils/searchUtils';
import { getSurahDetail } from '../services/quranService';

/**
 * Hook pencarian Al-Qur'an:
 * - Cari surah (client-side, dari list yang sudah di-cache)
 * - Cari ayat (lazy — fetch surah detail saat query Latin/Arab panjang)
 *
 * Mengembalikan: { surahResults, ayahResults, loading, error, hasQuery }
 */
export function useQuranSearch(query, { minAyahQueryLength = 3 } = {}) {
  const { surahs, loading: loadingSurahs } = useSurahList();
  const [ayahResults, setAyahResults] = useState([]);
  const [loadingAyah, setLoadingAyah] = useState(false);
  const [error, setError] = useState(null);

  const trimmed = (query ?? '').trim();
  const hasQuery = trimmed.length > 0;

  /* =========================================================
     1. Cari surah
     ========================================================= */
  const surahResults = useMemo(() => {
    if (!hasQuery || !surahs?.length) return [];
    const q = trimmed.toLowerCase();
    const isArabic = isArabicQuery(trimmed);
    const normQ = isArabic ? normalizeArabic(trimmed) : normalizeLatin(trimmed);

    return surahs
      .filter((s) => {
        const nomor = String(s.nomor);
        if (nomor === q) return true;

        const nama = s.namaLatin ?? s.nama_latin ?? '';
        const arabic = s.nama ?? '';
        const arti = s.arti ?? '';
        const tempat = s.tempatTurun ?? s.tempat_turun ?? '';

        if (isArabic) {
          return normalizeArabic(arabic).includes(normQ);
        }
        return (
          normalizeLatin(nama).includes(normQ) ||
          normalizeLatin(arti).includes(normQ) ||
          normalizeLatin(tempat).includes(normQ)
        );
      })
      .slice(0, 20);
  }, [surahs, trimmed, hasQuery]);

  /* =========================================================
     2. Cari ayat (lazy, hanya untuk query panjang)
     ========================================================= */
  useEffect(() => {
    const shouldSearchAyah =
      hasQuery && trimmed.length >= minAyahQueryLength;

    if (!shouldSearchAyah) {
      setAyahResults([]);
      setError(null);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      setLoadingAyah(true);
      setError(null);
      try {
        const isArabic = isArabicQuery(trimmed);
        const normQ = isArabic
          ? normalizeArabic(trimmed)
          : normalizeLatin(trimmed);

        // Batasi pencarian ayat: hanya di surah 1-30 untuk performa
        // (bisa disesuaikan; 30 surah pertama sudah mencakup sebagian besar query umum)
        const surahLimit = 30;
        const targetSurahs = surahs.slice(0, surahLimit);

        const found = [];
        const CONCURRENCY = 5;
        const results = [];

        for (let i = 0; i < targetSurahs.length; i += CONCURRENCY) {
          if (ctrl.signal.aborted) return;
          const batch = targetSurahs.slice(i, i + CONCURRENCY);
          const settled = await Promise.allSettled(
            batch.map((s) => getSurahDetail(s.nomor))
          );

          settled.forEach((res, idx) => {
            if (res.status !== 'fulfilled') return;
            const surah = batch[idx];
            const ayat = res.value?.ayat ?? [];

            ayat.forEach((a) => {
              const teksArab = a.teksArab ?? '';
              const teksLatin = a.teksLatin ?? '';
              const teksIndo = a.teksIndonesia ?? '';

              const haystack = isArabic
                ? normalizeArabic(teksArab)
                : normalizeLatin(`${teksLatin} ${teksIndo}`);

              if (haystack.includes(normQ)) {
                found.push({
                  surahNumber: surah.nomor,
                  surahName:
                    surah.namaLatin ?? surah.nama_latin ?? `Surah ${surah.nomor}`,
                  ayahNumber: a.nomorAyat,
                  teksArab,
                  teksLatin,
                  teksIndonesia: teksIndo,
                });
              }
            });
          });

          if (found.length >= 30) break;
        }

        results.push(...found.slice(0, 30));
        if (!ctrl.signal.aborted) setAyahResults(results);
      } catch (err) {
        if (!ctrl.signal.aborted) {
          setError(err.message || 'Gagal mencari ayat');
        }
      } finally {
        if (!ctrl.signal.aborted) setLoadingAyah(false);
      }
    })();

    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed, minAyahQueryLength]);

  return {
    surahResults,
    ayahResults,
    loading: loadingSurahs || loadingAyah,
    error,
    hasQuery,
  };
}

export default useQuranSearch;