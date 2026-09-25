import { Link } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi2';
import Card from '../ui/Card';

export default function ContinueReadingBanner({ lastRead }) {
  if (!lastRead) return null;

  return (
    <Link to={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`}>
      <Card
        hover
        className="flex items-center gap-4 bg-emerald-soft/60 border-emerald-main/20"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-main text-white">
          <HiOutlineBookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-ink-muted">Lanjutkan membaca</div>
          <div className="text-sm font-semibold text-ink truncate">
            {lastRead.surahName} · Ayat {lastRead.ayahNumber}
          </div>
        </div>
        <span className="text-emerald-main text-sm font-medium">Lanjut →</span>
      </Card>
    </Link>
  );
}