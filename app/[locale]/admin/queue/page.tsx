import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ReviewCard } from '@/components/admin/ReviewCard';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/i18n/routing';

export const metadata: Metadata = { title: 'Review Queue' };

async function getPendingTestimonies() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonies')
    .select(`
      id, title, testimony_text, narrator_name, narrator_age, narrator_profession,
      year_of_memory, year_of_memory_end, language, status, created_at,
      locations (id, name),
      testimony_media (id, media_type, storage_path),
      testimony_species (species_id, presence, species (common_name_en))
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  return data ?? [];
}

export default async function ReviewQueuePage() {
  const testimonies = await getPendingTestimonies();

  return (
    <div className="min-h-screen bg-seafoam">
      <div className="bg-ocean-gradient px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-ocean-200 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Review Queue</h1>
          <p className="text-ocean-200 text-sm mt-1">
            {testimonies.length} {testimonies.length === 1 ? 'testimony' : 'testimonies'} awaiting review
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        {testimonies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-ocean-100">
            <p className="text-ocean-400">No testimonies pending review. All clear! 🌊</p>
          </div>
        ) : (
          testimonies.map((t) => <ReviewCard key={t.id} testimony={t as any} />)
        )}
      </div>
    </div>
  );
}
