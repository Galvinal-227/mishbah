export const API_BASE = 'https://equran.id/api/v2';
export const REVERSE_GEOCODE_BASE =
  'https://api.bigdatacloud.net/data/reverse-geocode-client';

export const QARI_LIST = [
  { id: '01', name: 'Abdullah Al-Juhany', code: 'Abdullah-Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim', code: 'Abdul-Muhsin-Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais', code: 'Abdurrahman-as-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari', code: 'Ibrahim-Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasy', code: 'Misyari-Rasyid-Al-Afasi' },
  { id: '06', name: 'Yasser Al-Dosari', code: 'Yasser-Al-Dosari' },
];

export const DEFAULT_QARI_ID = '06';

export const PRAYER_KEYS = [
  { key: 'imsak', label: 'Imsak' },
  { key: 'subuh', label: 'Subuh' },
  { key: 'terbit', label: 'Terbit' },
  { key: 'dhuha', label: 'Dhuha' },
  { key: 'dzuhur', label: 'Dzuhur' },
  { key: 'ashar', label: 'Ashar' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isya', label: 'Isya' },
];

export const MAIN_PRAYERS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

export const STORAGE_KEYS = {
  LOCATION: 'mishbah.location',
  LAST_READ: 'mishbah.lastRead',
  BOOKMARKS_GUEST: 'mishbah.bookmarks.guest',
  READING_PREFS: 'mishbah.readingPrefs',
  AUDIO_PREFS: 'mishbah.audioPrefs',
  PRAYER_CACHE_PREFIX: 'mishbah.prayer.',
};