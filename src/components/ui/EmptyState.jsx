import { cn } from '../../utils/cn';

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-14 px-6',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald-deep">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="font-display text-xl text-ink mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-ink-muted max-w-md mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}