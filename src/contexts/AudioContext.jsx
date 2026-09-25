import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { DEFAULT_QARI_ID, QARI_LIST, STORAGE_KEYS } from '../config/constants';

const AudioContext = createContext(null);

/**
 * Global audio player.
 * - Per ayat (audio.audio[qariId]) atau full surah (fallback).
 * - Next / prev antar ayat dalam surah.
 * - Otomatis lanjut ke surah berikutnya saat ayat terakhir selesai.
 * - Repeat: off | one | all
 * - Shuffle sederhana
 * - Media Session API
 */
export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [audioPrefs, setAudioPrefs] = useLocalStorage(STORAGE_KEYS.AUDIO_PREFS, {
    qariId: DEFAULT_QARI_ID,
    volume: 0.9,
    playbackRate: 1,
    repeat: 'off',   // 'off' | 'one' | 'all'
    shuffle: false,
  });

  const [current, setCurrent] = useState(null);
  // current = {
  //   surahNumber, surahName, ayahNumber,
  //   audioUrl, qariId, qariName,
  //   playlist: [{ ayahNumber, audioUrl }], // semua ayat surah ini
  // }

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  /* =====================================================
     Init <audio> element sekali
     ===================================================== */
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = audioPrefs.volume;
    audio.playbackRate = audioPrefs.playbackRate;
    audioRef.current = audio;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
      setIsLoading(false);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onErr = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Gagal memutar audio');
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onErr);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onErr);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     Sinkronisasi preferensi
     ===================================================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = audioPrefs.volume;
    audio.playbackRate = audioPrefs.playbackRate;
  }, [audioPrefs.volume, audioPrefs.playbackRate]);

  /* =====================================================
     Internal: mainkan satu URL
     ===================================================== */
  const playUrl = useCallback(async (url) => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setIsLoading(true);
      setError(null);
      audio.pause();
      audio.src = url;
      audio.currentTime = 0;
      await audio.play();
    } catch (err) {
      setError(err.message || 'Autoplay diblokir');
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  /* =====================================================
     API PUBLIK
     ===================================================== */

  /**
   * playAyah({ surahNumber, surahName, ayahNumber, audioMap, playlist })
   * audioMap  = { '01': 'url', '02': 'url', ... }  (dari API: ayah.audio)
   * playlist  = [{ nomorAyat, audio }] untuk navigasi next/prev
   */
  const playAyah = useCallback(
    async ({ surahNumber, surahName, ayahNumber, audioMap, playlist }) => {
      const qariId = audioPrefs.qariId;
      const url = audioMap?.[qariId];
      if (!url) {
        setError('Audio qari tidak tersedia untuk ayat ini');
        return;
      }
      const qariName = QARI_LIST.find((q) => q.id === qariId)?.name ?? '';

      setCurrent({
        surahNumber,
        surahName,
        ayahNumber,
        audioUrl: url,
        qariId,
        qariName,
        playlist: playlist ?? [],
      });
      await playUrl(url);
    },
    [audioPrefs.qariId, playUrl]
  );

  /**
   * playFullSurah({ surahNumber, surahName, audioUrl, qariName })
   */
  const playFullSurah = useCallback(
    async ({ surahNumber, surahName, audioUrl, qariName }) => {
      setCurrent({
        surahNumber,
        surahName,
        ayahNumber: 1,
        audioUrl,
        qariId: audioPrefs.qariId,
        qariName: qariName ?? '',
        playlist: [],
        isFullSurah: true,
      });
      await playUrl(audioUrl);
    },
    [audioPrefs.qariId, playUrl]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    try {
      await audio.play();
    } catch (err) {
      setError(err.message || 'Gagal melanjutkan audio');
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else resume();
  }, [isPlaying, pause, resume]);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const setQari = useCallback(
    (qariId) => {
      setAudioPrefs((prev) => ({ ...prev, qariId }));
    },
    [setAudioPrefs]
  );

  const setVolume = useCallback(
    (v) => setAudioPrefs((prev) => ({ ...prev, volume: v })),
    [setAudioPrefs]
  );

  const setPlaybackRate = useCallback(
    (r) => setAudioPrefs((prev) => ({ ...prev, playbackRate: r })),
    [setAudioPrefs]
  );

  const cycleRepeat = useCallback(() => {
    setAudioPrefs((prev) => {
      const order = ['off', 'all', 'one'];
      const next = order[(order.indexOf(prev.repeat) + 1) % order.length];
      return { ...prev, repeat: next };
    });
  }, [setAudioPrefs]);

  const toggleShuffle = useCallback(
    () => setAudioPrefs((prev) => ({ ...prev, shuffle: !prev.shuffle })),
    [setAudioPrefs]
  );

  /* =====================================================
     Navigasi next / prev antar ayat
     ===================================================== */
  const goToOffset = useCallback(
    async (offset) => {
      if (!current || !current.playlist?.length) return;

      const { playlist, ayahNumber, surahNumber, surahName } = current;

      if (audioPrefs.shuffle) {
        const pool = playlist.filter((p) => p.nomorAyat !== ayahNumber);
        if (!pool.length) return;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        await playAyah({
          surahNumber,
          surahName,
          ayahNumber: pick.nomorAyat,
          audioMap: pick.audio ?? buildAudioMapFromPlaylist(pick),
          playlist,
        });
        return;
      }

      const idx = playlist.findIndex((p) => p.nomorAyat === ayahNumber);
      const nextIdx = idx + offset;

      if (nextIdx >= 0 && nextIdx < playlist.length) {
        const target = playlist[nextIdx];
        await playAyah({
          surahNumber,
          surahName,
          ayahNumber: target.nomorAyat,
          audioMap: target.audio ?? buildAudioMapFromPlaylist(target),
          playlist,
        });
      } else if (nextIdx >= playlist.length) {
        // akhir surah: lanjut surah berikutnya bila repeat !== 'one'
        if (audioPrefs.repeat === 'one') return;
        // Caller (reader) yang tahu surah berikutnya; kita ekspos event sederhana.
        // Di sini kita hanya pause; reader yang akan memanggil next surah via efek.
        pause();
      } else {
        // prev sebelum ayat 1 → biarkan di ayat 1
        await playAyah({
          surahNumber,
          surahName,
          ayahNumber: playlist[0].nomorAyat,
          audioMap: playlist[0].audio ?? buildAudioMapFromPlaylist(playlist[0]),
          playlist,
        });
      }
    },
    [current, audioPrefs.shuffle, audioPrefs.repeat, playAyah, pause]
  );

  const next = useCallback(() => goToOffset(1), [goToOffset]);
  const prev = useCallback(() => goToOffset(-1), [goToOffset]);

  /* =====================================================
     Auto-lanjut saat audio selesai
     ===================================================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      setIsPlaying(false);
      if (audioPrefs.repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (audioPrefs.repeat === 'all' || true) {
        // default: lanjut ke ayat berikutnya
        next();
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [audioPrefs.repeat, next]);

  /* =====================================================
     Media Session API
     ===================================================== */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: `${current.surahName} : ${current.ayahNumber}`,
        artist: current.qariName || 'Mishbah',
        album: 'Al-Qur\'an',
      });
      navigator.mediaSession.setActionHandler('play', () => resume());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => next());
    } catch {
      /* ignore */
    }
  }, [current, resume, pause, prev, next]);

  /* =====================================================
     Context value
     ===================================================== */
  const value = useMemo(
    () => ({
      // state
      current,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      error,
      prefs: audioPrefs,

      // actions
      playAyah,
      playFullSurah,
      pause,
      resume,
      toggle,
      stop,
      seek,
      next,
      prev,
      setQari,
      setVolume,
      setPlaybackRate,
      cycleRepeat,
      toggleShuffle,
    }),
    [
      current,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      error,
      audioPrefs,
      playAyah,
      playFullSurah,
      pause,
      resume,
      toggle,
      stop,
      seek,
      next,
      prev,
      setQari,
      setVolume,
      setPlaybackRate,
      cycleRepeat,
      toggleShuffle,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

/* Helper: ubah playlist entry menjadi audioMap */
function buildAudioMapFromPlaylist(entry) {
  if (entry?.audio) return entry.audio;
  return {};
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio harus dipakai di dalam <AudioProvider>');
  return ctx;
}

export default AudioContext;