import { useMemo, useState, useEffect, useRef } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import { gsap } from 'gsap';
import { useSurahList } from '../hooks/useSurahList';
import { useDebounce } from '../hooks/useDebounce';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import SurahCard from '../components/quran/SurahCard';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

const FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: 'mekah', label: 'Makkiyah' },
  { id: 'madinah', label: 'Madaniyah' },
];

export default function Quran() {
  useDocumentTitle("Al-Qur'an");

  const { surahs, loading, error, reload } = useSurahList();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const debouncedSearch = useDebounce(search, 250);

  const listRef = useRef(null);

  const filtered = useMemo(() => {
    let list = surahs;

    if (filter !== 'all') {
      const target = filter === 'mekah' ? 'mekah' : 'madinah';
      list = list.filter((s) => {
        const t = (s.tempatTurun ?? s.tempat_turun ?? '').toLowerCase();
        return t.includes(target);
      });
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((s) => {
        const nama = (s.namaLatin ?? s.nama_latin ?? '').toLowerCase();
        const arti = (s.arti ?? '').toLowerCase();
        const arabic = (s.nama ?? '').toLowerCase();
        return (
          nama.includes(q) ||
          arti.includes(q) ||
          arabic.includes(q) ||
          String(s.nomor) === q
        );
      });
    }

    return list;
  }, [surahs, debouncedSearch, filter]);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-surah-item]');
    if (!items.length) return;
    gsap.fromTo(
      items,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, stagger: 0.015, ease: 'power2.out' }
    );
  }, [filtered.length, filter]);

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          Al-Qur'an
        </h1>
        <p className="mt-1 text-ink-muted text-sm">
          114 surah · 30 juz · Bacaan, terjemahan, dan audio
        </p>
      </div>

      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-pale" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari surah, arti, atau nomor…"
            className="input pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Bersihkan"
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-lg text-ink-pale hover:bg-emerald-soft/60 hover:text-emerald-deep"
            >
              <HiOutlineXMark className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                filter === f.id
                  ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
                  : 'border-line text-ink-muted hover:border-emerald-main/40'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!loading && !error && (
        <div className="mb-3 text-xs text-ink-pale">
          {filtered.length} surah ditemukan
          {debouncedSearch && ` untuk "${debouncedSearch}"`}
        </div>
      )}

      {loading && <SkeletonList count={8} />}

      {!loading && error && (
        <ErrorState
          title="Gagal memuat daftar surah"
          description={error}
          onRetry={reload}
        />
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={<HiOutlineMagnifyingGlass className="h-7 w-7" />}
          title="Tidak ada surah ditemukan"
          description="Coba kata kunci lain atau ubah filter."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div ref={listRef} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((s) => (
            <div key={s.nomor} data-surah-item>
              <SurahCard surah={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}