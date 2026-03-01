import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { TestimonyCard } from '@/components/testimony/TestimonyCard';
import { ArrowLeft, MapPin, MessageSquare } from 'lucide-react';
import { formatYear } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

async function getLocation(id: string) {
  const supabase = await createClient();
  const [locationRes, testimoniesRes] = await Promise.all([
    supabase.from('locations').select('*').eq('id', id).single(),
    supabase
      .from('testimonies')
      .select(`
        id, title, testimony_text, narrator_name, narrator_profession,
        year_of_memory, year_of_memory_end, language, created_at,
        testimony_media (id, media_type)
      `)
      .eq('location_id', id)
      .eq('status', 'published')
      .order('year_of_memory', { ascending: true }),
  ]);
  return {
    location: locationRes.data,
    testimonies: testimoniesRes.data ?? [],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { location } = await getLocation(id);
  if (!location) return { title: 'Not found' };
  return { title: location.name };
}

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const { location, testimonies } = await getLocation(id);

  if (!location) notFound();

  // Group testimonies by decade for timeline
  const byDecade = testimonies.reduce<Record<number, typeof testimonies>>((acc, t) => {
    const decade = Math.floor(t.year_of_memory / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(t);
    return acc;
  }, {});

  const decades = Object.keys(byDecade)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-seafoam">
      {/* Hero */}
      <div className="bg-ocean-gradient">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-ocean-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to map
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-coral-300" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {location.name}
            </h1>
          </div>
          {location.description && (
            <p className="text-ocean-200 mt-2 text-sm">{location.description}</p>
          )}
          <div className="flex items-center gap-2 mt-4">
            <span className="flex items-center gap-1.5 text-sm text-ocean-200">
              <MessageSquare className="h-4 w-4" />
              {testimonies.length} {testimonies.length === 1 ? 'testimony' : 'testimonies'}
            </span>
            {decades.length > 0 && (
              <span className="text-sm text-ocean-300">
                · {formatYear(decades[0] * 10 + 0, undefined)} – {formatYear(decades[decades.length - 1] * 10 + 9, undefined)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {decades.length === 0 ? (
          <div className="text-center py-12 text-ocean-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No testimonies for this location yet.</p>
            <Link
              href={`/testimonies/submit?locationId=${id}`}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-ocean-500 text-white text-sm font-medium rounded-lg hover:bg-ocean-600"
            >
              Be the first to share a memory
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {decades.map((decade) => (
              <div key={decade}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-ocean-200" />
                  <span className="text-sm font-bold text-ocean-600 bg-ocean-100 px-3 py-1 rounded-full">
                    {decade}s
                  </span>
                  <div className="h-px flex-1 bg-ocean-200" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {byDecade[decade].map((testimony) => (
                    <TestimonyCard
                      key={testimony.id}
                      testimony={{
                        ...testimony,
                        testimony_media: testimony.testimony_media,
                        locations: { id, name: location.name, latitude: location.latitude, longitude: location.longitude },
                      } as any}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add testimony CTA */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-ocean-100 text-center">
          <p className="text-ocean-600 mb-4">Do you have a memory from {location.name}?</p>
          <Link
            href={`/testimonies/submit?locationId=${id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ocean-500 text-white font-medium rounded-xl hover:bg-ocean-600 transition-colors"
          >
            Share your testimony
          </Link>
        </div>
      </div>
    </div>
  );
}
