import { memo, useEffect, useRef } from 'react';
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineBookmark,
  HiOutlineShare,
} from 'react-icons/hi2';
import { cn } from '../../utils/cn';
import { toArabicNumber } from '../../utils/arabicNumbers';
import {
  getArabicClass,
  getLatinStyle,
  getTranslationStyle,
} from '../../utils/readerStyles';
import TafsirPanel from './TafsirPanel';

function AyahCard({
  ayah,
  surahNumber,
  surahName,
  playlist,
  isPlaying = false,
  isCurrent = false,
  isBookmarked = false,
  tafsir = null,
  prefs,
  onPlay,
  onBookmark,
  onShare,
}) {
  const cardRef = useRef(null);

  // Highlight + auto-scroll saat ayat ini sedang diputar
  useEffect(() => {
    if (!isCurrent) return;
    const el = cardRef.current;
    if (!el) return;
    if (prefs?.autoScroll) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrent, prefs?.autoScroll]);

  const arabicClass = getArabicClass(prefs);
  const latinStyle = getLatinStyle(prefs);
  const translationStyle = getTranslationStyle(prefs);

  const handleShare = async () => {
    const text = `${ayah.teksArab}\n\n${ayah.teksIndonesia}\n\n(QS. ${surahName}: ${ayah.nomorAyat})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surahName} : ${ayah.nomorAyat}`,
          text,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    onShare?.(text);
  };

  return (
    <article
      ref={cardRef}
      id={`ayah-${ayah.nomorAyat}`}
      className={cn(
        'card p-5 sm:p-6 transition-all duration-300 scroll-mt-24',
        isCurrent &&
          'ring-2 ring-emerald-main/40 shadow-card border-emerald-main/30'
      )}
    >
      {/* Header: nomor + aksi */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'grid h-9 w-9 place-items-center rounded-lg font-display text-sm font-semibold',
              isCurrent
                ? 'bg-emerald-main text-white'
                : 'bg-emerald-soft text-emerald-deep'
            )}
          >
            {ayah.nomorAyat}
          </div>
          <div className="text-xs text-ink-pale">
            Ayat {ayah.nomorAyat}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPlay?.(ayah)}
            aria-label={isCurrent && isPlaying ? 'Jeda' : 'Putar ayat'}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-lg transition-colors',
              isCurrent && isPlaying
                ? 'bg-emerald-main text-white'
                : 'text-ink-muted hover:bg-emerald-soft/60 hover:text-emerald-deep'
            )}
          >
            {isCurrent && isPlaying ? (
              <HiOutlinePause className="h-4 w-4" />
            ) : (
              <HiOutlinePlay className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onBookmark?.(ayah)}
            aria-label={isBookmarked ? 'Hapus bookmark' : 'Tandai ayat'}
            aria-pressed={isBookmarked}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-lg transition-colors',
              isBookmarked
                ? 'bg-gold/15 text-gold-dark'
                : 'text-ink-muted hover:bg-emerald-soft/60 hover:text-emerald-deep'
            )}
          >
            <HiOutlineBookmark
              className={cn('h-4 w-4', isBookmarked && 'fill-current')}
            />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Bagikan ayat"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-emerald-soft/60 hover:text-emerald-deep transition-colors"
          >
            <HiOutlineShare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Teks Arab */}
      <div className="text-right mb-5">
        <p className={cn(arabicClass, 'leading-loose')} dir="rtl" lang="ar">
          {ayah.teksArab}{' '}
          <span className="text-emerald-main font-arabic">
            ﴿{toArabicNumber(ayah.nomorAyat)}﴾
          </span>
        </p>
      </div>

      {/* Latin */}
      {prefs.showLatin && ayah.teksLatin && (
        <p
          className="mb-4 text-ink-muted italic"
          style={latinStyle}
        >
          {ayah.teksLatin}
        </p>
      )}

      {/* Terjemahan */}
      {prefs.showTranslation && ayah.teksIndonesia && (
        <p className="text-ink-soft" style={translationStyle}>
          {ayah.teksIndonesia}
        </p>
      )}

      {/* Tafsir */}
      {prefs.showTafsir && <TafsirPanel tafsir={tafsir} />}
      {!prefs.showTafsir && tafsir && (
        <TafsirPanel tafsir={tafsir} />
      )}
    </article>
  );
}

export default memo(AyahCard);