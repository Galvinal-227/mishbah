import { useEffect, useMemo, useRef, useState } from 'react';
import {
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import SearchBar from '../components/search/SearchBar';
import {
  SurahResultItem,
  AyahResultItem,
  SectionHeader,
} from '../components/search/SearchResultItem';
import SearchEmpty from '../components/search/SearchEmpty';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useQuranSearch } from '../hooks/useQuranSearch';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SUGGESTIONS = ['Yasin', 'Rahman', 'Pembukaan', 'Ikhlas', 'Allah', 'Surga'];

export default function Search() {
  useDocumentTitle('Cari');

  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);
  const { surahResults, ayahResults, loading, error, hasQuery } =
    useQuranSearch(debounced);

  const resultRef = useRef(null);
  const total = surahResults.length + ayahResults.length;

  useEffect(() => {
    if (!resultRef.current || !total) return;
    const items = resultRef.current.querySelectorAll('[data-result-item]');
    if (!items.length) return;
    gsap.fromTo(
      items,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.02, ease: 'power2.out' }
    );
  }, [total, debounced]);

  const showSkeleton = loading && hasQuery && total === 0;
  const isEmpty = useMemo(
    () => hasQuery && !loading && total === 0,
    [hasQuery, loading, total]
  );

  return (
    <div className="container-page py-6 sm:py-10 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-1">
          Cari
        </h1>
        <p className="text-sm text-ink-muted">
          Cari surah atau ayat dalam Al-Qur'an. Bisa dengan bahasa Indonesia
          atau Arab.
        </p>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery('')}
        placeholder="Cari surah atau ayat…"
        big
        autoFocus
      />

      {!hasQuery && (
        <div className="mt-5">
          <div className="text-xs uppercase tracking-wide text-ink-pale font-semibold mb-2">
            Coba cari
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink-muted hover:border-emerald-main/40 hover:text-emerald-deep transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasQuery && !loading && total > 0 && (
        <div className="mt-5 text-xs text-ink-pale">
          {total} hasil untuk "{debounced}"
        </div>
      )}

      <div ref={resultRef} className="mt-5 space-y-8">
        {showSkeleton && <SkeletonList count={5} />}

        {error && !loading && (
          <ErrorState title="Gagal mencari" description={error} />
        )}

        {isEmpty && !error && <SearchEmpty query={debounced} />}

        {!loading && surahResults.length > 0 && (
          <section>
            <SectionHeader
              icon={<HiOutlineBookOpen className="h-3.5 w-3.5" />}
              title="Surah"
              count={surahResults.length}
            />
            <div className="space-y-2">
              {surahResults.map((s) => (
                <div key={s.nomor} data-result-item>
                  <SurahResultItem surah={s} query={debounced} />
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && ayahResults.length > 0 && (
          <section>
            <SectionHeader
              icon={<HiOutlineDocumentText className="h-3.5 w-3.5" />}
              title="Ayat"
              count={ayahResults.length}
            />
            <div className="space-y-3">
              {ayahResults.map((r) => (
                <div
                  key={`${r.surahNumber}:${r.ayahNumber}`}
                  data-result-item
                >
                  <AyahResultItem result={r} query={debounced} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-pale text-center">
              <HiOutlineMagnifyingGlass className="inline h-3 w-3 mr-1" />
              Pencarian ayat terbatas pada 30 surah pertama untuk menjaga
              performa.
            </p>
          </section>
        )}
      </div>

      <div className="h-24" />
    </div>
  );
}