import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/lib/i18n/routing';
import { MessageSquare, MapPin, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function getStats() {
  const supabase = await createClient();
  const [pending, published, rejected, locations, profiles] = await Promise.all([
    supabase.from('testimonies').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('testimonies').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('testimonies').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  return {
    pending: pending.count ?? 0,
    published: published.count ?? 0,
    rejected: rejected.count ?? 0,
    locations: locations.count ?? 0,
    collectors: profiles.count ?? 0,
  };
}

type RecentTestimony = {
  id: string;
  title: string;
  status: string | null;
  narrator_name: string | null;
  year_of_memory: number;
  created_at: string;
  locations: { name: string } | null;
};

async function getRecentTestimonies(): Promise<RecentTestimony[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonies')
    .select('id, title, status, narrator_name, year_of_memory, created_at, locations(name)')
    .order('created_at', { ascending: false })
    .limit(5);
  return (data as RecentTestimony[] | null) ?? [];
}

export default async function AdminDashboard() {
  const t = await getTranslations('admin');
  const [stats, recent] = await Promise.all([getStats(), getRecentTestimonies()]);

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    published: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-coral-100 text-coral-800',
    draft: 'bg-ocean-100 text-ocean-800',
  };

  return (
    <div className="min-h-screen bg-seafoam">
      <div className="bg-ocean-gradient px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-2xl font-bold text-white">{t('dashboard')}</h1>
          <p className="text-ocean-200 text-sm mt-1">Mauritius Shifting Baseline — Admin Portal</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Clock, value: stats.pending, label: t('pending'), color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: CheckCircle, value: stats.published, label: t('published'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: XCircle, value: stats.rejected, label: t('rejected'), color: 'text-coral-600', bg: 'bg-coral-50' },
            { icon: MapPin, value: stats.locations, label: t('total_locations'), color: 'text-ocean-600', bg: 'bg-ocean-50' },
            { icon: Users, value: stats.collectors, label: t('total_collectors'), color: 'text-ocean-600', bg: 'bg-ocean-50' },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} rounded-xl p-4 border border-ocean-100`}>
              <item.icon className={`h-5 w-5 ${item.color} mb-2`} strokeWidth={1.5} />
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-ocean-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Pending queue CTA */}
        {stats.pending > 0 && (
          <Link
            href="/admin/queue"
            className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">{stats.pending} testimonies awaiting review</p>
                <p className="text-sm text-amber-600">Click to open the review queue</p>
              </div>
            </div>
            <span className="text-amber-600 text-sm font-medium">Review →</span>
          </Link>
        )}

        {/* Recent testimonies */}
        <div className="bg-white rounded-2xl border border-ocean-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean-100 flex items-center justify-between">
            <h2 className="font-display font-semibold text-ocean-900">Recent Testimonies</h2>
            <Link href="/admin/queue" className="text-xs text-ocean-500 hover:text-ocean-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-ocean-50">
            {recent.map((t) => (
              <Link
                key={t.id}
                href={`/testimonies/${t.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-ocean-50 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-ocean-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ocean-900 truncate">{t.title}</p>
                  <p className="text-xs text-ocean-400">
                    {t.narrator_name ?? 'Anonymous'} · {t.year_of_memory} ·{' '}
                    {(t.locations as { name: string } | null)?.name}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[t.status ?? 'draft']}`}>
                  {t.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
