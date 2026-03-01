import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MapView } from '@/components/map/MapView';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('map');
  return { title: t('title') };
}

type LocationWithRawCount = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  testimonies: { count: number }[];
};

async function getLocationsWithCounts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('locations')
    .select(`
      id, name, description, latitude, longitude, created_at,
      testimonies(count)
    `);

  return ((data as LocationWithRawCount[] | null) ?? []).map((loc) => ({
    ...loc,
    testimony_count: loc.testimonies?.[0]?.count ?? 0,
    created_by: null,
  }));
}

export default async function MapPage() {
  const t = await getTranslations('map');
  const locations = await getLocationsWithCounts();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-ocean-100">
        <div>
          <h1 className="font-display font-bold text-ocean-900 text-lg">{t('title')}</h1>
          <p className="text-sm text-ocean-500">{t('subtitle')}</p>
        </div>
        <span className="text-xs font-medium text-ocean-400 bg-ocean-50 px-2.5 py-1 rounded-full">
          {locations.length} locations
        </span>
      </div>
      <div className="flex-1">
        <MapView locations={locations} />
      </div>
    </div>
  );
}
