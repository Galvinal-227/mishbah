export default function Spinner({ size = 20, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      className={`inline-block rounded-full border-2 border-emerald-main border-t-transparent animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  );
}