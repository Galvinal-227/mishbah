import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlineBookmark,
  HiOutlineClock,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import { useAuth } from '../contexts/AuthContext';
import { useLocationCtx } from '../contexts/LocationContext';
import { useToast } from '../contexts/ToastContext';
import { useUserData } from '../contexts/UserDataContext';
import { getMonthlySchedule, getTodaySchedule } from '../services/prayerService';
import { useSurahList } from '../hooks/useSurahList';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { BRAND } from '../config/brand';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LastReadCard from '../components/common/LastReadCard';
import AppDownloadBanner from '../components/common/AppDownloadBanner';
import PrayerCard from '../components/prayer/PrayerCard';
import LocationPicker from '../components/prayer/LocationPicker';
import SurahCard from '../components/quran/SurahCard';
import { SkeletonList } from '../components/ui/Skeleton';

const QUICK_LINKS = [
  { to: '/quran', label: "Al-Qur'an", icon: HiOutlineBookOpen, desc: '114 surah' },
  { to: '/search', label: 'Cari', icon: HiOutlineMagnifyingGlass, desc: 'Temukan surah' },
  { to: '/bookmarks', label: 'Bookmark', icon: HiOutlineBookmark, desc: 'Ayat tersimpan' },
  { to: '/last-read', label: 'Terakhir', icon: HiOutlineClock, desc: 'Riwayat baca' },
];

export default function Home() {
  useDocumentTitle(); // default → "Mishbah — Baca Al-Qur'an dengan tenang"

  const { user } = useAuth();
  const { location } = useLocationCtx();
  const { lastRead } = useUserData();
  const { surahs, loading: loadingSurahs } = useSurahList();
  const toast = useToast();

  const [todaySchedule, setTodaySchedule] = useState(null);
  const [showLocation, setShowLocation] = useState(false);

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      heroRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    ).fromTo(
      contentRef.current?.children ?? [],
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
      '-=0.35'
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!location?.provinsi || !location?.kabkota) {
        setTodaySchedule(null);
        return;
      }
      try {
        const data = await getMonthlySchedule({
          provinsi: location.provinsi,
          kabkota: location.kabkota,
        });
        if (mounted) setTodaySchedule(getTodaySchedule(data));
      } catch {
        toast.error('Gagal memuat jadwal sholat');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location?.provinsi, location?.kabkota, toast]);

  const handlePlayAdzan = () => {
    const audio = new Audio('/audio/adzan.mp3');
    audio.volume = 0.9;
    audio.play().catch(() => {
      toast.error('File adzan.mp3 belum tersedia di /public/audio/');
    });
    toast.info('Memutar adzan');
  };

  const handlePlayTarhim = () => {
    const audio = new Audio('/audio/tarhim.mp3');
    audio.volume = 0.9;
    audio.play().catch(() => {
      toast.error('File tarhim.mp3 belum tersedia di /public/audio/');
    });
    toast.info('Memutar tarhim');
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 19) return 'Selamat sore';
    return 'Selamat malam';
  })();

  const featuredSurahs = surahs.slice(0, 6);

  return (
    <div className="container-page py-6 sm:py-10">
      {/* Hero */}
      <section ref={heroRef} className="mb-8">
        <div className="mb-1 text-sm text-ink-muted">
          Assalamu'alaikum{user?.displayName ? `, ${user.displayName}` : ''}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          {greeting}
        </h1>
        <p className="mt-2 text-ink-muted text-sm sm:text-base max-w-2xl">
          Baca Al-Qur'an dengan tenang. Terjemahan, tafsir, dan audio qari
          dalam satu tempat.
        </p>
      </section>

      {/* Grid utama */}
      <div ref={contentRef} className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {lastRead ? (
            <LastReadCard lastRead={lastRead} />
          ) : (
            <Card className="bg-emerald-soft/40 border-emerald-main/15">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-main text-white">
                  <HiOutlineBookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg text-ink mb-1">
                    Mulai tilawah hari ini
                  </div>
                  <p className="text-sm text-ink-muted mb-4">
                    Pilih surah untuk memulai. Kami akan menyimpan posisi
                    terakhir Anda.
                  </p>
                  <Button as={Link} to="/quran" size="sm">
                    Buka Al-Qur'an
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map(({ to, label, icon: IconCmp, desc }) => (
              <Link
                key={to}
                to={to}
                className="card p-4 hover:border-emerald-main/40 hover:shadow-card transition-all text-center group"
              >
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-emerald-soft text-emerald-deep group-hover:bg-emerald-main group-hover:text-white transition-colors">
                  <IconCmp className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium text-ink">{label}</div>
                <div className="text-[11px] text-ink-pale mt-0.5">{desc}</div>
              </Link>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl text-ink">Surah Pilihan</h2>
              <Link
                to="/quran"
                className="text-sm font-medium text-emerald-main hover:text-emerald-deep"
              >
                Lihat semua →
              </Link>
            </div>
            {loadingSurahs ? (
              <SkeletonList count={3} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {featuredSurahs.map((s) => (
                  <SurahCard key={s.nomor} surah={s} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <PrayerCard
            location={location}
            todaySchedule={todaySchedule}
            onPickLocation={() => setShowLocation(true)}
            onPlayAdzan={handlePlayAdzan}
            onPlayTarhim={handlePlayTarhim}
          />

          <AppDownloadBanner />

          <Card className="bg-gradient-to-br from-cream to-ivory">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-dark">
                <HiOutlineSparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base text-ink mb-1">
                  {BRAND.name}
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {BRAND.taglineAlt}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <LocationPicker
        open={showLocation}
        onClose={() => setShowLocation(false)}
      />

      <div className="h-24 md:h-16" />
    </div>
  );
}