import { useEffect } from 'react';
import { BRAND } from '../../config/brand';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEO({ title, description, image, url }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — ${BRAND.name}`
      : `${BRAND.name} — ${BRAND.tagline}`;
    document.title = fullTitle;

    const desc = description ?? BRAND.description;
    const img = image ?? '/logo.png';

    setMeta('description', desc);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:image', img, 'property');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', img);

    if (url) {
      setMeta('og:url', url, 'property');
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }
  }, [title, description, image, url]);

  return null;
}