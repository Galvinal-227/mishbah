import { Link } from 'react-router-dom';
import { HiOutlineBookOpen, HiOutlineArrowRight } from 'react-icons/hi2';
import { highlightMatches } from '../../utils/searchUtils';
import { cn } from '../../utils/cn';

function Highlighted({ text, query, className }) {
  const parts = highlightMatches(text, query);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.match ? (
          <mark
            key={i}
            className="bg-gold/25 text-ink rounded px-0.5"
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

export function SurahResultItem({ surah, query }) {
  return (
    <Link
      to={`/quran/${surah.nomor}`}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-all hover:border-emerald-main/40 hover:shadow-soft"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-soft text-emerald-deep text-sm font-semibold">
        {surah.nomor}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-ink">
          <Highlighted
            text={surah.namaLatin ?? surah.nama_latin ?? ''}
            query={query}
          />
        </div>
        <div className="text-xs text-ink-muted mt-0.5">
          <Highlighted text={surah.arti ?? ''} query={query} /> ·{' '}
          {surah.jumlahAyat ?? surah.jumlah_ayat} ayat
        </div>
      </div>
      <div className="font-arabic text-xl text-emerald-deep shrink-0">
        <Highlighted text={surah.nama ?? ''} query={query} />
      </div>
    </Link>
  );
}

export function AyahResultItem({ result, query }) {
  const { surahNumber, surahName, ayahNumber, teksArab, teksIndonesia } = result;

  return (
    <Link
      to={`/quran/${surahNumber}#ayah-${ayahNumber}`}
      className="group block rounded-2xl border border-line bg-white p-4 transition-all hover:border-emerald-main/40 hover:shadow-soft"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="badge-emerald">
          QS. {surahName} : {ayahNumber}
        </span>
        <span className="text-xs text-ink-pale opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
          Buka <HiOutlineArrowRight className="h-3 w-3" />
        </span>
      </div>

      {teksArab && (
        <p
          className="font-arabic text-xl text-emerald-deep leading-loose text-right mb-2"
          dir="rtl"
        >
          {teksArab.length > 220 ? teksArab.slice(0, 220) + '…' : teksArab}
        </p>
      )}

      {teksIndonesia && (
        <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">
          <Highlighted text={teksIndonesia} query={query} />
        </p>
      )}
    </Link>
  );
}

export function SectionHeader({ icon, title, count }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-soft text-emerald-deep">
        {icon ?? <HiOutlineBookOpen className="h-3.5 w-3.5" />}
      </span>
      <h2 className="font-display text-lg text-ink">{title}</h2>
      {typeof count === 'number' && (
        <span className="text-xs text-ink-pale">({count})</span>
      )}
    </div>
  );
}

export const _cn = cn;