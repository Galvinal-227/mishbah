import { cn } from '../../utils/cn';

export default function Card({
  as: Cmp = 'div',
  className,
  hover = false,
  padded = true,
  children,
  ...rest
}) {
  return (
    <Cmp
      className={cn(
        'card',
        padded && 'p-5 sm:p-6',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </Cmp>
  );
}