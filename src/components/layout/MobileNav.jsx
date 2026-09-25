import { NavLink } from 'react-router-dom';
import { MOBILE_NAV } from '../../config/navigation';
import { cn } from '../../utils/cn';

export default function MobileNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-ivory/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigasi utama"
    >
      <ul className="grid grid-cols-4">
        {MOBILE_NAV.map(({ to, label, icon: IconCmp }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium',
                  isActive ? 'text-emerald-deep' : 'text-ink-muted'
                )
              }
            >
              <IconCmp className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}