'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/routing';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'mfe', label: 'MFE', full: 'Kreol' },
] as const;

interface LocaleSwitcherProps {
  currentLocale: string;
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleChange = (locale: string) => {
    router.replace(pathname, { locale });
    setOpen(false);
  };

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-ocean-600 hover:bg-ocean-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-ocean-100 py-1 min-w-[120px]">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleChange(locale.code)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm hover:bg-ocean-50 transition-colors',
                  locale.code === currentLocale
                    ? 'text-ocean-700 font-medium'
                    : 'text-ocean-600',
                )}
              >
                <span className="font-mono text-xs mr-2">{locale.label}</span>
                {locale.full}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
