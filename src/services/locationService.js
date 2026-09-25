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
   Toleran: "Kota Bogor" ↔ "Bogor", "Kab. Bandung" ↔ "Bandung"
   ========================================================= */
export function matchKabkota(kabkotaList, candidates = []) {
  if (!kabkotaList?.length || !candidates?.length) return null;

  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .replace(/^(kota|kab\.?|kabupaten)\s+/i, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

  const cands = candidates.filter(Boolean).map(normalize);

  // 1) Exact match
  for (const cand of cands) {
    const hit = kabkotaList.find((k) => normalize(k) === cand);
    if (hit) return hit;
  }
  // 2) Partial match
  for (const cand of cands) {
    if (cand.length < 3) continue;
    const hit = kabkotaList.find((k) => normalize(k).includes(cand));
    if (hit) return hit;
  }
  return null;
}