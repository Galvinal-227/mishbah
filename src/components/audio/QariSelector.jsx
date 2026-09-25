import { QARI_LIST } from '../../config/constants';
import { cn } from '../../utils/cn';

export default function QariSelector({
  value,
  onChange,
  className,
  variant = 'default', // default | compact
}) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {QARI_LIST.map((q) => {
        const active = q.id === value;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onChange?.(q.id)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
              variant === 'compact' && 'px-2 py-1',
              active
                ? 'border-emerald-main bg-emerald-soft text-emerald-deep'
                : 'border-line bg-white text-ink-muted hover:border-emerald-main/40 hover:text-emerald-deep'
            )}
            aria-pressed={active}
          >
            {q.name}
          </button>
        );
      })}
    </div>
  );
}