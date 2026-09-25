import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from './useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scoped GSAP + auto cleanup.
 * const scope = useGSAP(() => {
 *   gsap.from('.card', { y: 20, opacity: 0, stagger: 0.1 });
 * }, []);
 * <div ref={scope}> ... </div>
 *
 * @param {Function} callback - fungsi animasi, terima (gsap, ScrollTrigger, scopeEl)
 * @param {Array} deps
 * @param {Object} options - { scope: boolean }
 */
export function useGSAP(callback, deps = [], options = {}) {
  const scopeRef = useRef(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { scope = true } = options;

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const el = scope ? scopeRef.current : undefined;
    const ctx = gsap.context(() => {
      if (typeof callback === 'function') {
        callback(gsap, ScrollTrigger, el);
      }
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);

  return scopeRef;
}

export { gsap, ScrollTrigger };
export default useGSAP;