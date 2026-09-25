import { useState } from 'react';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineSpeakerWave,
  HiOutlineMapPin,
  HiOutlineArrowPath,
  HiOutlinePlay,
} from 'react-icons/hi2';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useReadingPrefs } from '../contexts/ReadingPrefsContext';
import { useAudio } from '../contexts/AudioContext';
import { useLocationCtx } from '../contexts/LocationContext';
import { useToast } from '../contexts/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import QariSelector from '../components/audio/QariSelector';
import LocationPicker from '../components/prayer/LocationPicker';
import {
  ARABIC_SIZE_OPTIONS,
  ARABIC_FONT_OPTIONS,
} from '../utils/readerStyles';
import { cn } from '../utils/cn';

function Row({ label, hint, children }) {
  return (
    <div className="py-3 border-b border-line last:border-b-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <div className="text-sm font-medium text-ink">{label}</div>
          {hint && <div className="text-xs text-ink-pale mt-0.5">{hint}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors',
        active
          ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
          : 'border-line text-ink-muted hover:border-emerald-main/40'
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'relative inline-flex h-5 w-9 rounded-full transition-colors',
          active ? 'bg-emerald-main' : 'bg-line'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            active ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </span>
    </button>
  );
}

export default function Settings() {
  useDocumentTitle('Pengaturan');

  const { prefs, update, toggle, reset } = useReadingPrefs();
  const audio = useAudio();
  const { location } = useLocationCtx();
  const toast = useToast();
  const [locOpen, setLocOpen] = useState(false);

  const handlePlayAdzan = () => {
    const a = new Audio('/audio/adzan.mp3');
    a.volume = 0.9;
    a.play().catch(() =>
      toast.error('File adzan.mp3 belum tersedia di /public/audio/')
    );
    toast.info('Memutar adzan');
  };

  const handlePlayTarhim = () => {
    const a = new Audio('/audio/tarhim.mp3');
    a.volume = 0.9;
    a.play().catch(() =>
      toast.error('File tarhim.mp3 belum tersedia di /public/audio/')
    );
    toast.info('Memutar tarhim');
  };

  return (
    <div className="container-page py-6 sm:py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">
        Pengaturan
      </h1>
      <p className="text-sm text-ink-muted mb-6">
        Sesuaikan tampilan bacaan, audio, dan lokasi Anda.
      </p>

      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineAdjustmentsHorizontal className="h-5 w-5 text-emerald-main" />
          <h2 className="font-display text-lg text-ink">Preferensi Bacaan</h2>
        </div>

        <Row label="Ukuran huruf Arab">
          <div className="grid grid-cols-4 gap-2">
            {ARABIC_SIZE_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => update({ arabicSize: o.value })}
                className={cn(
                  'rounded-lg border py-2 text-xs font-medium transition-colors',
                  prefs.arabicSize === o.value
                    ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
                    : 'border-line text-ink-muted hover:border-emerald-main/40'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>

        <Row label="Font Arab">
          <div className="grid grid-cols-2 gap-2">
            {ARABIC_FONT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => update({ arabicFont: o.value })}
                className={cn(
                  'rounded-lg border py-2 text-sm transition-colors',
                  prefs.arabicFont === o.value
                    ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
                    : 'border-line text-ink-muted hover:border-emerald-main/40'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>

        <Row label="Tinggi baris Arab" hint={`${prefs.lineHeight.toFixed(1)}×`}>
          <input
            type="range"
            min={1.5}
            max={3.2}
            step={0.1}
            value={prefs.lineHeight}
            onChange={(e) => update({ lineHeight: Number(e.target.value) })}
            className="w-full accent-emerald-main"
          />
        </Row>

        <Row label="Ukuran Latin" hint={`${prefs.latinSize}px`}>
          <input
            type="range"
            min={12}
            max={22}
            step={1}
            value={prefs.latinSize}
            onChange={(e) => update({ latinSize: Number(e.target.value) })}
            className="w-full accent-emerald-main"
          />
        </Row>

        <Row label="Ukuran terjemahan" hint={`${prefs.translationSize}px`}>
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
        </Row>

        <Row label="Tampilan">
          <div className="grid sm:grid-cols-2 gap-2">
            <ToggleBtn
              active={prefs.showLatin}
              onClick={() => toggle('showLatin')}
              label="Bacaan Latin"
            />
            <ToggleBtn
              active={prefs.showTranslation}
              onClick={() => toggle('showTranslation')}
              label="Terjemahan"
            />
            <ToggleBtn
              active={prefs.showTafsir}
              onClick={() => toggle('showTafsir')}
              label="Tafsir otomatis"
            />
            <ToggleBtn
              active={prefs.autoScroll}
              onClick={() => toggle('autoScroll')}
              label="Auto-scroll audio"
            />
          </div>
        </Row>

        <div className="pt-4">
          <Button
            variant="secondary"
            onClick={reset}
            leftIcon={<HiOutlineArrowPath />}
          >
            Reset preferensi
          </Button>
        </div>
      </Card>

      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineSpeakerWave className="h-5 w-5 text-emerald-main" />
          <h2 className="font-display text-lg text-ink">Audio</h2>
        </div>

        <Row label="Qari default">
          <QariSelector
            value={audio.prefs.qariId}
            onChange={audio.setQari}
            variant="compact"
          />
        </Row>

        <Row label="Kecepatan putar">
          <div className="flex flex-wrap gap-1.5">
            {[0.75, 1, 1.25, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => audio.setPlaybackRate(s)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  audio.prefs.playbackRate === s
                    ? 'bg-emerald-main text-white'
                    : 'bg-line-soft text-ink-muted hover:bg-emerald-soft'
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        </Row>

        <Row label="Volume" hint={`${Math.round(audio.prefs.volume * 100)}%`}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={audio.prefs.volume}
            onChange={(e) => audio.setVolume(Number(e.target.value))}
            className="w-full accent-emerald-main"
          />
        </Row>

        <Row
          label="Audio adzan & tarhim"
          hint="Diputar manual, bukan alarm otomatis"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HiOutlinePlay />}
              onClick={handlePlayAdzan}
            >
              Putar Adzan
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HiOutlinePlay />}
              onClick={handlePlayTarhim}
            >
              Putar Tarhim
            </Button>
          </div>
        </Row>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineMapPin className="h-5 w-5 text-emerald-main" />
          <h2 className="font-display text-lg text-ink">Lokasi</h2>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink truncate">
              {location?.kabkota ?? 'Belum dipilih'}
            </div>
            <div className="text-xs text-ink-pale truncate">
              {location?.provinsi ?? 'Pilih lokasi untuk jadwal sholat'}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setLocOpen(true)}>
            Ubah
          </Button>
        </div>
      </Card>

      <LocationPicker open={locOpen} onClose={() => setLocOpen(false)} />
    </div>
  );
}