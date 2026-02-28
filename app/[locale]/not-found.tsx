import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Fish } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Fish className="h-16 w-16 text-ocean-200 mx-auto mb-4" strokeWidth={1} />
        <h2 className="font-display text-2xl font-bold text-ocean-900 mb-2">404 — {t('not_found')}</h2>
        <p className="text-ocean-500 mb-6">This page has drifted away with the tide.</p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-ocean-500 text-white font-medium rounded-xl hover:bg-ocean-600 transition-colors"
        >
          {t('back_home')}
        </Link>
      </div>
    </div>
  );
}
