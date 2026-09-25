import { cn } from '../../utils/cn';

const TONES = {
  emerald: 'bg-emerald-soft text-emerald-deep',
  gold: 'bg-gold/15 text-gold-dark',
  neutral: 'bg-line-soft text-ink-muted',
  outline: 'border border-line text-ink-muted bg-white',
};

export default function Badge({ tone = 'emerald', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        TONES[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}