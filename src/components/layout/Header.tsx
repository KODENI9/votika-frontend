import { Link, NavLink } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { Vote } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const Header = () => {
  const { user } = useUser();
  const navItems = [
    { to: '/', label: 'Accueil' },
    { to: '/leaderboard', label: 'Classement' },
    { to: '/about', label: 'À propos' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[var(--color-text)] hover:no-underline">
            <div className="bg-[var(--color-brand)] rounded-lg p-1.5">
              <Vote className="h-5 w-5 text-white" />
            </div>
            <span>Votika</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[var(--color-brand)] hover:no-underline ${
                    isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="primary" size="sm">
                  Connexion
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              {user?.publicMetadata?.role === 'admin' && (
                <Link to="/dashboard/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9',
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};
