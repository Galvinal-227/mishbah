/**
 * Format detik → "HH:MM:SS" atau "MM:SS"
 * formatDuration(3720)   → "01:02:00"
 * formatDuration(125)    → "02:05"
 * formatDuration(0)      → "00:00"
 */
export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00:00';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

/**
 * Format detik → teks Indonesia "1 jam 24 menit 32 detik"
 */
export function formatDurationText(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return 'sekarang';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h) parts.push(`${h} jam`);
  if (m) parts.push(`${m} menit`);
  if (sec && !h) parts.push(`${sec} detik`);
  return parts.join(' ');
}

/**
 * Ubah "04:35" → { hours: 4, minutes: 35 }
 */
export function parseHHMM(str) {
  if (!str || typeof str !== 'string') return null;
  const [h, m] = str.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { hours: h, minutes: m };
}

/**
 * Buat Date object dari "04:35" pada tanggal tertentu (default: hari ini).
 */
export function timeStringToDate(timeStr, baseDate = new Date()) {
  const parsed = parseHHMM(timeStr);
  if (!parsed) return null;
  const d = new Date(baseDate);
  d.setHours(parsed.hours, parsed.minutes, 0, 0);
  return d;
}