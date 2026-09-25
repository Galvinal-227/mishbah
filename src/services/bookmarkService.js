import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

/* =========================================================
   Path helper
   ========================================================= */
function bookmarksCol(uid) {
  return collection(db, 'users', uid, 'bookmarks');
}

function bookmarkDoc(uid, bookmarkId) {
  return doc(db, 'users', uid, 'bookmarks', bookmarkId);
}

/** ID unik per ayat: "1:2" → surah 1 ayat 2 */
export function makeBookmarkId(surahNumber, ayahNumber) {
  return `${surahNumber}:${ayahNumber}`;
}

/* =========================================================
   List
   ========================================================= */
export async function getBookmarks(uid) {
  if (!uid) return [];
  try {
    const q = query(bookmarksCol(uid), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Fallback: tanpa orderBy (kalau field createdAt tidak ada di semua doc)
    const snap = await getDocs(bookmarksCol(uid));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

/* =========================================================
   Add / Remove
   ========================================================= */
export async function addBookmark(uid, bookmark) {
  if (!uid) throw new Error('Belum login');
  const id = makeBookmarkId(bookmark.surahNumber, bookmark.ayahNumber);
  const ref = bookmarkDoc(uid, id);
  const payload = {
    surahNumber: bookmark.surahNumber,
    surahName: bookmark.surahName ?? '',
    ayahNumber: bookmark.ayahNumber,
    teksArab: bookmark.teksArab ?? '',
    teksIndonesia: bookmark.teksIndonesia ?? '',
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: true });
  // return optimistic object
  return { id, ...payload, createdAt: new Date().toISOString() };
}

export async function removeBookmark(uid, surahNumber, ayahNumber) {
  if (!uid) throw new Error('Belum login');
  const id = makeBookmarkId(surahNumber, ayahNumber);
  await deleteDoc(bookmarkDoc(uid, id));
}

/* =========================================================
   Bulk import (dari guest saat pertama login)
   ========================================================= */
export async function bulkImportBookmarks(uid, list = []) {
  if (!uid || !list.length) return;
  await Promise.all(
    list.map((b) =>
      addBookmark(uid, {
        surahNumber: b.surahNumber,
        surahName: b.surahName,
        ayahNumber: b.ayahNumber,
        teksArab: b.teksArab,
        teksIndonesia: b.teksIndonesia,
      })
    )
  );
}

/* =========================================================
   Last Read
   ========================================================= */
export async function getLastRead(uid) {
  if (!uid) return null;
  const ref = doc(db, 'users', uid, 'lastRead', 'current');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveLastRead(uid, payload) {
  if (!uid) return;
  const ref = doc(db, 'users', uid, 'lastRead', 'current');
  await setDoc(
    ref,
    {
      surahNumber: payload.surahNumber,
      surahName: payload.surahName ?? '',
      ayahNumber: payload.ayahNumber,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}