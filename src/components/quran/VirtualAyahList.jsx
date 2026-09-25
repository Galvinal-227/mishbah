import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Virtual list sederhana untuk ayat.
 * - Menghitung offset setiap item berdasarkan estimasi tinggi.
 * - Mengukur tinggi aktual setiap item saat dirender (ResizeObserver).
 * - Menampilkan hanya item yang terlihat + buffer.
 *
 * Catatan: bukan virtualization "sempurna". Untuk ayat dengan panjang
 * sangat bervariasi (seperti 2:282) tinggi diukur aktual via ResizeObserver.
 */
export default function VirtualAyahList({
  items,
  renderItem,
  overscan = 3,
  className,
}) {
  const containerRef = useRef(null);
  const heightsRef = useRef(new Map()); // id → height
  const [, forceUpdate] = useState(0);
  const [viewport, setViewport] = useState({ scrollTop: 0, height: 0 });

  /* ---------- Observasi tinggi item ---------- */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const ro = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const id = entry.target.dataset.ayahId;
        if (!id) continue;
        const h = entry.contentRect.height;
        const prev = heightsRef.current.get(id);
        if (prev !== h) {
          heightsRef.current.set(id, h);
          changed = true;
        }
      }
      if (changed) forceUpdate((v) => v + 1);
    });

    const observe = () =>
      root.querySelectorAll('[data-ayah-id]').forEach((el) => ro.observe(el));
    observe();

    const mo = new MutationObserver(observe);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [items.length]);

  /* ---------- Scroll tracking ---------- */
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      setViewport({ scrollTop: window.scrollY, height: window.innerHeight });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* ---------- Hitung offset kumulatif ---------- */
  const DEFAULT_HEIGHT = 260;
  const { offsets, totalHeight } = useMemo(() => {
    const offs = new Array(items.length);
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      offs[i] = acc;
      const id = String(items[i].nomorAyat ?? i);
      acc += heightsRef.current.get(id) ?? DEFAULT_HEIGHT;
    }
    return { offsets: offs, totalHeight: acc };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, viewport.scrollTop]);

  /* ---------- Cari range yang terlihat ---------- */
  const { start, end } = useMemo(() => {
    const top = viewport.scrollTop;
    const bottom = top + viewport.height;

    let s = 0;
    while (s < offsets.length && offsets[s] + DEFAULT_HEIGHT < top) s++;

    let e = s;
    while (e < offsets.length && offsets[e] < bottom) e++;

    s = Math.max(0, s - overscan);
    e = Math.min(items.length, e + overscan);
    return { start: s, end: e };
  }, [offsets, viewport, items.length, overscan]);

  /* ---------- Render item di luar layar: placeholder ---------- */
  const visible = items.slice(start, end);

  return (
    <div ref={containerRef} className={className}>
      <div style={{ height: start > 0 ? offsets[start] : 0 }} aria-hidden />
      <div className="space-y-4">
        {visible.map((item, idx) => {
          const globalIdx = start + idx;
          return (
            <div
              key={item.nomorAyat ?? globalIdx}
              data-ayah-id={item.nomorAyat ?? globalIdx}
            >
              {renderItem(item, globalIdx)}
            </div>
          );
        })}
      </div>
      <div
        style={{
          height:
            start + visible.length < items.length
              ? totalHeight - offsets[start + visible.length]
              : 0,
        }}
        aria-hidden
      />
    </div>
  );
}