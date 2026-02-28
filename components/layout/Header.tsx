'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Menu, X, Fish, Globe } from 'lucide-react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { UserMenu } from './UserMenu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/map', label: t('map') },
    { href: '/species', label: t('species') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ocean-200/50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-gradient shadow-sm group-hover:shadow-ocean-400/30 transition-shadow">
              <Fish className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-sm font-bold text-ocean-900 leading-tight block">
                Shifting Baseline
              </span>
              <span className="text-xs text-ocean-500 leading-tight">
                {t('tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-ocean-50 text-ocean-700'
                    : 'text-ocean-600 hover:bg-ocean-50 hover:text-ocean-700',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LocaleSwitcher currentLocale={locale} />
            <UserMenu />
            <Link
              href="/testimonies/submit"
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-ocean-500 px-3 py-2 text-sm font-medium text-white hover:bg-ocean-600 transition-colors"
            >
              <span>+</span>
              <span>{t('submit')}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-ocean-600 hover:bg-ocean-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ocean-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm font-medium',
                pathname === link.href
                  ? 'bg-ocean-50 text-ocean-700'
                  : 'text-ocean-600',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/testimonies/submit"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg bg-ocean-500 text-sm font-medium text-white text-center mt-2"
          >
            {t('submit')}
          </Link>
        </div>
      )}
    </header>
  );
}
