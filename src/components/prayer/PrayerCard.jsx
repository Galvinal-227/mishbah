import { useMemo } from 'react';
import {
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlineMoon,
} from 'react-icons/hi2';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PRAYER_KEYS, MAIN_PRAYERS } from '../../config/constants';
import { timeStringToDate } from '../../utils/timeFormat';
import { formatFullDate } from '../../utils/dateFormat';
import PrayerCountdown from './PrayerCountdown';
import { cn } from '../../utils/cn';

/**
 * Cari sholat berikutnya dari daftar MAIN_PRAYERS berdasarkan waktu sekarang.
 */
function findNextPrayer(todaySchedule) {
  if (!todaySchedule) return null;
  const now = new Date();

  const candidates = MAIN_PRAYERS.map((key) => {
    const label = PRAYER_KEYS.find((p) => p.key === key)?.label ?? key;
    const timeStr = todaySchedule[key];
    const date = timeStringToDate(timeStr, now);
    return { key, label, timeStr, date };
  }).filter((c) => c.date);

  const future = candidates.find((c) => c.date.getTime() > now.getTime());
  return future ?? candidates[0]; // kalau semua sudah lewat, fallback ke subuh
}

export default function PrayerCard({
  location,
  todaySchedule,
  onPickLocation,
  onPlayAdzan,
  onPlayTarhim,
}) {
  const next = useMemo(() => findNextPrayer(todaySchedule), [todaySchedule]);

  return (
    <Card className="overflow-hidden" padded={false}>
      {/* Header hijau */}
      <div className="bg-gradient-to-br from-emerald-deep to-emerald-main text-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-white/70 mb-1">
              Jadwal Sholat Hari Ini
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <HiOutlineMapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {location?.kabkota ?? 'Pilih lokasi'}
              </span>
              {location?.provinsi && (
                <span className="text-white/60 truncate">
                  · {location.provinsi}
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/60 mt-0.5">
              {formatFullDate()}
            </div>
          </div>

          <button
            onClick={onPickLocation}
            className="shrink-0 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Ubah
          </button>
        </div>

        {next && (
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs text-white/70">Sholat berikutnya</div>
              <div className="font-display text-2xl font-semibold">
                {next.label}
              </div>
            </div>
            <PrayerCountdown
              prayerLabel="Menuju"
              timeString={next.timeStr}
            />
          </div>
        )}
      </div>

      {/* Grid waktu sholat */}
      {todaySchedule ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-line">
          {PRAYER_KEYS.map(({ key, label }) => {
            const isNext = next?.key === key;
            const isMain = MAIN_PRAYERS.includes(key);
            return (
              <div
                key={key}
                className={cn(
                  'p-3 text-center',
                  isNext && 'bg-emerald-soft/40'
                )}
              >
                <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-ink-pale mb-1">
                  {!isMain && <span className="opacity-50">◦</span>}
                  {label}
                </div>
                <div
                  className={cn(
                    'text-sm font-semibold tabular-nums',
                    isNext ? 'text-emerald-deep' : 'text-ink'
                  )}
                >
                  {todaySchedule[key] ?? '--:--'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center text-sm text-ink-muted">
          Pilih lokasi untuk melihat jadwal sholat.
        </div>
      )}

      {/* Actions audio adzan & tarhim */}
      <div className="border-t border-line p-3 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<HiOutlinePlay />}
          onClick={onPlayAdzan}
          className="flex-1"
        >
          Putar Adzan
        </Button>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<HiOutlineMoon />}
          onClick={onPlayTarhim}
          className="flex-1"
        >
          Putar Tarhim
        </Button>
      </div>
    </Card>
  );
}