import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineArrowDownTray,
  HiOutlineSpeakerWave,
} from 'react-icons/hi2';
import { gsap } from 'gsap';
import { useSurahDetail } from '../hooks/useSurahDetail';
import { useReadingPrefs } from '../contexts/ReadingPrefsContext';
import { useAudio } from '../contexts/AudioContext';
import { useToast } from '../contexts/ToastContext';
import { useUserData } from '../contexts/UserDataContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import AyahCard from '../components/quran/AyahCard';
import ReaderToolbar from '../components/quran/ReaderToolbar';
import ReaderSkeleton from '../components/quran/ReaderSkeleton';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SEO from '../components/common/SEO';

export default function QuranReader() {
  const { surah: surahParam } = useParams();
  const surahNumber = Number(surahParam);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { detail, tafsirMap, loading, error, reload } =
    useSurahDetail(surahNumber);
  const { prefs } = useReadingPrefs();
  const { current, isPlaying, playAyah } = useAudio();
  const { toggleBookmark, isBookmarked, updateLastRead } = useUserData();

  const headerRef = useRef(null);

  /* Title dinamis — nama surah */
  const namaLatinForTitle =
    detail?.namaLatin ?? detail?.nama_latin ?? '';
  useDocumentTitle(
    namaLatinForTitle ? `Surah ${namaLatinForTitle}` : 'Memuat surah…'
  );

  /* =========================================================
     Playlist audio
     ========================================================= */
  const playlist = useMemo(() => {
    if (!detail?.ayat?.length) return [];
    return detail.ayat.map((a) => ({
      nomorAyat: a.nomorAyat,
      audio: a.audio ?? {},
    }));
  }, [detail]);

  /* Simpan last read saat membuka surah */
  useEffect(() => {
    if (!detail) return;
    const ayahFromHash = (() => {
      const m = location.hash.match(/#ayah-(\d+)/);
      return m ? Number(m[1]) : 1;
    })();

    updateLastRead({
      surahNumber: detail.nomor,
      surahName: detail.namaLatin ?? detail.nama_latin,
      ayahNumber: ayahFromHash,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.nomor]);

  /* Scroll ke hash */
  useEffect(() => {
    if (!detail?.ayat?.length) return;
    const m = location.hash.match(/#ayah-(\d+)/);
    if (!m) return;
    const num = Number(m[1]);
    const t = setTimeout(() => {
      const el = document.getElementById(`ayah-${num}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.nomor]);

  /* Animasi header */
  useEffect(() => {
    if (!detail || !headerRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
    return () => tl.kill();
  }, [detail]);

  /* Simpan last read saat scroll (throttled 3 detik) */
  useEffect(() => {
    if (!detail?.ayat?.length) return;
    let lastSaved = 0;
    const handler = () => {
      const now = Date.now();
      if (now - lastSaved < 3000) return;
      const sections = document.querySelectorAll('[id^="ayah-"]');
      let visible = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top >= 0 && r.top < window.innerHeight / 2) {
          visible = el.id;
          break;
        }
      }
      if (visible) {
        const num = Number(visible.replace('ayah-', ''));
        updateLastRead({
          surahNumber: detail.nomor,
          surahName: detail.namaLatin ?? detail.nama_latin,
          ayahNumber: num,
        });
        lastSaved = now;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  /* Handlers */
  const handleBookmark = async (ayah) => {
    if (!detail) return;
    const exists = isBookmarked(surahNumber, ayah.nomorAyat);
    try {
      await toggleBookmark({
        surahNumber,
        surahName: detail.namaLatin ?? detail.nama_latin,
        ayahNumber: ayah.nomorAyat,
        teksArab: ayah.teksArab,
        teksIndonesia: ayah.teksIndonesia,
      });
      toast.success(exists ? 'Bookmark dihapus' : 'Ayat ditandai');
    } catch {
      toast.error('Gagal memperbarui bookmark');
    }
  };

  const handlePlay = async (ayah) => {
    if (!detail) return;
    const isCurrent =
      current?.surahNumber === surahNumber &&
      current?.ayahNumber === ayah.nomorAyat;
    if (isCurrent && isPlaying) return;

    await playAyah({
      surahNumber: detail.nomor,
      surahName: detail.namaLatin ?? detail.nama_latin,
      ayahNumber: ayah.nomorAyat,
      audioMap: ayah.audio ?? {},
      playlist,
    });
  };

  const handleShare = (text) => {
    if (!navigator.clipboard) {
      toast.error('Clipboard tidak tersedia');
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success('Teks ayat disalin'))
      .catch(() => toast.error('Gagal menyalin'));
  };

  const handleDownloadAudio = () => {
    if (!detail) return;
    const code = 'Yasser-Al-Dosari';
    const padded = String(surahNumber).padStart(3, '0');
    const url = `https://cdn.equran.id/audio-full/${code}/${padded}.mp3`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${detail.namaLatin ?? detail.nama_latin}_full.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.info('Memulai unduhan audio');
  };

  const prevSurah = surahNumber > 1 ? surahNumber - 1 : null;
  const nextSurah = surahNumber < 114 ? surahNumber + 1 : null;

  /* Render */
  if (loading && !detail) {
    return (
      <div className="container-page py-6 sm:py-10">
        <ReaderSkeleton />
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="container-page py-10">
        <ErrorState
          title="Gagal memuat surah"
          description={error}
          onRetry={reload}
        />
      </div>
    );
  }

  if (!detail) return null;

  const namaLatin =
    detail.namaLatin ?? detail.nama_latin ?? `Surah ${surahNumber}`;
  const arabic = detail.nama ?? '';
  const arti = detail.arti ?? '';
  const jumlahAyat = detail.jumlahAyat ?? detail.jumlah_ayat ?? 0;
  const tempat = detail.tempatTurun ?? detail.tempat_turun ?? '';
  const ayatList = detail.ayat ?? [];

  const playingAyah =
    current?.surahNumber === surahNumber ? current.ayahNumber : null;

  return (
    <>
      <SEO
        title={`Surah ${namaLatin}`}
        description={arti}
      />

      <div className="container-page py-6 sm:py-8 max-w-4xl">
        <Link
          to="/quran"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-emerald-deep mb-4"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Kembali ke daftar surah
        </Link>

        <header
          ref={headerRef}
          className="card overflow-hidden mb-5 border-none"
          style={{
            background: 'linear-gradient(135deg, #0F3D32 0%, #176B5B 100%)',
          }}
        >
          <div className="p-6 sm:p-8 text-center text-white relative">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold/10 blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative">
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <Badge className="!bg-white/15 !text-white">
                  Surah ke-{surahNumber}
                </Badge>
                <Badge className="!bg-white/15 !text-white">
                  {jumlahAyat} ayat
                </Badge>
                {tempat && (
                  <Badge className="!bg-white/15 !text-white">{tempat}</Badge>
                )}
              </div>

              <div className="font-arabic text-5xl sm:text-6xl text-gold mb-3 leading-none">
                {arabic}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">
                {namaLatin}
              </h1>
              <p className="text-white/80 text-sm">{arti}</p>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <ReaderToolbar />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HiOutlineArrowDownTray />}
              onClick={handleDownloadAudio}
              className="hidden sm:inline-flex"
            >
              Audio Full
            </Button>
          </div>

          <div className="text-xs text-ink-pale hidden sm:block">
            <HiOutlineSpeakerWave className="inline h-3.5 w-3.5 mr-1" />
            Ketuk ikon putar di ayat untuk mendengarkan
          </div>
        </div>

        {ayatList.length === 0 ? (
          <ErrorState
            title="Ayat tidak ditemukan"
            description="Data surah kosong."
            onRetry={reload}
          />
        ) : (
          <div className="space-y-4">
            {ayatList.map((ayah) => (
              <AyahCard
                key={ayah.nomorAyat}
                ayah={ayah}
                surahNumber={detail.nomor}
                surahName={namaLatin}
                playlist={playlist}
                prefs={prefs}
                tafsir={tafsirMap[ayah.nomorAyat]}
                isPlaying={isPlaying}
                isCurrent={playingAyah === ayah.nomorAyat}
                isBookmarked={isBookmarked(surahNumber, ayah.nomorAyat)}
                onPlay={handlePlay}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        <nav className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={!prevSurah}
            onClick={() => prevSurah && navigate(`/quran/${prevSurah}`)}
            leftIcon={<HiOutlineArrowLeft />}
          >
            {prevSurah ? `Surah ${prevSurah}` : 'Awal'}
          </Button>
          <Button
            variant="outline"
            disabled={!nextSurah}
            onClick={() => nextSurah && navigate(`/quran/${nextSurah}`)}
            rightIcon={<HiOutlineArrowRight />}
          >
            {nextSurah ? `Surah ${nextSurah}` : 'Akhir'}
          </Button>
        </nav>

        <div className="h-32" />
      </div>
    </>
  );
}