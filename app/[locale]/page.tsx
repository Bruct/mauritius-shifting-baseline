import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { FeaturedTestimonies } from '@/components/home/FeaturedTestimonies';
import { MapPreview } from '@/components/home/MapPreview';
import { CallToAction } from '@/components/home/CallToAction';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('hero');
  return {
    title: t('title'),
  };
}

async function getStats() {
  const supabase = await createClient();
  const [{ count: testimonies }, { count: locations }, { count: species }] = await Promise.all([
    supabase.from('testimonies').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase.from('species').select('*', { count: 'exact', head: true }),
  ]);
  return {
    testimonies: testimonies ?? 0,
    locations: locations ?? 0,
    species: species ?? 0,
  };
}

async function getFeaturedTestimonies() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonies')
    .select(`
      id, title, testimony_text, narrator_name, narrator_profession,
      year_of_memory, year_of_memory_end, language, created_at,
      locations (id, name, latitude, longitude)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);
  return data ?? [];
}

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeaturedTestimonies()]);

  return (
    <div>
      <HeroSection />
      <StatsBar stats={stats} />
      <MapPreview />
      <FeaturedTestimonies testimonies={featured} />
      <CallToAction />
    </div>
  );
}
