import { useEffect, useState } from 'react';

/**
 * Debounce sebuah nilai.
 * const debounced = useDebounce(searchTerm, 400);
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;