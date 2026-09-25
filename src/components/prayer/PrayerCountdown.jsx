import { useCountdown } from '../../hooks/useCountdown';
import { formatDurationText } from '../../utils/timeFormat';

export default function PrayerCountdown({ prayerLabel, timeString }) {
  const { text, seconds } = useCountdown(timeString);

  return (
    <div className="text-right">
      <div className="text-xs text-white/70">{prayerLabel}</div>
      <div className="text-2xl font-display font-semibold text-white tabular-nums leading-none mt-0.5">
        {timeString}
      </div>
      <div className="text-[11px] text-white/70 mt-1">
        {text} lagi
      </div>
      {seconds <= 0 && (
        <div className="text-[11px] text-gold mt-0.5">Sudah masuk waktu</div>
      )}
      <span className="sr-only">
        {formatDurationText(seconds)} menuju {prayerLabel}
      </span>
    </div>
  );
}