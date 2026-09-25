import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineBackward,
  HiOutlineForward,
  HiOutlineSpeakerWave,
  HiOutlineSpeakerXMark,
  HiOutlineArrowPath,
  HiOutlineArrowsRightLeft,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineCog6Tooth,
  HiXMark,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import { useAudio } from '../../contexts/AudioContext';
import { formatDuration } from '../../utils/timeFormat';
import AudioProgressBar from './AudioProgressBar';
import QariSelector from './QariSelector';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayer() {
  const {
    current,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    prefs,
    toggle,
    next,
    prev,
    seek,
    stop,
    setQari,
    setVolume,
    setPlaybackRate,
    cycleRepeat,
    toggleShuffle,
  } = useAudio();

  const wrapRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [prevTrackKey, setPrevTrackKey] = useState(null);

  // Animasi masuk / keluar saat ada track
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (current) {
      gsap.fromTo(
        el,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!current]);

  // Track key berubah = reset expanded
  useEffect(() => {
    const key = current ? `${current.surahNumber}:${current.ayahNumber}` : null;
    if (key !== prevTrackKey) setPrevTrackKey(key);
  }, [current, prevTrackKey]);

  if (!current) return null;

  const repeatIconClass = cn(
    'h-4 w-4',
    prefs.repeat !== 'off' && 'text-emerald-main'
  );

  const shuffleClass = cn(
    'h-4 w-4',
    prefs.shuffle ? 'text-emerald-main' : 'text-ink-muted'
  );

  return (
    <div
      ref={wrapRef}
      className="fixed inset-x-0 bottom-0 z-50 md:bottom-4 md:left-4 md:right-4 md:mx-auto md:max-w-4xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto rounded-t-2xl md:rounded-2xl border border-line bg-white/95 backdrop-blur-md shadow-card overflow-hidden">
        {/* Bar utama */}
        <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          {/* Info track */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-56">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-main to-emerald-deep text-white text-sm font-semibold">
              {current.ayahNumber}
            </div>
            <div className="min-w-0">
              <Link
                to={`/quran/${current.surahNumber}`}
                className="block truncate text-sm font-semibold text-ink hover:text-emerald-deep"
                title={`${current.surahName} : ${current.ayahNumber}`}
              >
                {current.surahName} : {current.ayahNumber}
              </Link>
              <div className="truncate text-[11px] text-ink-pale">
                {current.qariName}
              </div>
            </div>
          </div>

          {/* Progress (desktop in-line) */}
          <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
            <span className="text-[11px] tabular-nums text-ink-pale w-10 text-right">
              {formatDuration(currentTime)}
            </span>
            <AudioProgressBar
              current={currentTime}
              duration={duration}
              onSeek={seek}
              className="flex-1"
            />
            <span className="text-[11px] tabular-nums text-ink-pale w-10">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Kontrol */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleShuffle}
              aria-label="Acak"
              className="btn-icon hidden sm:inline-flex"
            >
              <HiOutlineArrowsRightLeft className={shuffleClass} />
            </button>

            <button
              onClick={prev}
              aria-label="Ayat sebelumnya"
              className="btn-icon"
            >
              <HiOutlineBackward className="h-5 w-5" />
            </button>

            <button
              onClick={toggle}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-full text-white shadow-soft transition-transform active:scale-95',
                'bg-gradient-to-br from-emerald-main to-emerald-deep'
              )}
            >
              {isLoading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : isPlaying ? (
                <HiOutlinePause className="h-6 w-6" />
              ) : (
                <HiOutlinePlay className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={next}
              aria-label="Ayat berikutnya"
              className="btn-icon"
            >
              <HiOutlineForward className="h-5 w-5" />
            </button>

            <button
              onClick={cycleRepeat}
              aria-label="Ulangi"
              className="btn-icon hidden sm:inline-flex"
              title={
                prefs.repeat === 'off'
                  ? 'Ulangi: mati'
                  : prefs.repeat === 'one'
                  ? 'Ulangi: satu ayat'
                  : 'Ulangi: seluruh'
              }
            >
              <HiOutlineArrowPath className={repeatIconClass} />
            </button>

            <button
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? 'Sembunyikan pengaturan' : 'Pengaturan pemutar'}
              className="btn-icon hidden md:inline-flex"
            >
              {expanded ? (
                <HiOutlineChevronDown className="h-4 w-4" />
              ) : (
                <HiOutlineCog6Tooth className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => setExpanded((v) => !v)}
              aria-label="Perluas"
              className="btn-icon md:hidden"
            >
              <HiOutlineChevronUp
                className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
              />
            </button>

            <button
              onClick={stop}
              aria-label="Tutup pemutar"
              className="btn-icon hidden sm:inline-flex"
            >
              <HiXMark className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress mobile (baris kedua) */}
        <div className="flex md:hidden items-center gap-2 px-3 pb-2">
          <span className="text-[10px] tabular-nums text-ink-pale w-9 text-right">
            {formatDuration(currentTime)}
          </span>
          <AudioProgressBar
            current={currentTime}
            duration={duration}
            onSeek={seek}
            className="flex-1"
          />
          <span className="text-[10px] tabular-nums text-ink-pale w-9">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Panel pengaturan (expand) */}
        {expanded && (
          <div className="border-t border-line bg-line-soft/40 px-4 py-3 space-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-pale mb-1.5">
                Qari
              </div>
              <QariSelector value={prefs.qariId} onChange={setQari} variant="compact" />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVolume(prefs.volume > 0 ? 0 : 0.9)}
                  className="btn-icon"
                  aria-label="Bisukan"
                >
                  {prefs.volume > 0 ? (
                    <HiOutlineSpeakerWave className="h-4 w-4" />
                  ) : (
                    <HiOutlineSpeakerXMark className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={prefs.volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 accent-emerald-main"
                  aria-label="Volume"
                />
              </div>

              {/* Kecepatan */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-ink-pale">Kecepatan</span>
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackRate(s)}
                    className={cn(
                      'rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors',
                      prefs.playbackRate === s
                        ? 'bg-emerald-main text-white'
                        : 'bg-white border border-line text-ink-muted hover:border-emerald-main/40'
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}