import { useCallback, useState } from 'react';
import { getCurrentPosition } from '../services/locationService';

/**
 * Hook pembungkus geolocation dengan state loading & error.
 * Hanya minta izin saat user memanggil request().
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (options) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCurrentPosition(options);
      setCoords(result);
      return result;
    } catch (err) {
      setError(err.message || 'Gagal mengambil lokasi');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCoords(null);
    setError(null);
  }, []);

  return { coords, loading, error, request, reset };
}

export default useGeolocation;