/**
 * Map preferensi baca → className untuk teks Arab, Latin, terjemahan.
 * Dipakai oleh AyahCard & ReaderToolbar.
 */

const ARABIC_SIZE_MAP = {
  sm: 'text-arabic-sm',
  base: 'text-arabic-base',
  lg: 'text-arabic-lg',
  xl: 'text-arabic-xl',
};

const ARABIC_FONT_MAP = {
  arabic: 'font-arabic',
  arabicAlt: 'font-arabicAlt',
};

export function getArabicClass({ arabicSize, arabicFont, lineHeight }) {
  return [
    ARABIC_SIZE_MAP[arabicSize] ?? 'text-arabic-base',
    ARABIC_FONT_MAP[arabicFont] ?? 'font-arabic',
    'text-ink',
  ].join(' ');
}

export function getLatinStyle({ latinSize, lineHeight }) {
  return {
    fontSize: `${latinSize ?? 15}px`,
    lineHeight: lineHeight ?? 1.7,
  };
}

export function getTranslationStyle({ translationSize, lineHeight }) {
  return {
    fontSize: `${translationSize ?? 15}px`,
    lineHeight: lineHeight ?? 1.75,
  };
}

export const ARABIC_SIZE_OPTIONS = [
  { value: 'sm', label: 'Kecil' },
  { value: 'base', label: 'Sedang' },
  { value: 'lg', label: 'Besar' },
  { value: 'xl', label: 'Ekstra' },
];

export const ARABIC_FONT_OPTIONS = [
  { value: 'arabic', label: 'Amiri Quran' },
  { value: 'arabicAlt', label: 'Scheherazade' },
];