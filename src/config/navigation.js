import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlineBookmark,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineDevicePhoneMobile,
} from 'react-icons/hi2';

export const NAV_LINKS = [
  { to: '/', label: 'Beranda', icon: HiOutlineHome },
  { to: '/quran', label: "Al-Qur'an", icon: HiOutlineBookOpen },
  { to: '/search', label: 'Cari', icon: HiOutlineMagnifyingGlass },
  { to: '/bookmarks', label: 'Bookmark', icon: HiOutlineBookmark },
  { to: '/last-read', label: 'Terakhir', icon: HiOutlineClock },
  { to: '/download', label: 'Android', icon: HiOutlineDevicePhoneMobile },
];

export const MOBILE_NAV = [
  { to: '/', label: 'Beranda', icon: HiOutlineHome },
  { to: '/quran', label: "Qur'an", icon: HiOutlineBookOpen },
  { to: '/search', label: 'Cari', icon: HiOutlineMagnifyingGlass },
  { to: '/profile', label: 'Profil', icon: HiOutlineUser },
];

export const USER_MENU = [
  { to: '/profile', label: 'Profil', icon: HiOutlineUser },
  { to: '/download', label: 'Download App', icon: HiOutlineDevicePhoneMobile },
  { to: '/settings', label: 'Pengaturan', icon: HiOutlineCog6Tooth },
];