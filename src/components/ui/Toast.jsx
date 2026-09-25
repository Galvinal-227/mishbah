import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXMark,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import { cn } from '../../utils/cn';

const TYPES = {
  success: {
    icon: HiCheckCircle,
    wrap: 'bg-white border-emerald-main/20',
    iconColor: 'text-emerald-main',
  },
  error: {
    icon: HiExclamationCircle,
    wrap: 'bg-white border-red-300',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: HiExclamationCircle,
    wrap: 'bg-white border-gold/40',
    iconColor: 'text-gold-dark',
  },
  info: {
    icon: HiInformationCircle,
    wrap: 'bg-white border-line',
    iconColor: 'text-emerald-muted',
  },
};

function ToastItem({ toast, onClose }) {
  const ref = useRef(null);
  const conf = TYPES[toast.type] ?? TYPES.info;
  const IconCmp = conf.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { opacity: 0, y: -12, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' }
    );
    return () => tl.kill();
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      className={cn(
        'pointer-events-auto flex items-start gap-3 w-[min(92vw,380px)]',
        'rounded-xl border shadow-card p-3.5',
        conf.wrap
      )}
    >
      <IconCmp className={cn('h-5 w-5 shrink-0 mt-0.5', conf.iconColor)} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="text-sm font-semibold text-ink">{toast.title}</div>
        )}
        {toast.message && (
          <div className="text-sm text-ink-muted break-words">{toast.message}</div>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        aria-label="Tutup notifikasi"
        className="shrink-0 text-ink-pale hover:text-ink transition-colors"
      >
        <HiXMark className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastViewport({ toasts, onClose }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none max-w-full">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
}