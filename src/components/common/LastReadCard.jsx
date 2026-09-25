import { Link } from 'react-router-dom';
import { HiOutlineBookOpen, HiOutlineArrowRight } from 'react-icons/hi2';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function LastReadCard({ lastRead }) {
  if (!lastRead) return null;
  const { surahNumber, surahName, ayahNumber } = lastRead;

  return (
    <Card
      className="relative overflow-hidden bg-gradient-to-br from-emerald-deep to-emerald-main text-white border-none"
      padded
    >
      {/* Ornamen dekoratif */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
      <div className="absolute -right-4 -bottom-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/70 mb-3">
          <HiOutlineBookOpen className="h-4 w-4" />
          <span>Lanjutkan Membaca</span>
        </div>

        <div className="mb-4">
          <div className="font-display text-2xl font-semibold leading-tight">
            {surahName}
          </div>
          <div className="text-sm text-white/80 mt-1">
            Ayat {ayahNumber}
          </div>
        </div>

        <Button
          as={Link}
          to={`/quran/${surahNumber}#ayah-${ayahNumber}`}
          variant="secondary"
          size="sm"
          rightIcon={<HiOutlineArrowRight />}
          className="!bg-white !text-emerald-deep hover:!bg-white/90 !border-transparent"
        >
          Lanjutkan
        </Button>
      </div>
    </Card>
  );
}