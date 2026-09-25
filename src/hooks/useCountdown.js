import { useEffect, useState } from 'react';
import { timeStringToDate } from '../utils/timeFormat';

/**
 * Countdown ke waktu tertentu (string "HH:MM" hari ini).
 * Otomatis refresh tiap detik & re-evaluate saat lewat.
 *
 * useCountdown('17:42') → { seconds, text, targetDate, isPast }
 * Bila waktu sudah terlewat, otomatis mengarah ke besok.
 */
export function useCountdown(timeStr, { autoTomorrow = true } = {}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeStr) {
    return { seconds: 0, text: '--:--:--', targetDate: null, isPast: true };
  }

  let target = timeStringToDate(timeStr, now);
  if (!target) {
    return { seconds: 0, text: '--:--:--', targetDate: null, isPast: true };
  }

  if (target.getTime() <= now.getTime() && autoTomorrow) {
    target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
  }

  const diffMs = target.getTime() - now.getTime();
  const seconds = Math.max(0, Math.floor(diffMs / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');

  return {
    seconds,
    text: `${pad(h)}:${pad(m)}:${pad(s)}`,
    targetDate: target,
    isPast: diffMs <= 0,
  };
}

export default useCountdown;