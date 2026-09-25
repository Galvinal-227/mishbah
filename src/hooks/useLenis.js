import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from './useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/**
 * Global Lenis smooth scroll.
 * - Otomatis disable bila user aktifkan "reduced motion".
 * - Terintegrasi dengan GSAP ticker (satu RAF loop).
 * - Cleanup saat unmount.
 */
export function useLenis() {
  const lenisRef = useRef(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    // Sync ScrollTrigger dengan Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Gunakan GSAP ticker sebagai RAF tunggal
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return lenisRef;
}

export default useLenis;