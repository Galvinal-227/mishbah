import { STORAGE_KEYS } from '../config/constants';
import { getGuestLastRead, clearGuestLastRead } from './lastReadService';
import { bulkImportBookmarks, saveLastRead } from './bookmarkService';

/* =========================================================
   Guest data di localStorage
   ========================================================= */
export function getGuestBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS_GUEST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearGuestBookmarks() {
  try {
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS_GUEST);
  } catch {
    /* ignore */
  }
}

/* =========================================================
   Migrasi guest → Firestore (dipanggil sekali setelah login)
   ========================================================= */
export async function migrateGuestDataToFirestore(uid) {
  if (!uid) return { bookmarks: 0, lastRead: false };

  const guestBookmarks = getGuestBookmarks();
  const guestLastRead = getGuestLastRead();

  let bookmarksMigrated = 0;

  if (guestBookmarks.length > 0) {
    try {
      await bulkImportBookmarks(uid, guestBookmarks);
      bookmarksMigrated = guestBookmarks.length;
      clearGuestBookmarks();
    } catch (err) {
      console.warn('[migrate] gagal migrasi bookmark', err);
    }
  }

  let lastReadMigrated = false;
  if (guestLastRead) {
    try {
      await saveLastRead(uid, guestLastRead);
      lastReadMigrated = true;
      clearGuestLastRead();
    } catch (err) {
      console.warn('[migrate] gagal migrasi lastRead', err);
    }
  }

  return {
    bookmarks: bookmarksMigrated,
    lastRead: lastReadMigrated,
  };
}