import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

const VARIANTS = {
  primary:
    'bg-emerald-main text-white hover:bg-emerald-deep active:scale-[0.98] shadow-soft',
  secondary:
    'bg-emerald-soft text-emerald-deep hover:bg-emerald-pale border border-emerald-main/10',
  ghost: 'text-ink-muted hover:text-emerald-deep hover:bg-emerald-soft/60',
  outline:
    'border border-line bg-white text-ink hover:border-emerald-main/40 hover:bg-emerald-soft/40',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  icon: 'w-10 h-10 rounded-xl',
};

const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...rest
  },
  ref
) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium',
    'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:ring-2 focus-visible:ring-emerald-main/40 focus-visible:outline-none',
    VARIANTS[variant],
    SIZES[size],
    className
  );

  const content = (
    <>
      {loading ? (
        <Spinner size={16} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  const Cmp = as || 'button';
  return (
    <Cmp
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </Cmp>
  );
});

export default Button;