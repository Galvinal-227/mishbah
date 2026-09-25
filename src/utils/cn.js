/**
 * Gabung className (filter falsy) tanpa dependensi.
 * cn('a', cond && 'b', 'c') → 'a b c'
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}

export default cn;