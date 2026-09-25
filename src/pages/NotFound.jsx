import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import Button from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Halaman Tidak Ditemukan');

  return (
    <div className="container-page py-20 text-center">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-emerald-soft text-emerald-deep">
        <span className="font-display text-4xl font-semibold">404</span>
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">
        Halaman tidak ditemukan
      </h1>
      <p className="text-sm text-ink-muted mb-6 max-w-md mx-auto">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan. Mari kembali
        ke beranda.
      </p>
      <Button
        as={Link}
        to="/"
        size="lg"
        leftIcon={<HiOutlineArrowLeft />}
      >
        Kembali ke Beranda
      </Button>
    </div>
  );
}