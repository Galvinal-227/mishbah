import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBookOpen,
  HiOutlineBookmark,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import { useDebounce } from '../../hooks/useDebounce';
import { useSurahList } from '../../hooks/useSurahList';
import { normalizeLatin } from '../../utils/searchUtils';
import { cn } from '../../utils/cn';

const PAGES = [
  { to: '/', label: 'Beranda', icon: HiOutlineHome },
  { to: '/quran', label: "Al-Qur'an", icon: HiOutlineBookOpen },
  { to: '/search', label: 'Cari', icon: HiOutlineMagnifyingGlass },
  { to: '/bookmarks', label: 'Bookmark', icon: HiOutlineBookmark },
  { to: '/last-read', label: 'Terakhir Dibaca', icon: HiOutlineClock },
  { to: '/settings', label: 'Pengaturan', icon: HiOutlineCog6Tooth },
];

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const { surahs } = useSurahList();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 150);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 }
    ).fromTo(
      panelRef.current,
      { opacity: 0, y: -12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' },
      '-=0.1'
    );
    return () => tl.kill();
  }, [open]);

  if (!open) return null;

  /* Filter */
  const q = debounced.trim().toLowerCase();
  const normQ = normalizeLatin(q);

  const matchedSurahs = q
    ? surahs
        .filter((s) => {
          const nama = normalizeLatin(s.namaLatin ?? s.nama_latin ?? '');
          const arti = normalizeLatin(s.arti ?? '');
          const arabic = normalizeLatin(s.nama ?? '');
          return (
            nama.includes(normQ) ||
            arti.includes(normQ) ||
            arabic.includes(normQ) ||
            String(s.nomor) === q
          );
        })
        .slice(0, 6)
    : [];

  const matchedPages = q
    ? PAGES.filter((p) => normalizeLatin(p.label).includes(normQ))
    : PAGES;

  const handleNavigate = (to) => {
    onClose?.();
    navigate(to);
  };

  const totalResults = matchedSurahs.length + matchedPages.length;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[10vh] px-4 bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="w-full max-w-xl rounded-2xl border border-line bg-white shadow-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <HiOutlineMagnifyingGlass className="h-5 w-5 text-ink-pale shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari surah atau navigasi…"
            className="w-full py-4 text-base bg-transparent focus:outline-none placeholder:text-ink-pale"
          />
          <kbd className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-md border border-line bg-line-soft px-1.5 py-0.5 text-[10px] text-ink-pale">
            ESC
          </kbd>
        </div>

        {/* Hasil */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {totalResults === 0 && (
            <div className="py-10 text-center text-sm text-ink-muted">
              Tidak ada hasil untuk "{query}"
            </div>
          )}

          {matchedSurahs.length > 0 && (
            <>
              <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-ink-pale font-semibold">
                Surah
              </div>
              {matchedSurahs.map((s) => (
                <button
                  key={s.nomor}
                  onClick={() => handleNavigate(`/quran/${s.nomor}`)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-emerald-soft/60 transition-colors"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-soft text-emerald-deep text-xs font-semibold">
                    {s.nomor}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">
                      {s.namaLatin ?? s.nama_latin}
                    </span>
                    <span className="block text-xs text-ink-pale truncate">
                      {s.arti} · {s.jumlahAyat ?? s.jumlah_ayat} ayat
                    </span>
                  </span>
                  <span className="font-arabic text-lg text-emerald-deep shrink-0">
                    {s.nama}
                  </span>
                </button>
              ))}
            </>
          )}

          {matchedPages.length > 0 && (
            <>
              <div className="px-3 py-2 mt-1 text-[11px] uppercase tracking-wide text-ink-pale font-semibold">
                Navigasi
              </div>
              {matchedPages.map(({ to, label, icon: IconCmp }) => (
                <button
                  key={to}
                  onClick={() => handleNavigate(to)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left',
                    'hover:bg-emerald-soft/60 transition-colors'
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-line-soft text-ink-muted">
                    <IconCmp className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm text-ink">{label}</span>
                  <HiOutlineArrowRight className="h-4 w-4 text-ink-pale" />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line px-4 py-2 flex items-center justify-between text-[11px] text-ink-pale">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-line bg-line-soft px-1.5 py-0.5">↵</kbd>
              Buka
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-line bg-line-soft px-1.5 py-0.5">Esc</kbd>
              Tutup
            </span>
          </div>
          <span>Command Palette</span>
        </div>
      </div>
    </div>,
    document.body
  );
}