import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineBellAlert,
  HiOutlineClock,
  HiOutlineMusicalNote,
  HiOutlineCloudArrowDown,
  HiOutlineSquares2X2,
  HiOutlineCloud,
  HiOutlineArrowLeft,
} from 'react-icons/hi2';
import { SiAndroid } from 'react-icons/si';
import { gsap } from 'gsap';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SEO from '../components/common/SEO';
import { APP_DOWNLOAD } from '../config/appDownload';
import { BRAND } from '../config/brand';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useToast } from '../contexts/ToastContext';

const FEATURE_ICONS = [
  HiOutlineBellAlert,
  HiOutlineClock,
  HiOutlineMusicalNote,
  HiOutlineCloudArrowDown,
  HiOutlineSquares2X2,
  HiOutlineCloud,
];

export default function Download() {
  useDocumentTitle('Download Aplikasi');
  const toast = useToast();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      '[data-dl-hero]',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    ).fromTo(
      '[data-dl-card]',
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
      '-=0.2'
    );
    return () => tl.kill();
  }, []);

  const handleDownload = () => {
    if (!APP_DOWNLOAD.IS_READY) {
      toast.warning('APK belum tersedia. Silakan kembali lagi nanti.');
      return;
    }
    toast.success('Memulai unduhan…');

    const a = document.createElement('a');
    a.href = APP_DOWNLOAD.APK_URL;
    a.download = 'mishbah.apk';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isReady = APP_DOWNLOAD.IS_READY;

  return (
    <>
      <SEO
        title="Download Aplikasi Android"
        description={APP_DOWNLOAD.DESCRIPTION}
      />

      <div className="container-page py-6 sm:py-10 max-w-4xl">
        {/* Kembali */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-emerald-deep mb-4"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>

        {/* Hero */}
        <section
          data-dl-hero
          className="card overflow-hidden border-none mb-6"
          style={{
            background: 'linear-gradient(135deg, #0F3D32 0%, #176B5B 100%)',
          }}
        >
          <div className="p-8 sm:p-10 text-center text-white relative">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-gold/10 blur-3xl -translate-y-1/3 translate-x-1/3" />

            <div className="relative">
              <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-white/10 backdrop-blur">
                <SiAndroid className="h-11 w-11 text-gold" />
              </div>

              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <Badge className="!bg-white/15 !text-white">
                  Android {APP_DOWNLOAD.MIN_ANDROID}+
                </Badge>
                <Badge className="!bg-white/15 !text-white">
                  v{APP_DOWNLOAD.VERSION}
                </Badge>
                {APP_DOWNLOAD.SIZE_LABEL && (
                  <Badge className="!bg-white/15 !text-white">
                    {APP_DOWNLOAD.SIZE_LABEL}
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">
                {APP_DOWNLOAD.TITLE}
              </h1>
              <p className="text-white/80 max-w-xl mx-auto mb-6">
                {APP_DOWNLOAD.DESCRIPTION}
              </p>

              {isReady ? (
                <Button
                  onClick={handleDownload}
                  size="lg"
                  leftIcon={<HiOutlineArrowDownTray />}
                  className="!bg-white !text-emerald-deep hover:!bg-white/90 !border-transparent"
                >
                  Download APK
                </Button>
              ) : (
                <div className="inline-flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    disabled
                    size="lg"
                    leftIcon={<HiOutlineExclamationTriangle />}
                    className="!bg-white/20 !text-white/70 !border-transparent cursor-not-allowed"
                  >
                    Segera Hadir
                  </Button>
                  <span className="text-xs text-white/60">
                    APK sedang dalam pengembangan
                  </span>
                </div>
              )}

              <p className="text-xs text-white/50 mt-5">
                {isReady
                  ? 'Download langsung dari server. Tidak butuh Play Store.'
                  : 'Aplikasi Android sedang dibangun. Pantau terus halaman ini.'}
              </p>
            </div>
          </div>
        </section>

        {/* Fitur eksklusif Android */}
        <section className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-ink mb-1">
            Kenapa versi Android?
          </h2>
          <p className="text-sm text-ink-muted mb-5">
            Fitur yang tidak mungkin dihadirkan di browser.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {APP_DOWNLOAD.FEATURES.map((feat, i) => {
              const IconCmp = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <Card key={feat.title} hover data-dl-card>
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-soft text-emerald-deep">
                      <IconCmp className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-ink text-sm">
                        {feat.title}
                      </div>
                      <div className="text-xs text-ink-muted mt-1 leading-relaxed">
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Cara install */}
        <section className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-ink mb-1">
            Cara Install
          </h2>
          <p className="text-sm text-ink-muted mb-5">
            Karena tidak dari Play Store, ikuti langkah berikut.
          </p>

          <Card>
            <ol className="space-y-4">
              {[
                'Klik tombol Download APK di atas.',
                'Setelah selesai, buka file mishbah.apk dari Notifikasi atau File Manager.',
                'Jika muncul peringatan "Install dari sumber tidak dikenal", pilih Setelan → izinkan untuk browser/file manager Anda.',
                'Kembali ke halaman install, lalu tekan Install.',
                'Buka aplikasi Mishbah — selesai!',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-main text-white text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink-soft leading-relaxed pt-1">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 pt-5 border-t border-line flex items-start gap-2 text-xs text-ink-muted">
              <HiOutlineCheckCircle className="h-4 w-4 text-emerald-main shrink-0 mt-0.5" />
              <span>
                APK ditandatangani secara resmi. Tidak ada iklan, tidak ada
                pelacakan. Bookmark & last read tersinkron dengan akun{' '}
                {BRAND.name} Anda.
              </span>
            </div>
          </Card>
        </section>

        {/* Info teknis */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink mb-1">
            Detail Aplikasi
          </h2>
          <Card>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <InfoRow label="Versi" value={`v${APP_DOWNLOAD.VERSION}`} />
              <InfoRow
                label="Minimum Android"
                value={`Android ${APP_DOWNLOAD.MIN_ANDROID}+`}
              />
              <InfoRow
                label="Ukuran"
                value={APP_DOWNLOAD.SIZE_LABEL || '—'}
              />
              <InfoRow
                label="Tanggal rilis"
                value={APP_DOWNLOAD.RELEASE_DATE || '—'}
              />
              <InfoRow label="Ukuran web (PWA)" value="~3 MB" />
              <InfoRow label="Platform" value="Android (iOS segera)" />
            </dl>
          </Card>
        </section>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/quran"
            className="text-sm text-emerald-main hover:text-emerald-deep font-medium"
          >
            Atau lanjutkan baca di web →
          </Link>
        </div>

        <div className="h-24" />
      </div>
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-line last:border-b-0 sm:border-b-0 sm:py-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink font-medium">{value}</dd>
    </div>
  );
}