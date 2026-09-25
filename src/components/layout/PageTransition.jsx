import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function PageTransition({ children }) {
  const location = useLocation();
  const ref = useRef(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform' }
    );
    return () => gsap.killTweensOf(el);
  }, [location.pathname, reducedMotion]);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}