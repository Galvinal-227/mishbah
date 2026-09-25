import { Link } from 'react-router-dom';
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import Card from '../ui/Card';
import { APP_DOWNLOAD } from '../../config/appDownload';
import { cn } from '../../utils/cn';

export default function AppDownloadBanner({ className }) {
  if (!APP_DOWNLOAD.IS_READY) return null;

  return (
    <Link to="/download" className={cn('block', className)}>
      <Card
        hover
        className="bg-gradient-to-br from-emerald-deep to-emerald-main border-none text-white relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/15 blur-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <HiOutlineDevicePhoneMobile className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/70 mb-1">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              <span>Baru</span>
            </div>
            <div className="font-display text-base font-semibold leading-tight">
              {APP_DOWNLOAD.TITLE}
            </div>
            <div className="text-xs text-white/70 mt-0.5 line-clamp-1">
              {APP_DOWNLOAD.TAGLINE}
            </div>
          </div>
          <HiOutlineArrowRight className="h-5 w-5 shrink-0 text-white/70" />
        </div>
      </Card>
    </Link>
  );
}