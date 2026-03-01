import { Link } from '@/lib/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { TestimonyCard } from '@/components/testimony/TestimonyCard';
import type { TestimonyWithLocation } from '@/lib/supabase/types';

interface FeaturedTestimoniesProps {
  testimonies: (TestimonyWithLocation & { locations: { id: string; name: string; latitude: number; longitude: number } })[];
}

export function FeaturedTestimonies({ testimonies }: FeaturedTestimoniesProps) {
  if (testimonies.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-ocean-500 text-sm font-semibold uppercase tracking-wider">
              Recent Testimonies
            </span>
            <h2 className="mt-1 text-3xl font-display font-bold text-ocean-900">
              Voices from the Shore
            </h2>
          </div>
          <Link
            href="/map"
            className="hidden sm:flex items-center gap-1 text-ocean-500 hover:text-ocean-700 text-sm font-medium"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony) => (
            <TestimonyCard
              key={testimony.id}
              testimony={testimony as any}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
