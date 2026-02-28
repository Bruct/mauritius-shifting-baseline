'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { SPECIES_TYPES } from '@/lib/constants/mauritius';
import { cn } from '@/lib/utils';

type SpeciesWithCount = {
  id: string;
  common_name_en: string | null;
  common_name_fr: string | null;
  common_name_mfe: string | null;
  scientific_name: string | null;
  species_type: string | null;
  image_url: string | null;
  description: string | null;
  testimony_count: number;
};

const TYPE_EMOJIS: Record<string, string> = {
  fish: '🐠',
  coral: '🪸',
  invertebrate: '🦐',
  mammal: '🐬',
  turtle: '🐢',
  other: '🌊',
};

interface SpeciesGridProps {
  species: SpeciesWithCount[];
}

export function SpeciesGrid({ species }: SpeciesGridProps) {
  const t = useTranslations('species');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = species.filter((s) => {
    const name = `${s.common_name_en} ${s.common_name_fr} ${s.scientific_name}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    const matchType = !typeFilter || s.species_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ocean-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species..."
            className="w-full pl-9 pr-3 py-2.5 border border-ocean-200 rounded-xl bg-white focus:border-ocean-400 outline-none text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setTypeFilter('')}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium transition-all',
              !typeFilter ? 'bg-ocean-500 text-white' : 'bg-white text-ocean-600 border border-ocean-200 hover:bg-ocean-50',
            )}
          >
            {t('filter_all')}
          </button>
          {SPECIES_TYPES.filter((t) => t.value !== 'other').map((type) => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value === typeFilter ? '' : type.value)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1',
                typeFilter === type.value
                  ? 'bg-ocean-500 text-white'
                  : 'bg-white text-ocean-600 border border-ocean-200 hover:bg-ocean-50',
              )}
            >
              {TYPE_EMOJIS[type.value]} {type.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-ocean-400">{t('no_species')}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((sp) => (
            <div
              key={sp.id}
              className="bg-white rounded-2xl border border-ocean-100 hover:border-ocean-300 shadow-sm hover:shadow-md transition-all p-4"
            >
              <div className="text-3xl mb-2 text-center">{TYPE_EMOJIS[sp.species_type ?? 'other'] ?? '🌊'}</div>
              <h3 className="font-semibold text-ocean-900 text-sm text-center leading-tight">
                {sp.common_name_en ?? sp.scientific_name}
              </h3>
              {sp.common_name_fr && sp.common_name_fr !== sp.common_name_en && (
                <p className="text-xs text-ocean-500 text-center mt-0.5">{sp.common_name_fr}</p>
              )}
              {sp.scientific_name && (
                <p className="text-xs italic text-ocean-400 text-center mt-0.5">{sp.scientific_name}</p>
              )}
              {sp.testimony_count > 0 && (
                <div className="mt-3 text-center">
                  <span className="text-xs bg-ocean-50 text-ocean-500 px-2 py-0.5 rounded-full">
                    {sp.testimony_count} {sp.testimony_count === 1 ? 'testimony' : 'testimonies'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
