import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SubmissionWizard } from '@/components/submission/SubmissionWizard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('submission');
  return { title: t('title') };
}

type SpeciesRow = {
  id: string;
  common_name_en: string | null;
  common_name_fr: string | null;
  common_name_mfe: string | null;
  scientific_name: string | null;
  species_type: string | null;
};

type LocationRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

async function getSpecies(): Promise<SpeciesRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('species')
    .select('id, common_name_en, common_name_fr, common_name_mfe, scientific_name, species_type')
    .order('common_name_en');
  return (data as SpeciesRow[] | null) ?? [];
}

async function getLocations(): Promise<LocationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('locations')
    .select('id, name, latitude, longitude')
    .order('name');
  return (data as LocationRow[] | null) ?? [];
}

export default async function SubmitPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ locationId?: string }>;
}) {
  const { locale } = await params;
  const { locationId } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login?redirect=/${locale}/testimonies/submit`);

  const [species, locations] = await Promise.all([getSpecies(), getLocations()]);

  return (
    <div className="min-h-screen bg-seafoam">
      <SubmissionWizard
        species={species}
        existingLocations={locations}
        defaultLocationId={locationId}
        locale={locale}
        userId={user.id}
      />
    </div>
  );
}
