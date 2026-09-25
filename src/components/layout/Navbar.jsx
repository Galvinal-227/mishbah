import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { NAV_LINKS } from '../../config/navigation';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src="/logo.png"
        alt={BRAND.name}
        className="h-10 w-10 object-contain rounded-xl shadow-soft transition-transform group-hover:scale-105"
        loading="eager"
        decoding="async"
      />
      <div className="hidden sm:block">
        <div className="font-display text-lg font-semibold text-ink leading-none">
          {BRAND.name}
        </div>
        <div className="text-[11px] text-ink-pale leading-tight mt-0.5">
          {BRAND.tagline}
        </div>
      </div>
    </Link>
  );
}

export default function Navbar({ onOpenCommand }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Berhasil logout');
      navigate('/');
    } catch (err) {
      toast.error(err?.message || 'Gagal logout');
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-ivory/85 backdrop-blur-md border-b border-line shadow-soft'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Brand />

        {/* Navigasi desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: IconCmp }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-soft text-emerald-deep'
                    : 'text-ink-muted hover:bg-emerald-soft/50 hover:text-emerald-deep'
                )
              }
            >
              <IconCmp className="h-[18px] w-[18px]" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Aksi kanan */}
        <div className="flex items-center gap-2">
          {/* Command palette trigger */}
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              aria-label="Buka pencarian cepat (Ctrl+K)"
              className={cn(
                'hidden sm:flex items-center gap-2 rounded-xl border border-line bg-white',
                'px-3 py-1.5 text-xs text-ink-pale hover:border-emerald-main/40 hover:text-emerald-deep',
                'transition-colors'
              )}
            >
              <HiOutlineMagnifyingGlass className="h-3.5 w-3.5" />
              <span>Cari cepat</span>
              <kbd className="rounded border border-line bg-line-soft px-1.5 py-0.5 text-[10px] font-medium">
                Ctrl K
              </kbd>
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-1.5 hover:border-emerald-main/40 transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-main text-white text-xs font-semibold">
                  {(user.displayName || user.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <span className="hidden sm:block text-sm text-ink max-w-[120px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-line bg-white shadow-card p-1.5"
                  >
                    <div className="px-3 py-2 border-b border-line mb-1">
                      <div className="text-xs text-ink-pale">Masuk sebagai</div>
                      <div className="text-sm font-medium text-ink truncate">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-emerald-soft/60"
                    >
                      <HiOutlineUser className="h-4 w-4" /> Profil
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-emerald-soft/60"
                    >
                      <HiOutlineCog6Tooth className="h-4 w-4" /> Pengaturan
                    </Link>

                    <div className="my-1 h-px bg-line" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Masuk
              </Button>
              <Button as={Link} to="/register" variant="primary" size="sm">
                Daftar
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}