/**
 * Wrapper tipis untuk react-icons agar style konsisten.
 * Tidak wajib, tapi berguna kalau nanti mau ganti icon set.
 */
export default function Icon({ as: IconCmp, className = '', size, ...rest }) {
  if (!IconCmp) return null;
  return <IconCmp className={className} size={size} {...rest} />;
}