import { Link } from 'react-router-dom';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export default function SurahCard({ surah }) {
  if (!surah) return null;

  const nomor = surah.nomor;
  const nama = surah.namaLatin ?? surah.nama_latin ?? `Surah ${nomor}`;
  const arabic = surah.nama;
  const arti = surah.arti ?? '';
  const jumlahAyat = surah.jumlahAyat ?? surah.jumlah_ayat ?? 0;
  const tempat = surah.tempatTurun ?? surah.tempat_turun ?? '';

  return (
    <Link
      to={`/quran/${nomor}`}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border border-line bg-white p-4',
        'transition-all duration-200 hover:border-emerald-main/40 hover:shadow-card hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-main/40'
      )}
    >
      {/* Nomor Arab dalam kotak */}
      <div
        className={cn(
          'relative grid h-12 w-12 shrink-0 place-items-center',
          'rounded-xl bg-emerald-soft text-emerald-deep',
          'transition-colors group-hover:bg-emerald-main group-hover:text-white'
        )}
      >
        <span className="font-display text-sm font-semibold">{nomor}</span>
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rotate-45 rounded-sm bg-gold/40" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-ink truncate">{nama}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
          <span className="truncate">{arti}</span>
          <span className="text-ink-pale">·</span>
          <span className="whitespace-nowrap">{jumlahAyat} ayat</span>
          {tempat && (
            <>
              <span className="text-ink-pale">·</span>
              <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                <HiOutlineMapPin className="h-3 w-3" />
                {tempat}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Nama Arab */}
      <div className="text-right shrink-0">
        <div className="font-arabic text-2xl text-emerald-deep leading-none">
          {arabic}
        </div>
      </div>
    </Link>
  );
}