import { API_BASE, STORAGE_KEYS } from '../config/constants';

/* =========================================================
   Helper: fetch dengan retry
   ========================================================= */
async function fetchWithRetry(url, options = {}, retries = 2, delay = 800) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (i < retries) {
        console.warn(`[fetch] Retry ${i + 1}/${retries} untuk ${url}`);
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
      }
    }
  }
  throw lastErr;
}

/* =========================================================
   PROVINSI
   ========================================================= */
export async function getProvinsiList() {
  const res = await fetchWithRetry(`${API_BASE}/shalat/provinsi`);
  const json = await res.json();
  const list = json.data ?? [];
  console.log('[prayerService] Provinsi loaded:', list.length);
  return list;
}

/* =========================================================
   KABUPATEN / KOTA
   ========================================================= */
export async function getKabkotaList(provinsi) {
  console.log('[prayerService] Fetch kabkota untuk:', provinsi);
  const res = await fetchWithRetry(`${API_BASE}/shalat/kabkota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provinsi }),
  });
  const json = await res.json();
  const list = json.data ?? [];
  console.log('[prayerService] Kabkota loaded:', list.length, 'items');
  return list;
}

/* =========================================================
   JADWAL BULANAN + CACHE
   ========================================================= */
function cacheKey(provinsi, kabkota, bulan, tahun) {
  return `${STORAGE_KEYS.PRAYER_CACHE_PREFIX}${provinsi}|${kabkota}|${bulan}|${tahun}`;
}

export async function getMonthlySchedule({ provinsi, kabkota, bulan, tahun }) {
  const now = new Date();
  const b = bulan ?? now.getMonth() + 1;
  const t = tahun ?? now.getFullYear();

  const key = cacheKey(provinsi, kabkota, b, t);

  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.jadwal?.length) return parsed;
    }
  } catch {
    /* ignore */
  }

  const res = await fetchWithRetry(`${API_BASE}/shalat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provinsi, kabkota, bulan: b, tahun: t }),
  });
  const json = await res.json();
  const data = json.data;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }

  return data;
}

/* =========================================================
   Helper: Ambil jadwal hari ini
   ========================================================= */
export function getTodaySchedule(scheduleData) {
  if (!scheduleData?.jadwal?.length) return null;
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  return (
    scheduleData.jadwal.find((d) => d.tanggal_lengkap === iso) ??
    scheduleData.jadwal[0]
  );
}
