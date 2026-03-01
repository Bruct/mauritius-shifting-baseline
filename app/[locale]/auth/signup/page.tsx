'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/lib/i18n/routing';
import { Fish } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    organization: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Create profile
    if (data.user) {
      const profile = { id: data.user.id, full_name: form.full_name || null, organization: form.organization || null, role: 'collector' };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from('profiles').insert(profile as any);
    }

    router.push('/testimonies/submit');
  };

  return (
    <div className="min-h-screen bg-deep-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ocean-400/20 mb-4">
            <Fish className="h-7 w-7 text-ocean-300" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">{t('signup_title')}</h1>
          <p className="text-ocean-300 text-sm mt-1">{t('signup_subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'full_name', label: t('full_name'), type: 'text', placeholder: 'Jean-Pierre Dupont', required: false },
              { name: 'email', label: t('email'), type: 'email', placeholder: 'your@email.com', required: true },
              { name: 'password', label: t('password'), type: 'password', placeholder: '••••••••', required: true },
              { name: 'organization', label: t('organization'), type: 'text', placeholder: 'Reef Conservation Mauritius', required: false },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-ocean-700 mb-1.5">
                  {field.label}
                  {!field.required && <span className="text-ocean-400 ml-1 font-normal">(optional)</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 text-ocean-900 placeholder:text-ocean-300 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 outline-none transition-all"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {error && (
              <p className="text-sm text-coral-600 bg-coral-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ocean-500 hover:bg-ocean-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? '...' : t('signup_btn')}
            </button>
          </form>

          <p className="text-center text-sm text-ocean-500 mt-5">
            {t('has_account')}{' '}
            <Link href="/auth/login" className="text-ocean-600 hover:text-ocean-800 font-medium">
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
