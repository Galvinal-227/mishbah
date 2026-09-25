import { useState } from 'react';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export default function PasswordInput({ className, ...rest }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className={cn('input pr-10', className)}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-ink-pale hover:bg-emerald-soft/60 hover:text-emerald-deep transition-colors"
      >
        {show ? (
          <HiOutlineEyeSlash className="h-4 w-4" />
        ) : (
          <HiOutlineEye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}