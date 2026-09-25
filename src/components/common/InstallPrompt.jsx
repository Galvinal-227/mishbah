import { useEffect, useState } from 'react';
import { HiOutlineArrowDownTray, HiOutlineXMark } from 'react-icons/hi2';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const DISMISS_KEY = 'mishbah.installPromptDismissed';

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const handler = (e) => {
      e.preventDefault();
      setPromptEvent(e);
      setTimeout(() => setVisible(true), 5000);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installed = () => {
      setVisible(false);
      localStorage.setItem(DISMISS_KEY, '1');
    };
    window.addEventListener('appinstalled', installed);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') localStorage.setItem(DISMISS_KEY, '1');
    setPromptEvent(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[360px] z-[70]',
        'rounded-2xl border border-line bg-white shadow-card p-4'
      )}
      role="dialog"
      aria-label="Install aplikasi"
    >
      <div className="flex items-start gap-3">
        <img
          src="/logo.png"
          alt="Mishbah"
          className="h-10 w-10 rounded-xl shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink">
            Pasang Mishbah di perangkat
          </div>
          <div className="text-xs text-ink-muted mt-0.5">
            Akses lebih cepat, bisa dibuka tanpa browser.
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Tutup"
          className="btn-icon shrink-0 -mt-1 -mr-1"
        >
          <HiOutlineXMark className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="flex-1">
          Nanti
        </Button>
        <Button
          size="sm"
          onClick={handleInstall}
          leftIcon={<HiOutlineArrowDownTray />}
          className="flex-1"
        >
          Pasang
        </Button>
      </div>
    </div>
  );
}