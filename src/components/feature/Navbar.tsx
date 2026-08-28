import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/cv', label: t('nav.cv') },
    { to: '/research', label: t('nav.research') },
    { to: '/publications', label: t('nav.publications') },
    { to: '/teaching', label: t('nav.teaching') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-foreground-950 text-background-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-heading text-xl tracking-tight hover:text-primary-400 transition-colors">
            Daniel Alvarez Ramirez
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.to)
                    ? 'text-primary-400'
                    : 'text-background-300 hover:text-background-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              to="/admin"
              aria-label="Admin"
              title="Admin"
              className="w-9 h-9 flex items-center justify-center rounded-full text-background-300 hover:text-primary-400 hover:bg-background-800 transition-colors cursor-pointer"
            >
              <i className="ri-settings-3-line text-lg" />
            </Link>
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-xl`} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-background-800">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 text-sm font-medium transition-colors ${
                isActive(link.to) ? 'text-primary-400' : 'text-background-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="py-3">
            <LanguageSwitcher />
          </div>
          <Link
            to="/admin"
            className="block py-3 text-sm font-medium text-background-300 hover:text-primary-400 transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <i className="ri-settings-3-line mr-2" />
            {t('nav.admin')}
          </Link>
        </div>
      )}
    </nav>
  );
}