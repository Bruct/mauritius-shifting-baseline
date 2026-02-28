import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { AudioPlayer } from '@/components/testimony/AudioPlayer';
import { PhotoGallery } from '@/components/testimony/PhotoGallery';
import { SpeciesTags } from '@/components/testimony/SpeciesTags';
import { ArrowLeft, MapPin, User, Calendar, Globe } from 'lucide-react';
import { formatYear, formatDate, getSupabasePublicUrl } from '@/lib/utils';
import type { TestimonyFull } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

async function getTestimony(id: string): Promise<TestimonyFull | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonies')
    .select(`
      *,
      locations (*),
      testimony_media (*),
      testimony_species (*, species (*)),
      profiles (full_name, role, organization)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single();
  return data as TestimonyFull | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const testimony = await getTestimony(id);
  if (!testimony) return { title: 'Not found' };
  return { title: testimony.title };
}

export default async function TestimonyPage({ params }: PageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('testimony');
  const testimony = await getTestimony(id);

  if (!testimony) notFound();

  const photos = testimony.testimony_media?.filter((m) => m.media_type === 'photo') ?? [];
  const audios = testimony.testimony_media?.filter((m) => m.media_type === 'audio') ?? [];
  const speciesTags = testimony.testimony_species ?? [];

  const LANG_LABELS: Record<string, string> = { en: 'English', fr: 'Français', mfe: 'Kreol' };

  return (
    <div className="min-h-screen bg-seafoam">
      {/* Header */}
      <div className="bg-ocean-gradient">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-ocean-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-bold">
              {formatYear(testimony.year_of_memory, testimony.year_of_memory_end)}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-ocean-200 text-sm flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {LANG_LABELS[testimony.language] ?? testimony.language}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            {testimony.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-ocean-200">
            {testimony.narrator_name && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <strong className="text-white">{testimony.narrator_name}</strong>
                {testimony.narrator_age && `, ${testimony.narrator_age} ${t('age')}`}
                {testimony.narrator_profession && ` — ${testimony.narrator_profession}`}
              </span>
            )}
            {testimony.locations && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <Link
                  href={`/locations/${testimony.locations.id}`}
                  className="text-white hover:text-ocean-200 underline"
                >
                  {testimony.locations.name}
                </Link>
              </span>
            )}
            {testimony.collection_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(testimony.collection_date, locale)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Main testimony text */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-ocean-100">
          <blockquote className="text-ocean-800 text-lg leading-relaxed font-serif italic">
            &ldquo;{testimony.testimony_text}&rdquo;
          </blockquote>
        </div>

        {/* Audio recordings */}
        {audios.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-ocean-900 mb-3 flex items-center gap-2">
              🎙️ {t('audio')}
            </h2>
            <div className="space-y-3">
              {audios.map((audio) => (
                <AudioPlayer
                  key={audio.id}
                  src={getSupabasePublicUrl(audio.storage_path)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-ocean-900 mb-3">
              📷 {t('photos')}
            </h2>
            <PhotoGallery photos={photos} />
          </div>
        )}

        {/* Species */}
        {speciesTags.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-ocean-900 mb-3">
              🐠 {t('species_mentioned')}
            </h2>
            <SpeciesTags
              tags={speciesTags as any}
              locale={locale}
            />
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ocean-500">
              {['abundant', 'present', 'rare', 'absent'].map((p) => (
                <span key={p} className="flex items-center gap-1">
                  <span className="font-mono">
                    {p === 'abundant' ? '●●●' : p === 'present' ? '●●○' : p === 'rare' ? '●○○' : '○○○'}
                  </span>
                  {t(p as 'abundant' | 'present' | 'rare' | 'absent')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compare CTA */}
        {testimony.locations && (
          <div className="bg-ocean-50 rounded-2xl p-5 border border-ocean-100">
            <p className="text-sm text-ocean-700 mb-3">
              Curious how this location has changed over time?
            </p>
            <Link
              href={`/locations/${testimony.locations.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-500 text-white text-sm font-medium rounded-lg hover:bg-ocean-600 transition-colors"
            >
              {t('compare')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
