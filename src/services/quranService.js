import { API_BASE } from '../config/constants';

/* =========================================================
   Helper: normalisasi response
   ========================================================= */
async function handleResponse(res) {
  if (!res.ok) {
    throw new Error(`Request gagal (${res.status})`);
  }
  const json = await res.json();
  if (json.code && json.code !== 200) {
    throw new Error(json.message || 'Response API tidak valid');
  }
  return json.data ?? json;
}

/* =========================================================
   SURAH LIST — GET /surat
   ========================================================= */
export async function getSurahList() {
  const res = await fetch(`${API_BASE}/surat`);
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [];
}

/* =========================================================
   SURAH DETAIL — GET /surat/:nomor
   ========================================================= */
export async function getSurahDetail(surahNumber) {
  const res = await fetch(`${API_BASE}/surat/${surahNumber}`);
  return handleResponse(res);
}

/* =========================================================
   TAFSIR — GET /tafsir/:nomor
   ========================================================= */
export async function getTafsir(surahNumber) {
  const res = await fetch(`${API_BASE}/tafsir/${surahNumber}`);
  const data = await handleResponse(res);
  return data?.tafsir ?? [];
}