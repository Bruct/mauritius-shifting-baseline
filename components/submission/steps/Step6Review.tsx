'use client';

import { useTranslations } from 'next-intl';
import { MapPin, User, Calendar, Globe, Image, Mic } from 'lucide-react';
import { formatYear, presenceColors } from '@/lib/utils';
import type { WizardData } from '../SubmissionWizard';

interface Step6Props {
  data: WizardData;
  species: { id: string; common_name_en: string | null; common_name_fr: string | null }[];
  locale: string;
}

export function Step6Review({ data, species, locale }: Step6Props) {
  const t = useTranslations('submission');

  const getSpeciesName = (id: string) => {
    const s = species.find((sp) => sp.id === id);
    if (!s) return 'Unknown';
    return (locale === 'fr' ? s.common_name_fr : s.common_name_en) ?? s.common_name_en ?? 'Unknown';
  };

  const LANG_LABELS: Record<string, string> = { en: 'English', fr: 'Français', mfe: 'Kreol' };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ocean-600 font-medium">{t('step6_desc')}</p>

      {/* Summary cards */}
      <div className="space-y-3">
        {/* Location */}
        <div className="p-3 bg-ocean-50 rounded-xl border border-ocean-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-1.5">
            <MapPin className="h-3.5 w-3.5" /> Location
          </div>
          <p className="text-sm text-ocean-900 font-medium">{data.location_name || 'Not set'}</p>
          {data.latitude && (
            <p className="text-xs text-ocean-400 font-mono mt-0.5">
              {data.latitude.toFixed(5)}, {data.longitude?.toFixed(5)}
            </p>
          )}
        </div>

        {/* Narrator */}
        <div className="p-3 bg-ocean-50 rounded-xl border border-ocean-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-1.5">
            <User className="h-3.5 w-3.5" /> Narrator
          </div>
          <p className="text-sm text-ocean-900">
            {data.narrator_name || 'Anonymous'}
            {data.narrator_age && `, age ${data.narrator_age}`}
            {data.narrator_profession && ` — ${data.narrator_profession}`}
          </p>
        </div>

        {/* Memory */}
        <div className="p-3 bg-ocean-50 rounded-xl border border-ocean-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-1.5">
            <Calendar className="h-3.5 w-3.5" /> Memory
          </div>
          <p className="text-sm text-ocean-900 font-semibold">{data.title || 'No title'}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-ocean-500 font-bold">
              {data.year_of_memory
                ? formatYear(data.year_of_memory, data.year_of_memory_end)
                : 'Year not set'}
            </span>
            <span className="flex items-center gap-1 text-xs text-ocean-400">
              <Globe className="h-3 w-3" /> {LANG_LABELS[data.language]}
            </span>
          </div>
          <p className="text-xs text-ocean-600 mt-2 line-clamp-3">{data.testimony_text}</p>
        </div>

        {/* Species */}
        {data.species_tags.length > 0 && (
          <div className="p-3 bg-ocean-50 rounded-xl border border-ocean-100">
            <div className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">
              🐠 {data.species_tags.length} Species Tagged
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.species_tags.map((tag) => (
                <span
                  key={tag.species_id}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${presenceColors[tag.presence]}`}
                >
                  {getSpeciesName(tag.species_id)} — {tag.presence}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Media */}
        {data.media_files.length > 0 && (
          <div className="p-3 bg-ocean-50 rounded-xl border border-ocean-100">
            <div className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">
              Media
            </div>
            <div className="flex gap-3">
              {data.media_files.filter((f) => f.type === 'photo').length > 0 && (
                <span className="flex items-center gap-1 text-xs text-ocean-600">
                  <Image className="h-3.5 w-3.5" />
                  {data.media_files.filter((f) => f.type === 'photo').length} photo(s)
                </span>
              )}
              {data.media_files.filter((f) => f.type === 'audio').length > 0 && (
                <span className="flex items-center gap-1 text-xs text-ocean-600">
                  <Mic className="h-3.5 w-3.5" />
                  {data.media_files.filter((f) => f.type === 'audio').length} audio(s)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-ocean-400 leading-relaxed">
        Your testimony will be submitted for review by the project team. It will be published once verified.
        Your personal data is stored securely and will not be shared without your consent.
      </p>
    </div>
  );
}
