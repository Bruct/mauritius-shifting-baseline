'use client';

import { useTranslations } from 'next-intl';
import { DECADES } from '@/lib/constants/mauritius';
import { cn } from '@/lib/utils';

interface TimelineSliderProps {
  value: number | null;
  onChange: (decade: number | null) => void;
}

export function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  const t = useTranslations('map');

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-ocean-100 p-3">
      <p className="text-xs font-semibold text-ocean-600 mb-2 text-center uppercase tracking-wider">
        {t('filter_decade')}
      </p>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          onClick={() => onChange(null)}
          className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
            value === null
              ? 'bg-ocean-500 text-white shadow-sm'
              : 'text-ocean-500 hover:bg-ocean-50',
          )}
        >
          {t('filter_all')}
        </button>
        {DECADES.map((decade) => (
          <button
            key={decade.value}
            onClick={() => onChange(decade.value)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
              value === decade.value
                ? 'bg-ocean-500 text-white shadow-sm'
                : 'text-ocean-500 hover:bg-ocean-50',
            )}
          >
            {decade.label}
          </button>
        ))}
      </div>
    </div>
  );
}
