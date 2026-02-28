'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/lib/i18n/routing';
import { Fish } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push(redirect as '/');
  };

  return (
    <div className="min-h-screen bg-deep-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ocean-400/20 mb-4">
            <Fish className="h-7 w-7 text-ocean-300" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">{t('login_title')}</h1>
          <p className="text-ocean-300 text-sm mt-1">{t('login_subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 text-ocean-900 placeholder:text-ocean-300 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1.5">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 text-ocean-900 placeholder:text-ocean-300 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-coral-600 bg-coral-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ocean-500 hover:bg-ocean-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? t('login_btn') + '...' : t('login_btn')}
            </button>
          </form>

          <p className="text-center text-sm text-ocean-500 mt-5">
            {t('no_account')}{' '}
            <Link href="/auth/signup" className="text-ocean-600 hover:text-ocean-800 font-medium">
              {t('sign_up')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
