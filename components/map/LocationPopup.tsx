'use client';

import { useEffect, useState } from 'react';
import { Popup } from 'react-map-gl';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { Calendar, User, ArrowRight, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatYear, truncate } from '@/lib/utils';
import type { LocationWithCount, Testimony } from '@/lib/supabase/types';

interface LocationPopupProps {
  location: LocationWithCount;
  decadeFilter: number | null;
  onClose: () => void;
}

export function LocationPopup({ location, decadeFilter, onClose }: LocationPopupProps) {
  const t = useTranslations('map');
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let query = supabase
      .from('testimonies')
      .select('id, title, testimony_text, narrator_name, narrator_profession, year_of_memory, year_of_memory_end')
      .eq('location_id', location.id)
      .eq('status', 'published')
      .order('year_of_memory', { ascending: true })
      .limit(5);

    if (decadeFilter !== null) {
      query = query.gte('year_of_memory', decadeFilter).lt('year_of_memory', decadeFilter + 10);
    }

    query.then(({ data }) => {
      setTestimonies(data ?? []);
      setLoading(false);
    });
  }, [location.id, decadeFilter]);

  return (
    <Popup
      longitude={location.longitude}
      latitude={location.latitude}
      anchor="bottom"
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      maxWidth="320px"
      offset={40}
    >
      <div className="w-72 font-sans">
        {/* Header */}
        <div className="bg-ocean-gradient px-4 py-3">
          <h3 className="font-display font-bold text-white text-base leading-tight">
            {location.name}
          </h3>
          <p className="text-ocean-200 text-xs mt-0.5">
            {location.testimony_count} {location.testimony_count === 1 ? 'testimony' : 'testimonies'}
          </p>
        </div>

        {/* Testimony list */}
        <div className="divide-y divide-ocean-50 max-h-56 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-12 rounded-lg" />
              ))}
            </div>
          ) : testimonies.length === 0 ? (
            <p className="p-4 text-sm text-ocean-400 text-center">{t('no_testimonies')}</p>
          ) : (
            testimonies.map((t) => (
              <Link
                key={t.id}
                href={`/testimonies/${t.id}`}
                className="block px-4 py-3 hover:bg-ocean-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ocean-900 truncate">{t.title}</p>
                    <p className="text-xs text-ocean-500 mt-0.5 line-clamp-2">
                      {truncate(t.testimony_text, 80)}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-ocean-300 group-hover:text-ocean-500 flex-shrink-0 mt-0.5 transition-colors" />
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  {t.narrator_name && (
                    <span className="flex items-center gap-1 text-xs text-ocean-400">
                      <User className="h-3 w-3" /> {t.narrator_name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-ocean-400">
                    <Calendar className="h-3 w-3" />
                    {formatYear(t.year_of_memory, t.year_of_memory_end)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-ocean-100 flex items-center justify-between">
          <Link
            href={`/locations/${location.id}`}
            className="text-xs font-medium text-ocean-600 hover:text-ocean-800"
          >
            {t('see_all')} →
          </Link>
          <Link
            href={`/testimonies/submit?locationId=${location.id}`}
            className="flex items-center gap-1 text-xs font-medium text-ocean-500 hover:text-ocean-700"
          >
            <Plus className="h-3 w-3" />
            {t('add_testimony')}
          </Link>
        </div>
      </div>
    </Popup>
  );
}
