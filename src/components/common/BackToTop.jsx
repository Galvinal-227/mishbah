import { useEffect, useState } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas"
      className={cn(
        'fixed right-4 bottom-28 md:bottom-24 z-40',
        'grid h-11 w-11 place-items-center rounded-full',
        'bg-emerald-deep text-white shadow-card',
        'hover:bg-emerald-main active:scale-95 transition-all',
        'animate-fade-in'
      )}
    >
      <HiOutlineArrowUp className="h-5 w-5" />
    </button>
  );
}