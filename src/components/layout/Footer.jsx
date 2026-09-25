import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-ivory/70">
      <div className="container-page py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-deep text-gold">
              <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                <ellipse cx="32" cy="35" rx="6" ry="7.5" fill="currentColor" />
                <path
                  d="M22 26 Q32 22 42 26 L41 44 Q32 48 23 44 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <div className="font-display text-base font-semibold text-ink">
                {BRAND.name}
              </div>
              <div className="text-xs text-ink-pale">{BRAND.taglineAlt}</div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
            <Link to="/quran" className="hover:text-emerald-deep">
              Al-Qur'an
            </Link>
            <Link to="/search" className="hover:text-emerald-deep">
              Cari
            </Link>
            <Link to="/bookmarks" className="hover:text-emerald-deep">
              Bookmark
            </Link>
            <Link to="/settings" className="hover:text-emerald-deep">
              Pengaturan
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-5 border-t border-line text-xs text-ink-pale flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p>
            © {BRAND.year} {BRAND.name}. Data dari{' '}
            <a
              href="https://equran.id"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-muted hover:text-emerald-deep underline-offset-2 hover:underline"
            >
              equran.id
            </a>
            .
          </p>
          <p>Dibuat dengan niat baik untuk memudahkan tilawah.</p>
        </div>
      </div>
    </footer>
  );
}