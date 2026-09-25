/**
 * Konfigurasi Download Aplikasi Android (Flutter Part 2)
 *
 * Cara pakai:
 * 1. Siapkan file APK Flutter Anda
 * 2. Taruh di salah satu:
 *    - /public/mishbah.apk         → URL: '/mishbah.apk'
 *    - /public/app/mishbah.apk     → URL: '/app/mishbah.apk'
 *    - GitHub Releases / CDN       → URL lengkap
 * 3. Ubah APK_URL di bawah
 * 4. Restart dev server
 */

export const APP_DOWNLOAD = {
  // ==== KONFIGURASI ====
  APK_URL: '/mishbah-2.0.0.apk', // ← ganti kalau perlu
  VERSION: '2.0.0',        // versi APK
  SIZE_LABEL: '',          // kosongkan → tidak ditampilkan; isi manual kalau mau (mis. "45 MB")
  RELEASE_DATE: '',        // kosongkan → auto; atau isi '2026-01-15'
  MIN_ANDROID: '8.0',      // minimum versi Android
  IS_READY: false,         // ← UBAH KE `true` kalau APK sudah siap

  // ==== TEKS TAMPILAN ====
  TITLE: 'Mishbah untuk Android',
  TAGLINE: 'Bawa Al-Qur\'an di saku Anda',
  DESCRIPTION:
    'Aplikasi Android dengan notifikasi adzan, alarm sholat, dan audio background — fitur yang tidak tersedia di versi web.',
  FEATURES: [
    {
      title: 'Notifikasi Adzan Otomatis',
      desc: 'Dapatkan pengingat sholat tepat waktu, bahkan saat aplikasi tertutup.',
    },
    {
      title: 'Alarm Sholat',
      desc: 'Alarm yang membangunkan Anda untuk sholat Subuh dan tahajud.',
    },
    {
      title: 'Audio Background',
      desc: 'Dengarkan murottal sambil melakukan aktivitas lain.',
    },
    {
      title: 'Download Offline',
      desc: 'Simpan audio qari untuk didengarkan tanpa koneksi internet.',
    },
    {
      title: 'Widget Layar Utama',
      desc: 'Lihat waktu sholat berikutnya langsung di home screen.',
    },
    {
      title: 'Sinkronisasi Cloud',
      desc: 'Bookmark & last read tersinkron dengan akun Mishbah Anda.',
    },
  ],
};