const HARI = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/**
 * "Kamis, 1 Januari 2026"
 */
export function formatFullDate(date = new Date()) {
  const d = new Date(date);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * "1 Januari 2026"
 */
export function formatDate(date = new Date()) {
  const d = new Date(date);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * "Kamis"
 */
export function formatWeekday(date = new Date()) {
  return HARI[new Date(date).getDay()];
}

/**
 * "Januari"
 */
export function formatMonthName(monthIndex) {
  return BULAN[monthIndex] ?? '';
}

/**
 * ISO date "2026-01-01" untuk hari ini (lokal timezone).
 */
export function todayISO(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Waktu relatif "2 jam lalu", "3 hari lalu"
 */
export function formatRelative(date) {
  if (!date) return '';
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return formatDate(d);
}

export { HARI, BULAN };