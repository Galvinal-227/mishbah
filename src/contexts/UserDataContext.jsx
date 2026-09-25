import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { STORAGE_KEYS } from '../config/constants';
import {
  addBookmark,
  getBookmarks,
  getLastRead as getFirestoreLastRead,
  removeBookmark,
  saveLastRead as saveFirestoreLastRead,
} from '../services/bookmarkService';
import {
  getGuestLastRead,
  setGuestLastRead,
} from '../services/lastReadService';
import {
  getGuestBookmarks,
  migrateGuestDataToFirestore,
} from '../services/firestoreSync';

const UserDataContext = createContext(null);

export function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [migrated, setMigrated] = useState(false);

  const uid = user?.uid ?? null;
  const isGuest = !uid;

  /* =========================================================
     Load data saat user berubah (login / logout / guest)
     ========================================================= */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        if (isGuest) {
          if (!mounted) return;
          setBookmarks(getGuestBookmarks());
          setLastRead(getGuestLastRead());
          return;
        }

        // Login: migrasi guest dulu (sekali per session)
        if (!migrated) {
          try {
            const result = await migrateGuestDataToFirestore(uid);
            if (mounted && (result.bookmarks > 0 || result.lastRead)) {
              setMigrated(true);
            }
          } catch (err) {
            console.warn('[UserData] Migrasi gagal (mungkin offline):', err);
          }
        }

        // Ambil data dari Firestore dengan fallback offline
        try {
          const [bm, lr] = await Promise.all([
            getBookmarks(uid),
            getFirestoreLastRead(uid),
          ]);
          if (!mounted) return;
          setBookmarks(bm ?? []);
          setLastRead(lr ?? null);
        } catch (err) {
          console.warn(
            '[UserData] Firestore offline, pakai data lokal:',
            err?.message
          );
          if (mounted) {
            // Fallback ke localStorage supaya UI tetap bisa tampil
            setBookmarks(getGuestBookmarks());
            setLastRead(getGuestLastRead());
          }
        }
      } catch (err) {
        console.error('[UserData] load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  /* =========================================================
     Bookmark toggle
     ========================================================= */
  const toggleBookmark = useCallback(
    async (payload) => {
      const exists = bookmarks.some(
        (b) =>
          b.surahNumber === payload.surahNumber &&
          b.ayahNumber === payload.ayahNumber
      );

      if (isGuest) {
        const next = exists
          ? bookmarks.filter(
              (b) =>
                !(
                  b.surahNumber === payload.surahNumber &&
                  b.ayahNumber === payload.ayahNumber
                )
            )
          : [
              ...bookmarks,
              {
                surahNumber: payload.surahNumber,
                surahName: payload.surahName,
                ayahNumber: payload.ayahNumber,
                teksArab: payload.teksArab,
                teksIndonesia: payload.teksIndonesia,
                createdAt: Date.now(),
              },
            ];
        setBookmarks(next);
        try {
          localStorage.setItem(
            STORAGE_KEYS.BOOKMARKS_GUEST,
            JSON.stringify(next)
          );
        } catch {
          /* ignore */
        }
        return { added: !exists };
      }

      if (exists) {
        setBookmarks((prev) =>
          prev.filter(
            (b) =>
              !(
                b.surahNumber === payload.surahNumber &&
                b.ayahNumber === payload.ayahNumber
              )
          )
        );
        try {
          await removeBookmark(uid, payload.surahNumber, payload.ayahNumber);
        } catch (err) {
          setBookmarks((prev) => [...prev, { ...payload }]);
          throw err;
        }
        return { added: false };
      } else {
        const optimistic = {
          surahNumber: payload.surahNumber,
          surahName: payload.surahName,
          ayahNumber: payload.ayahNumber,
          teksArab: payload.teksArab,
          teksIndonesia: payload.teksIndonesia,
          createdAt: Date.now(),
        };
        setBookmarks((prev) => [...prev, optimistic]);
        try {
          await addBookmark(uid, payload);
        } catch (err) {
          setBookmarks((prev) =>
            prev.filter(
              (b) =>
                !(
                  b.surahNumber === payload.surahNumber &&
                  b.ayahNumber === payload.ayahNumber
                )
            )
          );
          throw err;
        }
        return { added: true };
      }
    },
    [bookmarks, isGuest, uid]
  );

  const isBookmarked = useCallback(
    (surahNumber, ayahNumber) =>
      bookmarks.some(
        (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
      ),
    [bookmarks]
  );

  /* =========================================================
     Last read
     ========================================================= */
  const updateLastRead = useCallback(
    async (payload) => {
      const data = {
        surahNumber: payload.surahNumber,
        surahName: payload.surahName,
        ayahNumber: payload.ayahNumber,
        updatedAt: Date.now(),
      };
      setLastRead(data);

      if (isGuest) {
        setGuestLastRead(data);
      } else {
        try {
          await saveFirestoreLastRead(uid, data);
        } catch (err) {
          console.warn('[UserData] gagal simpan lastRead', err);
        }
      }
    },
    [isGuest, uid]
  );

  /* =========================================================
     Context value
     ========================================================= */
  const value = useMemo(
    () => ({
      bookmarks,
      lastRead,
      loading,
      isGuest,
      toggleBookmark,
      isBookmarked,
      updateLastRead,
      refresh: async () => {
        if (isGuest) {
          setBookmarks(getGuestBookmarks());
          setLastRead(getGuestLastRead());
        } else if (uid) {
          try {
            const [bm, lr] = await Promise.all([
              getBookmarks(uid),
              getFirestoreLastRead(uid),
            ]);
            setBookmarks(bm ?? []);
            setLastRead(lr ?? null);
          } catch (err) {
            console.warn('[UserData] refresh gagal:', err?.message);
          }
        }
      },
    }),
    [
      bookmarks,
      lastRead,
      loading,
      isGuest,
      toggleBookmark,
      isBookmarked,
      updateLastRead,
      uid,
    ]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx)
    throw new Error('useUserData harus dipakai di dalam <UserDataProvider>');
  return ctx;
}

export default UserDataContext;
