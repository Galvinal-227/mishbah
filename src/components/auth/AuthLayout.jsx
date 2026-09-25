import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Kiri: branding (desktop) */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-deep to-emerald-main text-white p-10 relative overflow-hidden">
        {/* Ornamen */}
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl translate-y-1/3 -translate-x-1/3" />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold">
              <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
                <path
                  d="M32 9 L34.5 14 L38 15 L35 18 L36 22 L32 20 L28 22 L29 18 L26 15 L29.5 14 Z"
                  fill="currentColor"
                />
                <path
                  d="M22 26 Q32 22 42 26 L41 44 Q32 48 23 44 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <ellipse cx="32" cy="35" rx="6" ry="7.5" fill="currentColor" opacity="0.85" />
                <ellipse cx="32" cy="35" rx="3" ry="4" fill="#0F3D32" />
                <path
                  d="M24 48 L32 52 L40 48"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-none">
                {BRAND.name}
              </div>
              <div className="text-[11px] text-white/70 mt-0.5">
                {BRAND.tagline}
              </div>
            </div>
          </Link>
        </div>

        <div className="relative max-w-md">
          <h2 className="font-display text-3xl font-semibold mb-3 leading-tight">
            {BRAND.taglineAlt}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Simpan bookmark, lanjutkan bacaan dari posisi terakhir, dan
            sinkronkan preferensi Anda di semua perangkat.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-white/70">
            <div>
              <div className="text-2xl font-display font-semibold text-gold">114</div>
              <div>Surah</div>
            </div>
            <div>
              <div className="text-2xl font-display font-semibold text-gold">6</div>
              <div>Qari</div>
            </div>
            <div>
              <div className="text-2xl font-display font-semibold text-gold">30</div>
              <div>Juz</div>
            </div>
          </div>
        </div>

        <div className="relative text-xs text-white/60">
          © {BRAND.year} {BRAND.name}. Data dari equran.id.
        </div>
      </div>

      {/* Kanan: form */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile brand */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-deep text-gold">
                <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
                  <ellipse cx="32" cy="35" rx="6" ry="7.5" fill="currentColor" />
                  <path
                    d="M22 26 Q32 22 42 26 L41 44 Q32 48 23 44 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-display text-lg font-semibold text-ink leading-none">
                  {BRAND.name}
                </div>
                <div className="text-[11px] text-ink-pale mt-0.5">
                  {BRAND.tagline}
                </div>
              </div>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-ink-muted mb-6">{subtitle}</p>
          )}

          {children}

          {footer && <div className="mt-6 text-sm text-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
}