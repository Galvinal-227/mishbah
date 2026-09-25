import { useRef, useState, useEffect } from 'react';
import { HiOutlineChevronDown, HiOutlineBookOpen } from 'react-icons/hi2';
import { gsap } from 'gsap';
import { cn } from '../../utils/cn';

export default function TafsirPanel({ tafsir }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const chevronRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    const chevron = chevronRef.current;
    if (!el) return;

    gsap.killTweensOf([el, chevron]);

    if (open) {
      gsap.set(el, { height: 'auto', opacity: 1 });
      const h = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.32, ease: 'power2.out' }
      );
      if (chevron) gsap.to(chevron, { rotate: 180, duration: 0.25 });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
      if (chevron) gsap.to(chevron, { rotate: 0, duration: 0.25 });
    }
  }, [open]);

  if (!tafsir) {
    return (
      <div className="mt-4 text-xs text-ink-pale italic">
        Tafsir tidak tersedia untuk ayat ini.
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 text-sm font-medium transition-colors',
          'text-emerald-main hover:text-emerald-deep'
        )}
        aria-expanded={open}
      >
        <HiOutlineBookOpen className="h-4 w-4" />
        <span>{open ? 'Sembunyikan Tafsir' : 'Buka Tafsir'}</span>
        <span ref={chevronRef} className="inline-flex">
          <HiOutlineChevronDown className="h-3.5 w-3.5" />
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="mt-3 rounded-xl bg-emerald-soft/40 border border-emerald-main/10 p-4">
          <div className="text-[11px] uppercase tracking-wide text-emerald-muted font-semibold mb-2">
            Tafsir
          </div>
          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">
            {tafsir}
          </p>
        </div>
      </div>
    </div>
  );
}