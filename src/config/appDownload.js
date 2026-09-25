export const APP_DOWNLOAD = {
  // ==== KONFIGURASI ====
  APK_URL: '/mishbah-2.0.0.apk',   // ← sesuai nama file
  VERSION: '2.0.0',
  SIZE_LABEL: '63.5 MB',           // ← sudah diisi
  RELEASE_DATE: '25 September 2026',                // ← isi manual kalau mau, mis. '25 September 2026'
  MIN_ANDROID: '8.0',
  IS_READY: true,                  // ← AKTIF

  // ==== TEKS TAMPILAN (biarkan sama) ====
  TITLE: 'Mishbah untuk Android',
  TAGLINE: "Bawa Al-Qur'an di saku Anda",
  DESCRIPTION:
    'Aplikasi Android dengan notifikasi adzan, alarm sholat, dan audio background — fitur yang tidak tersedia di versi web.',
  FEATURES: [
    { title: 'Notifikasi Adzan Otomatis', desc: 'Dapatkan pengingat sholat tepat waktu, bahkan saat aplikasi tertutup.' },
    { title: 'Alarm Sholat', desc: 'Alarm yang membangunkan Anda untuk sholat Subuh dan tahajud.' },
    { title: 'Audio Background', desc: 'Dengarkan murottal sambil melakukan aktivitas lain.' },
    { title: 'Download Offline', desc: 'Simpan audio qari untuk didengarkan tanpa koneksi internet.' },
    { title: 'Widget Layar Utama', desc: 'Lihat waktu sholat berikutnya langsung di home screen.' },
    { title: 'Sinkronisasi Cloud', desc: 'Bookmark & last read tersinkron dengan akun Mishbah Anda.' },
  ],
};
