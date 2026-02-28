import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { SpeciesGrid } from '@/components/species/SpeciesGrid';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('species');
  return { title: t('title') };
}

async function getSpeciesWithCounts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('species')
    .select(`
      id, common_name_en, common_name_fr, common_name_mfe, scientific_name,
      species_type, image_url, description,
      testimony_species(count)
    `)
    .order('common_name_en');

  return (data ?? []).map((s) => ({
    ...s,
    testimony_count: (s.testimony_species as unknown as [{ count: number }])?.[0]?.count ?? 0,
  }));
}

export default async function SpeciesPage() {
  const t = await getTranslations('species');
  const species = await getSpeciesWithCounts();

  return (
    <div className="min-h-screen bg-seafoam">
      <div className="bg-ocean-gradient px-4 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-display text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-ocean-200">{t('subtitle')}</p>
          <div className="mt-4 text-ocean-300 text-sm">{species.length} species documented</div>
        </div>
      </div>
      <SpeciesGrid species={species} />
    </div>
  );
}
