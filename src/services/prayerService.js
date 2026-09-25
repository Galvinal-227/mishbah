import { API_BASE, STORAGE_KEYS } from '../config/constants';

/* =========================================================
   PROVINSI — GET /shalat/provinsi
   ========================================================= */
export async function getProvinsiList() {
  const res = await fetch(`${API_BASE}/shalat/provinsi`);
  if (!res.ok) throw new Error('Gagal memuat daftar provinsi');
  const json = await res.json();
  return json.data ?? [];
}

/* =========================================================
   KABUPATEN / KOTA — POST /shalat/kabkota
   ========================================================= */
export async function getKabkotaList(provinsi) {
  const res = await fetch(`${API_BASE}/shalat/kabkota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provinsi }),
  });
  if (!res.ok) throw new Error('Gagal memuat daftar kabupaten/kota');
  const json = await res.json();
  return json.data ?? [];
}

/* =========================================================
   JADWAL BULANAN — POST /shalat (dengan cache localStorage)
   ========================================================= */
function cacheKey(provinsi, kabkota, bulan, tahun) {
  return `${STORAGE_KEYS.PRAYER_CACHE_PREFIX}${provinsi}|${kabkota}|${bulan}|${tahun}`;
}

export async function getMonthlySchedule({ provinsi, kabkota, bulan, tahun }) {
  const now = new Date();
  const b = bulan ?? now.getMonth() + 1;
  const t = tahun ?? now.getFullYear();

  const key = cacheKey(provinsi, kabkota, b, t);

  // Cek cache dulu
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.jadwal?.length) return parsed;
    }
  } catch {
    /* ignore cache error */
  }

  const res = await fetch(`${API_BASE}/shalat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provinsi, kabkota, bulan: b, tahun: t }),
  });
  if (!res.ok) throw new Error('Gagal memuat jadwal sholat');
  const json = await res.json();
  const data = json.data;

  // Simpan cache
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore quota error */
  }

  return data;
}

/* =========================================================
   HELPER: Ambil jadwal hari ini
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