'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import type { WizardData } from '../SubmissionWizard';

const LocationPicker = dynamic(
  () => import('@/components/map/LocationPicker').then((m) => ({ default: m.LocationPicker })),
  { ssr: false, loading: () => <div className="h-72 skeleton rounded-xl" /> },
);

interface Step1Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  existingLocations: { id: string; name: string; latitude: number; longitude: number }[];
}

export function Step1Location({ data, onUpdate, existingLocations }: Step1Props) {
  const t = useTranslations('submission');
  const [mode, setMode] = useState<'existing' | 'new'>(data.location_id ? 'existing' : 'new');
  const [search, setSearch] = useState('');

  const filtered = existingLocations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-ocean-600">{t('step1_desc')}</p>

      {/* Toggle mode */}
      <div className="flex rounded-lg border border-ocean-200 overflow-hidden">
        {(['existing', 'new'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-ocean-500 text-white'
                : 'text-ocean-600 hover:bg-ocean-50'
            }`}
          >
            {m === 'existing' ? 'Existing location' : 'New location'}
          </button>
        ))}
      </div>

      {mode === 'existing' ? (
        <div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ocean-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="w-full pl-9 pr-3 py-2 border border-ocean-200 rounded-lg text-sm focus:border-ocean-400 outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1.5">
            {filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onUpdate({
                  location_id: loc.id,
                  location_name: loc.name,
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                })}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                  data.location_id === loc.id
                    ? 'border-ocean-400 bg-ocean-50 text-ocean-800'
                    : 'border-ocean-100 hover:border-ocean-200 text-ocean-700'
                }`}
              >
                <MapPin className="h-4 w-4 text-ocean-400 flex-shrink-0" />
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Location name *
            </label>
            <input
              type="text"
              value={data.location_name}
              onChange={(e) => onUpdate({ location_name: e.target.value })}
              placeholder="e.g., Blue Bay, Grand Baie lagoon..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Description (optional)
            </label>
            <input
              type="text"
              value={data.location_description}
              onChange={(e) => onUpdate({ location_description: e.target.value })}
              placeholder="Brief description of the spot..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-2">
              Click on the map to place the pin *
            </label>
            <LocationPicker
              value={data.latitude ? { lat: data.latitude, lng: data.longitude! } : null}
              onChange={(lat, lng) => onUpdate({ latitude: lat, longitude: lng })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
