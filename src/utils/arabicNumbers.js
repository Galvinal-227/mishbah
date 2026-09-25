const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Konversi angka biasa ke angka Arab.
 * toArabicNumber(25) → "٢٥"
 */
export function toArabicNumber(num) {
  if (num === null || num === undefined) return '';
  return String(num)
    .split('')
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join('');
}

/**
 * Bungkus angka Arab dengan kurung ornament Islami: ﴿٢٥﴾
 */
export function toArabicAyahMarker(num) {
  return `\uFD3F${toArabicNumber(num)}\uFD3E`;
}

export default toArabicNumber;