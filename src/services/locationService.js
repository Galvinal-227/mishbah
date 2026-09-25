import { REVERSE_GEOCODE_BASE } from '../config/constants';

/* =========================================================
   Reverse geocoding — Nominatim (primary) + BigDataCloud (fallback)
   ========================================================= */
export async function reverseGeocode(lat, lng) {
  // Primary: Nominatim OpenStreetMap — data lebih lengkap (county, city, suburb)
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=id`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      console.log('[Geocode] Nominatim:', data);
      if (data?.address) {
        return {
          source: 'nominatim',
          city: data.address.city,
          town: data.address.town,
          county: data.address.county,
          municipality: data.address.municipality,
          state: data.address.state,
          suburb: data.address.suburb,
          village: data.address.village,
          raw: data,
        };
      }
    }
  } catch (err) {
    console.warn('[Geocode] Nominatim gagal, fallback BigDataCloud', err);
  }

  // Fallback: BigDataCloud
  const url = `${REVERSE_GEOCODE_BASE}?latitude=${lat}&longitude=${lng}&localityLanguage=id`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mendeteksi lokasi');
  const data = await res.json();
  console.log('[Geocode] BigDataCloud:', data);
  return {
    source: 'bigdatacloud',
    city: data.city,
    locality: data.locality,
    principalSubdivision: data.principalSubdivision,
    ...data,
  };
}

/* =========================================================
   Browser Geolocation API wrapper
   ========================================================= */
export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Browser tidak mendukung geolocation'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const map = {
          1: 'Izin lokasi ditolak',
          2: 'Lokasi tidak tersedia',
          3: 'Waktu permintaan lokasi habis',
        };
        reject(new Error(map[err.code] || 'Gagal mengambil lokasi'));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000, ...options }
    );
  });
}

/* =========================================================
   Normalisasi string (buang prefix Kota/Kab., tanda baca)
   ========================================================= */
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/^(kota|kab\.?|kabupaten|kecamatan|kelurahan|desa)\s+/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/* =========================================================
   Match kabupaten/kota — 4 level strategi
   ========================================================= */
export function matchKabkota(kabkotaList, candidates = []) {
  if (!kabkotaList?.length || !candidates?.length) {
    console.log('[matchKabkota] Skip — list kosong atau candidates kosong');
    return null;
  }

  const cands = candidates
    .filter(Boolean)
    .map(normalize)
    .filter((c) => c.length > 0);

  console.log('[matchKabkota] Candidates:', cands);
  console.log(
    '[matchKabkota] Kabkota list (5 first):',
    kabkotaList.slice(0, 5).map(normalize)
  );

  // 1) Exact match
  for (const cand of cands) {
    const hit = kabkotaList.find((k) => normalize(k) === cand);
    if (hit) {
      console.log('[matchKabkota] Exact:', cand, '→', hit);
      return hit;
    }
  }

  // 2) Contains (either way)
  for (const cand of cands) {
    if (cand.length < 3) continue;
    const hit = kabkotaList.find((k) => {
      const nk = normalize(k);
      return nk.includes(cand) || cand.includes(nk);
    });
    if (hit) {
      console.log('[matchKabkota] Contains:', cand, '→', hit);
      return hit;
    }
  }

  // 3) Word-by-word (kata ≥4 huruf)
  for (const cand of cands) {
    const words = cand.split(' ').filter((w) => w.length >= 4);
    for (const word of words) {
      const hit = kabkotaList.find((k) => normalize(k).includes(word));
      if (hit) {
        console.log('[matchKabkota] Word:', word, '→', hit);
        return hit;
      }
    }
  }

  // 4) Substring dari 5 huruf pertama (fuzzy)
  for (const cand of cands) {
    if (cand.length < 5) continue;
    const prefix = cand.slice(0, 5);
    const hit = kabkotaList.find((k) => normalize(k).startsWith(prefix));
    if (hit) {
      console.log('[matchKabkota] Prefix:', prefix, '→', hit);
      return hit;
    }
  }

  console.log('[matchKabkota] Tidak ada yang match');
  return null;
}
