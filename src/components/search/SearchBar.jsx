import { forwardRef } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onClear, placeholder = 'Cari…', className, autoFocus, big = false },
  ref
) {
  return (
    <div className={cn('relative', className)}>
      <HiOutlineMagnifyingGlass
        className={cn(
          'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-pale',
          big ? 'h-5 w-5' : 'h-4 w-4'
        )}
      />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck="false"
        className={cn(
          'w-full rounded-xl border border-line bg-white text-ink placeholder:text-ink-pale',
          'focus:border-emerald-main focus:outline-none focus:ring-4 focus:ring-emerald-main/10',
          'transition-all',
          big ? 'pl-11 pr-11 py-3.5 text-base' : 'pl-9 pr-9 py-3 text-sm'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Bersihkan"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-lg',
            'text-ink-pale hover:bg-emerald-soft/60 hover:text-emerald-deep transition-colors',
            big ? 'h-8 w-8' : 'h-7 w-7'
          )}
        >
          <HiOutlineXMark className={big ? 'h-5 w-5' : 'h-4 w-4'} />
        </button>
      )}
    </div>
  );
});

export default SearchBar;