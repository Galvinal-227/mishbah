# Mishbah

> Baca Al-Qur'an dengan tenang — Lentera petunjuk dari Al-Qur'an.

Website Al-Qur'an modern dengan terjemahan, tafsir, audio qari, dan jadwal sholat.

## ✨ Fitur

- 📖 **114 surah** lengkap dengan teks Arab, Latin, dan terjemahan Indonesia
- 🎧 **Audio per ayat** dengan 6 pilihan qari
- 📚 **Tafsir** per ayat (expandable)
- 🕌 **Jadwal sholat** lengkap (8 waktu) + countdown + deteksi lokasi otomatis
- 🔖 **Bookmark** ayat (tersinkron ke cloud jika login)
- ⏱️ **Last Read** — lanjutkan bacaan dari posisi terakhir
- 🔍 **Pencarian** surah & ayat + Command Palette (Ctrl+K)
- ⚙️ **Reading preferences** — ukuran font, line height, font Arab, toggle tampilan
- 🌙 **Satu tema Islami** yang konsisten (tanpa dark mode)
- 📱 **Responsive** penuh (mobile, tablet, desktop)
- 🎨 **Animasi halus** dengan GSAP + Lenis smooth scroll
- 🔐 **Autentikasi** Firebase (email/password + Google)
- 📲 **PWA** — installable, offline shell
- ♿ **Aksesibel** — semantic HTML, focus states, reduced motion support

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (satu tema Islami)
- **React Router 6**
- **Firebase** (Auth + Firestore)
- **GSAP** + **Lenis** (animasi & smooth scroll)
- **react-icons** (Heroicons v2)

## 📡 Sumber Data

- **Al-Qur'an & Tafsir** — [equran.id API v2](https://equran.id/apidev/v2)
- **Jadwal Sholat** — [equran.id API v2](https://equran.id/apidev/v2)
- **Reverse Geocoding** — [BigDataCloud](https://www.bigdatacloud.com/)

## 🚀 Menjalankan Lokal

```bash
# 1. Clone repo
git clone <url-repo>
cd mishbah

# 2. Install dependencies
npm install

# 3. Copy env
cp .env.example .env
# Edit .env → isi Firebase config Anda

# 4. Jalankan dev server
npm run dev
Buka http://localhost:5173.

📦 Build Production
bash
npm run build
npm run preview
☁️ Deploy ke Vercel
bash
# Install Vercel CLI (sekali saja)
npm i -g vercel

# Deploy
vercel
Atau via Git: push ke GitHub → import di vercel.com/new.

Environment variables yang wajib di-set di Vercel:

text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
🔥 Firebase Setup
Buka Firebase Console → pilih project al-q-app

Authentication → aktifkan Email/Password & Google

Firestore Database → Create database → mode Production

Firestore Rules:

text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
Authentication → Settings → Authorized domains → tambahkan domain Vercel Anda

📁 Struktur
text
src/
├── components/       Komponen React (ui, layout, quran, prayer, audio, ...)
├── pages/            Halaman route
├── services/         API & Firebase wrapper
├── contexts/         Global state (Auth, Audio, ReadingPrefs, Location, UserData, Toast)
├── hooks/            Custom hooks
├── utils/            Helper functions
├── config/           Konstanta & branding
└── styles/           Tailwind + global CSS
🔐 Firestore Data Model
text
users/{uid}/
├── bookmarks/{surahNumber}:{ayahNumber}
│   └── { surahNumber, surahName, ayahNumber, teksArab, teksIndonesia, createdAt }
├── lastRead/current
│   └── { surahNumber, surahName, ayahNumber, updatedAt }
📝 Lisensi
MIT — bebas digunakan dan dimodifikasi untuk kebaikan.

🙏 Kredit
Data Al-Qur'an & Jadwal Sholat: equran.id

Ikon: Heroicons

Font Arab: Amiri Quran