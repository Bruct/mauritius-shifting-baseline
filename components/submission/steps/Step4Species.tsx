'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { SPECIES_TYPES } from '@/lib/constants/mauritius';
import { presenceColors } from '@/lib/utils';
import type { WizardData } from '../SubmissionWizard';

interface Step4Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  species: {
    id: string;
    common_name_en: string | null;
    common_name_fr: string | null;
    common_name_mfe: string | null;
    scientific_name: string | null;
    species_type: string | null;
  }[];
  locale: string;
}

const PRESENCES = ['abundant', 'present', 'rare', 'absent'] as const;

export function Step4Species({ data, onUpdate, species, locale }: Step4Props) {
  const t = useTranslations('submission');
  const tTestimony = useTranslations('testimony');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const getName = (s: Step4Props['species'][0]) => {
    if (locale === 'fr') return s.common_name_fr ?? s.common_name_en ?? s.scientific_name ?? '?';
    if (locale === 'mfe') return s.common_name_mfe ?? s.common_name_en ?? s.scientific_name ?? '?';
    return s.common_name_en ?? s.common_name_fr ?? s.scientific_name ?? '?';
  };

  const filtered = species.filter((s) => {
    const name = getName(s).toLowerCase();
    const sci = (s.scientific_name ?? '').toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || sci.includes(search.toLowerCase());
    const matchType = !typeFilter || s.species_type === typeFilter;
    return matchSearch && matchType;
  });

  const toggleSpecies = (speciesId: string) => {
    const existing = data.species_tags.find((t) => t.species_id === speciesId);
    if (existing) {
      onUpdate({ species_tags: data.species_tags.filter((t) => t.species_id !== speciesId) });
    } else {
      onUpdate({ species_tags: [...data.species_tags, { species_id: speciesId, presence: 'present' }] });
    }
  };

  const updatePresence = (speciesId: string, presence: string) => {
    onUpdate({
      species_tags: data.species_tags.map((t) =>
        t.species_id === speciesId ? { ...t, presence } : t,
      ),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ocean-600">{t('step4_desc')}</p>

      {/* Selected tags */}
      {data.species_tags.length > 0 && (
        <div className="space-y-2 p-3 bg-ocean-50 rounded-xl border border-ocean-100">
          <p className="text-xs font-semibold text-ocean-600 uppercase tracking-wider">
            {data.species_tags.length} species tagged
          </p>
          {data.species_tags.map((tag) => {
            const sp = species.find((s) => s.id === tag.species_id);
            if (!sp) return null;
            return (
              <div key={tag.species_id} className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-ocean-800 font-medium min-w-[100px]">
                  {getName(sp)}
                </span>
                <div className="flex gap-1">
                  {PRESENCES.map((p) => (
                    <button
                      key={p}
                      onClick={() => updatePresence(tag.species_id, p)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                        tag.presence === p
                          ? presenceColors[p]
                          : 'border-ocean-200 text-ocean-400 hover:border-ocean-300'
                      }`}
                    >
                      {tTestimony(p as 'abundant' | 'present' | 'rare' | 'absent')}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => toggleSpecies(tag.species_id)}
                  className="ml-auto text-ocean-400 hover:text-coral-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Search and filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ocean-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species..."
            className="w-full pl-9 pr-3 py-2 border border-ocean-200 rounded-lg text-sm focus:border-ocean-400 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-ocean-200 rounded-lg text-sm bg-white focus:border-ocean-400 outline-none"
        >
          <option value="">All types</option>
          {SPECIES_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label_en}</option>
          ))}
        </select>
      </div>

      {/* Species list */}
      <div className="max-h-52 overflow-y-auto space-y-1">
        {filtered.slice(0, 50).map((sp) => {
          const isTagged = data.species_tags.some((t) => t.species_id === sp.id);
          return (
            <button
              key={sp.id}
              onClick={() => toggleSpecies(sp.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all flex items-center justify-between ${
                isTagged
                  ? 'border-ocean-400 bg-ocean-50 text-ocean-800'
                  : 'border-transparent hover:bg-ocean-50 text-ocean-700'
              }`}
            >
              <div>
                <span className="font-medium">{getName(sp)}</span>
                {sp.scientific_name && (
                  <span className="italic text-ocean-400 ml-2 text-xs">{sp.scientific_name}</span>
                )}
              </div>
              {isTagged ? (
                <X className="h-4 w-4 text-ocean-500" />
              ) : (
                <Plus className="h-4 w-4 text-ocean-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
