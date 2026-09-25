import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineBookOpen } from 'react-icons/hi2';
import { useUserData } from '../contexts/UserDataContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatRelative } from '../utils/dateFormat';

export default function LastRead() {
  useDocumentTitle('Terakhir Dibaca');

  const { lastRead, isGuest } = useUserData();

  const updated = lastRead?.updatedAt
    ? formatRelative(toDate(lastRead.updatedAt))
    : '';

  return (
    <div className="container-page py-6 sm:py-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">
          Terakhir Dibaca
        </h1>
        <p className="text-sm text-ink-muted">
          {isGuest
            ? 'Posisi baca tersimpan di perangkat ini.'
            : 'Posisi baca tersinkron ke akun Anda.'}
        </p>
      </div>

      {!lastRead ? (
        <Card>
          <EmptyState
            icon={<HiOutlineClock className="h-7 w-7" />}
            title="Belum ada riwayat"
            description="Mulai membaca Al-Qur'an dan kami akan menyimpan posisi terakhir Anda."
            action={
              <Button as={Link} to="/quran" size="sm">
                Buka Al-Qur'an
              </Button>
            }
          />
        </Card>
      ) : (
        <Card hover>
          <Link
            to={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`}
            className="flex items-center gap-4"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-main to-emerald-deep text-white">
              <HiOutlineBookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-ink-pale mb-1">Terakhir dibaca</div>
              <div className="font-display text-xl text-ink">
                {lastRead.surahName}
              </div>
              <div className="text-sm text-ink-muted mt-0.5">
                Ayat {lastRead.ayahNumber}
                {updated && ` · ${updated}`}
              </div>
            </div>
            <span className="hidden sm:inline-flex text-emerald-main text-sm font-medium">
              Lanjutkan →
            </span>
          </Link>
        </Card>
      )}
    </div>
  );
}

function toDate(v) {
  if (!v) return null;
  if (typeof v === 'number') return new Date(v);
  if (v?.toDate) return v.toDate();
  if (typeof v === 'string') return new Date(v);
  return null;
}