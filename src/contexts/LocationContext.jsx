import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../config/constants';
import { getProvinsiList, getKabkotaList } from '../services/prayerService';
import {
  getCurrentPosition,
  reverseGeocode,
  matchKabkota,
} from '../services/locationService';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useLocalStorage(STORAGE_KEYS.LOCATION, null);
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabkotaList, setKabkotaList] = useState([]);
  const [loadingProvinsi, setLoadingProvinsi] = useState(false);
  const [loadingKabkota, setLoadingKabkota] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingProvinsi(true);
        const list = await getProvinsiList();
        if (mounted) setProvinsiList(list);
      } catch (err) {
        if (mounted) setError(err.message || 'Gagal memuat provinsi');
      } finally {
        if (mounted) setLoadingProvinsi(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!location?.provinsi) {
      setKabkotaList([]);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        setLoadingKabkota(true);
        const list = await getKabkotaList(location.provinsi);
        if (mounted) setKabkotaList(list);
      } catch (err) {
        if (mounted) setError(err.message || 'Gagal memuat kabupaten/kota');
      } finally {
        if (mounted) setLoadingKabkota(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location?.provinsi]);

  const setManual = useCallback(
    (provinsi, kabkota) => {
      setLocation({
        provinsi,
        kabkota,
        source: 'manual',
        updatedAt: Date.now(),
      });
    },
    [setLocation]
  );

  const clear = useCallback(() => setLocation(null), [setLocation]);

  /**
   * Deteksi otomatis dengan matching yang lebih pintar.
   */
  const detectAuto = useCallback(async () => {
    setDetecting(true);
    setError(null);

    try {
      // 1. Ambil posisi
      console.log('[Detect] Meminta izin lokasi...');
      const { lat, lng } = await getCurrentPosition();
      console.log('[Detect] Koordinat:', lat, lng);

      // 2. Reverse geocode
      console.log('[Detect] Reverse geocoding...');
      const geo = await reverseGeocode(lat, lng);
      console.log('[Detect] Hasil geocode:', geo);

      // 3. Kumpulkan kandidat provinsi
      const candidatesProv = [
        geo.principalSubdivision,
        geo.principalSubdivisionCode,
        geo.localityInfo?.administrative?.[1]?.name,
      ].filter(Boolean);

      console.log('[Detect] Kandidat provinsi:', candidatesProv);

      // 4. Match provinsi (exact → partial)
      let matchedProvinsi = null;

      // 4a. Exact match dulu
      for (const cand of candidatesProv) {
        const hit = provinsiList.find(
          (p) => p.toLowerCase() === String(cand).toLowerCase()
        );
        if (hit) {
          matchedProvinsi = hit;
          break;
        }
      }

      // 4b. Normalized match (hilangkan "Prov.", "DKI", dll)
      if (!matchedProvinsi) {
        const normalizeProv = (s) =>
          String(s)
            .toLowerCase()
            .replace(/^(prov\.?|provinsi|dki|di)\s+/i, '')
            .replace(/[^a-z\s]/g, '')
            .trim();

        const normalizedCands = candidatesProv.map(normalizeProv);

        for (const cand of normalizedCands) {
          if (!cand) continue;
          const hit = provinsiList.find(
            (p) => normalizeProv(p) === cand
          );
          if (hit) {
            matchedProvinsi = hit;
            break;
          }
        }

        // 4c. Partial match (kata pertama)
        if (!matchedProvinsi) {
          for (const cand of normalizedCands) {
            if (!cand) continue;
            const firstWord = cand.split(' ')[0];
            if (firstWord.length < 4) continue;
            const hit = provinsiList.find((p) =>
              normalizeProv(p).includes(firstWord)
            );
            if (hit) {
              matchedProvinsi = hit;
              break;
            }
          }
        }
      }

      if (!matchedProvinsi) {
        throw new Error(
          `Provinsi tidak dikenali dari lokasi Anda (${candidatesProv[0] || 'tidak diketahui'}). Pilih manual.`
        );
      }

      console.log('[Detect] Provinsi matched:', matchedProvinsi);

      // 5. Ambil kabupaten/kota untuk provinsi ini
      const kabs = await getKabkotaList(matchedProvinsi);
      console.log('[Detect] Total kabkota:', kabs.length);

      // 6. Kumpulkan kandidat kabupaten
      const candidatesKab = [
        geo.city,
        geo.locality,
        geo.localityInfo?.administrative?.[2]?.name,
        geo.localityInfo?.administrative?.[3]?.name,
        geo.localityInfo?.administrative?.[4]?.name,
      ].filter(Boolean);

      console.log('[Detect] Kandidat kabkota:', candidatesKab);

      // 7. Match kabupaten
      const matchedKab = matchKabkota(kabs, candidatesKab);

      if (!matchedKab) {
        throw new Error(
          `Kabupaten/kota tidak dikenali (${
            candidatesKab[0] || 'tidak diketahui'
          }). Pilih manual.`
        );
      }

      console.log('[Detect] Kabkota matched:', matchedKab);

      const result = {
        provinsi: matchedProvinsi,
        kabkota: matchedKab,
        source: 'auto',
        updatedAt: Date.now(),
      };
      setLocation(result);
      return result;
    } catch (err) {
      console.error('[Detect] Gagal:', err);
      setError(err.message || 'Gagal mendeteksi lokasi');
      return null;
    } finally {
      setDetecting(false);
    }
  }, [provinsiList, setLocation]);

  const value = useMemo(
    () => ({
      location,
      provinsiList,
      kabkotaList,
      loadingProvinsi,
      loadingKabkota,
      detecting,
      error,
      setManual,
      clear,
      detectAuto,
    }),
    [
      location,
      provinsiList,
      kabkotaList,
      loadingProvinsi,
      loadingKabkota,
      detecting,
      error,
      setManual,
      clear,
      detectAuto,
    ]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationCtx() {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error('useLocationCtx harus dipakai di dalam <LocationProvider>');
  return ctx;
}

export default LocationContext;
