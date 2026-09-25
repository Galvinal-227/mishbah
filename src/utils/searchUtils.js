/**
 * Normalisasi teks untuk pencarian yang toleran:
 * - Huruf Arab → hilangkan harakat & tanda baca
 * - Huruf Latin → lowercase, hilangkan diakritik
 * - Angka → tetap
 * - Spasi → rapatkan
 */

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const ARABIC_TATWEEL = /\u0640/g;
const NON_ALNUM = /[^\p{L}\p{N}\s]/gu;

export function normalizeArabic(str) {
  if (!str) return '';
  return String(str)
    .replace(ARABIC_DIACRITICS, '')
    .replace(ARABIC_TATWEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function normalizeLatin(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(NON_ALNUM, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deteksi apakah query mengandung karakter Arab.
 */
export function isArabicQuery(str) {
  return /[\u0600-\u06FF]/.test(str || '');
}

/**
 * Highlight kata kunci dalam teks (mengembalikan array part).
 * parts = [{ text, match: boolean }]
 */
export function highlightMatches(text, query) {
  if (!text || !query) return [{ text: text ?? '', match: false }];
  const normText = normalizeLatin(text);
  const normQuery = normalizeLatin(query);
  if (!normQuery) return [{ text, match: false }];

  const idx = normText.indexOf(normQuery);
  if (idx === -1) return [{ text, match: false }];

  // Karena normalisasi bisa mengubah panjang, kita fallback ke pencarian case-insensitive biasa
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const start = lower.indexOf(q);

  if (start === -1) return [{ text, match: false }];

  return [
    { text: text.slice(0, start), match: false },
    { text: text.slice(start, start + query.length), match: true },
    { text: text.slice(start + query.length), match: false },
  ].filter((p) => p.text);
}