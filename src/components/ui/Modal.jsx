import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import { gsap } from 'gsap';
import { cn } from '../../utils/cn';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md', // sm | md | lg | xl
  closeOnOverlay = true,
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (!open) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    ).fromTo(
      panelRef.current,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' },
      '-=0.1'
    );

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        className={cn(
          'w-full rounded-2xl bg-white shadow-card border border-line',
          'max-h-[90vh] flex flex-col',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 p-5 border-b border-line">
            <div>
              {title && (
                <h3 className="font-display text-lg text-ink">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-ink-muted mt-0.5">{description}</p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="btn-icon shrink-0"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto p-5">{children}</div>

        {footer && (
          <div className="p-5 border-t border-line bg-line-soft/40 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}