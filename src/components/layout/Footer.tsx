import { Link } from 'react-router-dom';
import { Vote, Globe, Share2, Image } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1c1917] text-gray-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white hover:no-underline">
            <div className="bg-[var(--color-brand)] rounded-lg p-1.5">
              <Vote className="h-5 w-5 text-white" />
            </div>
            <span>Votika</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/terms" className="hover:text-white transition-colors hover:no-underline">Conditions d'utilisation</Link>
            <Link to="/privacy" className="hover:text-white transition-colors hover:no-underline">Confidentialité</Link>
            <Link to="/cookies" className="hover:text-white transition-colors hover:no-underline">Cookies</Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Site web" className="hover:text-white transition-colors">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Partager" className="hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Galerie" className="hover:text-white transition-colors">
              <Image className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Votika. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};
