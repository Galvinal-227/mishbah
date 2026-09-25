import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowDownOnSquare,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import { useReadingPrefs } from '../../contexts/ReadingPrefsContext';
import { cn } from '../../utils/cn';
import {
  ARABIC_SIZE_OPTIONS,
  ARABIC_FONT_OPTIONS,
} from '../../utils/readerStyles';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm transition-colors',
        'border border-line hover:border-emerald-main/40'
      )}
      aria-pressed={checked}
    >
      <span className="text-ink">{label}</span>
      <span
        className={cn(
          'relative inline-flex h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-emerald-main' : 'bg-line'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </span>
    </button>
  );
}

export default function ReaderToolbar() {
  const { prefs, update, toggle, reset } = useReadingPrefs();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (open) {
      gsap.fromTo(
        el,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2',
          'text-sm font-medium text-ink-muted hover:text-emerald-deep hover:border-emerald-main/40',
          'transition-colors'
        )}
      >
        <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">Pengaturan Baca</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[55] flex justify-end">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div
            ref={panelRef}
            className="relative z-10 w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <h3 className="font-display text-lg text-ink">Pengaturan Baca</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="btn-icon"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Ukuran Arab */}
              <div>
                <div className="label">Ukuran huruf Arab</div>
                <div className="grid grid-cols-4 gap-2">
                  {ARABIC_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => update({ arabicSize: opt.value })}
                      className={cn(
                        'rounded-lg border py-2 text-xs font-medium transition-colors',
                        prefs.arabicSize === opt.value
                          ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
                          : 'border-line text-ink-muted hover:border-emerald-main/40'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Arab */}
              <div>
                <div className="label">Jenis font Arab</div>
                <div className="grid grid-cols-2 gap-2">
                  {ARABIC_FONT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => update({ arabicFont: opt.value })}
                      className={cn(
                        'rounded-lg border py-2 text-sm transition-colors',
                        prefs.arabicFont === opt.value
                          ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
                          : 'border-line text-ink-muted hover:border-emerald-main/40'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tinggi baris Arab */}
              <div>
                <div className="label flex items-center justify-between">
                  <span>Tinggi baris teks Arab</span>
                  <span className="text-ink-pale text-xs">
                    {prefs.lineHeight.toFixed(1)}×
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-icon border border-line"
                    onClick={() =>
                      update({ lineHeight: Math.max(1.5, prefs.lineHeight - 0.1) })
                    }
                  >
                    <HiOutlineMinus className="h-4 w-4" />
                  </button>
                  <input
                    type="range"
                    min={1.5}
                    max={3.2}
                    step={0.1}
                    value={prefs.lineHeight}
                    onChange={(e) =>
                      update({ lineHeight: Number(e.target.value) })
                    }
                    className="flex-1 accent-emerald-main"
                  />
                  <button
                    className="btn-icon border border-line"
                    onClick={() =>
                      update({ lineHeight: Math.min(3.2, prefs.lineHeight + 0.1) })
                    }
                  >
                    <HiOutlinePlus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Ukuran Latin */}
              <div>
                <div className="label flex items-center justify-between">
                  <span>Ukuran teks Latin</span>
                  <span className="text-ink-pale text-xs">
                    {prefs.latinSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={22}
                  step={1}
                  value={prefs.latinSize}
                  onChange={(e) => update({ latinSize: Number(e.target.value) })}
                  className="w-full accent-emerald-main"
                />
              </div>

              {/* Ukuran terjemahan */}
              <div>
                <div className="label flex items-center justify-between">
                  <span>Ukuran terjemahan</span>
                  <span className="text-ink-pale text-xs">
                    {prefs.translationSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={22}
                  step={1}
                  value={prefs.translationSize}
                  onChange={(e) =>
                    update({ translationSize: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-main"
                />
              </div>

              {/* Toggles */}
              <div>
                <div className="label">Tampilan</div>
                <div className="space-y-2">
                  <Toggle
                    checked={prefs.showLatin}
                    onChange={() => toggle('showLatin')}
                    label="Tampilkan bacaan Latin"
                  />
                  <Toggle
                    checked={prefs.showTranslation}
                    onChange={() => toggle('showTranslation')}
                    label="Tampilkan terjemahan"
                  />
                  <Toggle
                    checked={prefs.showTafsir}
                    onChange={() => toggle('showTafsir')}
                    label="Tampilkan tafsir otomatis"
                  />
                  <Toggle
                    checked={prefs.autoScroll}
                    onChange={() => toggle('autoScroll')}
                    label="Auto-scroll saat audio diputar"
                  />
                </div>
              </div>

              {/* Reset */}
              <div className="pt-3 border-t border-line">
                <button
                  onClick={() => reset()}
                  className="btn-secondary w-full"
                >
                  Reset ke pengaturan awal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}