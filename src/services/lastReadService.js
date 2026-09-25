import { STORAGE_KEYS } from '../config/constants';

/* =========================================================
   Guest (localStorage)
   ========================================================= */
export function getGuestLastRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setGuestLastRead(payload) {
  try {
    const data = {
      surahNumber: payload.surahNumber,
      surahName: payload.surahName,
      ayahNumber: payload.ayahNumber,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(data));
    return data;
  } catch {
    return null;
  }
}

export function clearGuestLastRead() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_READ);
  } catch {
    /* ignore */
  }
}

/* =========================================================
   Unified API — nanti di Batch 6 akan ditambah Firestore sync
   ========================================================= */
export function getLastRead(userId) {
  // Sementara: semua pakai localStorage
  void userId;
  return getGuestLastRead();
}

export function saveLastRead(userId, payload) {
  void userId;
  return setGuestLastRead(payload);
}