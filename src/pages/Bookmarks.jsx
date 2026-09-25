import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBookmark,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { useUserData } from '../contexts/UserDataContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../utils/cn';
import { formatRelative } from '../utils/dateFormat';

export default function Bookmarks() {
  useDocumentTitle('Bookmark');

  const { bookmarks, toggleBookmark, isGuest } = useUserData();
  const toast = useToast();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const list = bookmarks ?? [];
    const query = q.trim().toLowerCase();
    const sorted = [...list].sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));
    if (!query) return sorted;
    return sorted.filter(
      (b) =>
        (b.surahName ?? '').toLowerCase().includes(query) ||
        (b.teksIndonesia ?? '').toLowerCase().includes(query) ||
        String(b.surahNumber) === query ||
        String(b.ayahNumber) === query
    );
  }, [bookmarks, q]);

  const handleRemove = async (b) => {
    try {
      await toggleBookmark({
        surahNumber: b.surahNumber,
        surahName: b.surahName,
        ayahNumber: b.ayahNumber,
        teksArab: b.teksArab,
        teksIndonesia: b.teksIndonesia,
      });
      toast.success('Bookmark dihapus');
    } catch {
      toast.error('Gagal menghapus bookmark');
    }
  };

  return (
    <div className="container-page py-6 sm:py-10 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">
          Bookmark
        </h1>
        <p className="text-sm text-ink-muted">
          {isGuest
            ? 'Ayat tersimpan di perangkat ini. Login untuk sinkronisasi.'
            : 'Ayat tersimpan tersinkron ke akun Anda.'}
        </p>
      </div>

      {bookmarks?.length > 0 && (
        <div className="relative mb-5">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Cari bookmark…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      )}

      {!bookmarks || bookmarks.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineBookmark className="h-7 w-7" />}
            title="Belum ada bookmark"
            description="Mulai simpan ayat yang ingin kamu baca kembali. Klik ikon bookmark di setiap ayat."
            action={
              <Button as={Link} to="/quran" size="sm">
                Buka Al-Qur'an
              </Button>
            }
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineMagnifyingGlass className="h-7 w-7" />}
            title="Tidak ditemukan"
            description="Coba kata kunci lain."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const key = `${b.surahNumber}:${b.ayahNumber}`;
            return (
              <Card key={key} hover className="group">
                <div className="flex items-start gap-4">
                  <Link
                    to={`/quran/${b.surahNumber}#ayah-${b.ayahNumber}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-emerald">
                        QS. {b.surahName} : {b.ayahNumber}
                      </span>
                      {b.createdAt && (
                        <span className="text-xs text-ink-pale">
                          {formatRelative(toDate(b.createdAt))}
                        </span>
                      )}
                    </div>
                    {b.teksArab && (
                      <p
                        className="font-arabic text-lg text-emerald-deep leading-loose text-right line-clamp-2"
                        dir="rtl"
                      >
                        {b.teksArab}
                      </p>
                    )}
                    {b.teksIndonesia && (
                      <p className="text-sm text-ink-soft mt-1 line-clamp-2">
                        {b.teksIndonesia}
                      </p>
                    )}
                  </Link>

                  <button
                    onClick={() => handleRemove(b)}
                    aria-label="Hapus bookmark"
                    className={cn(
                      'shrink-0 grid h-9 w-9 place-items-center rounded-lg',
                      'text-ink-pale hover:text-red-500 hover:bg-red-50',
                      'transition-colors sm:opacity-0 sm:group-hover:opacity-100'
                    )}
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function toTime(v) {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  if (v?.toDate) return v.toDate().getTime();
  if (typeof v === 'string') return new Date(v).getTime();
  return 0;
}

function toDate(v) {
  if (!v) return null;
  if (typeof v === 'number') return new Date(v);
  if (v?.toDate) return v.toDate();
  if (typeof v === 'string') return new Date(v);
  return null;
}