import { REVERSE_GEOCODE_BASE } from '../config/constants';

/* =========================================================
   Reverse geocoding via BigDataCloud (gratis, CORS-friendly)
   ========================================================= */
export async function reverseGeocode(lat, lng) {
  const url = `${REVERSE_GEOCODE_BASE}?latitude=${lat}&longitude=${lng}&localityLanguage=id`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mendeteksi lokasi');
  return res.json();
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
   Cocokkan hasil reverse-geocode ke daftar kabkota dari API
   Dengan logging & matching 3-level
   ========================================================= */
export function matchKabkota(kabkotaList, candidates = []) {
  if (!kabkotaList?.length || !candidates?.length) return null;

  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .replace(/^(kota|kab\.?|kabupaten)\s+/i, '')
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

  const cands = candidates
    .filter(Boolean)
    .map(normalize)
    .filter((c) => c.length > 0);

  console.log('[matchKabkota] Candidates:', cands);
  console.log(
    '[matchKabkota] Kabkota sample:',
    kabkotaList.slice(0, 5).map(normalize)
  );

  // 1) Exact match
  for (const cand of cands) {
    const hit = kabkotaList.find((k) => normalize(k) === cand);
    if (hit) {
      console.log('[matchKabkota] Exact match:', cand, '→', hit);
      return hit;
    }
  }

  // 2) Contains match (either way)
  for (const cand of cands) {
    if (cand.length < 3) continue;
    const hit = kabkotaList.find((k) => {
      const nk = normalize(k);
      return nk.includes(cand) || cand.includes(nk);
    });
    if (hit) {
      console.log('[matchKabkota] Contains match:', cand, '→', hit);
      return hit;
    }
  }

  // 3) Word-by-word match (kata ≥3 huruf)
  for (const cand of cands) {
    const words = cand.split(' ').filter((w) => w.length >= 3);
    for (const word of words) {
      const hit = kabkotaList.find((k) => normalize(k).includes(word));
      if (hit) {
        console.log('[matchKabkota] Word match:', word, '→', hit);
        return hit;
      }
    }
  }

  console.log('[matchKabkota] Tidak ada yang match');
  return null;
}
