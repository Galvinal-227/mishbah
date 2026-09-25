import { HiOutlineExclamationTriangle, HiOutlineArrowPath } from 'react-icons/hi2';
import Button from './Button';

export default function ErrorState({
  title = 'Terjadi kesalahan',
  description = 'Gagal memuat data. Coba lagi.',
  onRetry,
  className,
}) {
  return (
    <div className={`flex flex-col items-center text-center py-14 px-6 ${className ?? ''}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <HiOutlineExclamationTriangle className="h-8 w-8" />
      </div>
      <h3 className="font-display text-xl text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted max-w-md mb-5">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} leftIcon={<HiOutlineArrowPath />}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}