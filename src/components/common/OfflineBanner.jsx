import { useEffect, useState } from 'react';
import { HiOutlineWifi, HiOutlineCloudArrowDown } from 'react-icons/hi2';

export default function OfflineBanner() {
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="alert"
      className="fixed top-16 left-0 right-0 z-40 flex justify-center pointer-events-none"
    >
      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 backdrop-blur-md text-gold-dark px-3 py-1.5 text-xs font-medium shadow-soft animate-fade-in pointer-events-auto">
        <HiOutlineCloudArrowDown className="h-3.5 w-3.5" />
        <span>Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</span>
      </div>
    </div>
  );
}

export const _Wifi = HiOutlineWifi;