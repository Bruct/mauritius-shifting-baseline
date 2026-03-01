'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function UserMenu() {
  const t = useTranslations('nav');
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from('profiles') as any)
          .select('full_name, role')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }: { data: { full_name: string | null } | null }) => {
            setUser({
              email: data.user!.email ?? '',
              name: profile?.full_name ?? null,
            });
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    window.location.reload();
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-ocean-600 hover:bg-ocean-50 transition-colors"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{t('login')}</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-ocean-600 hover:bg-ocean-50 transition-colors"
      >
        <div className="h-6 w-6 rounded-full bg-ocean-100 flex items-center justify-center">
          <span className="text-xs font-bold text-ocean-700">
            {(user.name ?? user.email)[0].toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:inline max-w-[100px] truncate">
          {user.name ?? user.email}
        </span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-ocean-100 py-1 min-w-[160px]">
            <div className="px-3 py-2 border-b border-ocean-50">
              <p className="text-xs text-ocean-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ocean-600 hover:bg-ocean-50"
            >
              <Settings className="h-4 w-4" />
              {t('admin')}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-coral-600 hover:bg-coral-50"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
