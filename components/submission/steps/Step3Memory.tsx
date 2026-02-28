'use client';

import { useTranslations } from 'next-intl';
import { LANGUAGES, MEMORY_YEAR_MIN, MEMORY_YEAR_MAX } from '@/lib/constants/mauritius';
import type { WizardData } from '../SubmissionWizard';

interface Step3Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export function Step3Memory({ data, onUpdate }: Step3Props) {
  const t = useTranslations('submission');

  return (
    <div className="space-y-5">
      <p className="text-sm text-ocean-600">{t('step3_desc')}</p>

      <div>
        <label className="block text-sm font-medium text-ocean-700 mb-1.5">
          Title *
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., The reef in front of my house in the 1970s"
          className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-1.5">
            {t('year_of_memory')} *
          </label>
          <input
            type="number"
            value={data.year_of_memory ?? ''}
            onChange={(e) => onUpdate({ year_of_memory: e.target.value ? parseInt(e.target.value) : undefined })}
            min={MEMORY_YEAR_MIN}
            max={MEMORY_YEAR_MAX}
            placeholder="1975"
            className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-1.5">
            {t('year_end')}
          </label>
          <input
            type="number"
            value={data.year_of_memory_end ?? ''}
            onChange={(e) => onUpdate({ year_of_memory_end: e.target.value ? parseInt(e.target.value) : undefined })}
            min={data.year_of_memory ?? MEMORY_YEAR_MIN}
            max={MEMORY_YEAR_MAX}
            placeholder="1985"
            className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-700 mb-1.5">
          {t('language')}
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => onUpdate({ language: lang.value as 'en' | 'fr' | 'mfe' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                data.language === lang.value
                  ? 'bg-ocean-500 text-white border-ocean-500'
                  : 'border-ocean-200 text-ocean-600 hover:bg-ocean-50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-700 mb-1.5">
          {t('testimony_text')} *
        </label>
        <textarea
          value={data.testimony_text}
          onChange={(e) => onUpdate({ testimony_text: e.target.value })}
          rows={8}
          placeholder={t('testimony_placeholder')}
          className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm resize-none"
        />
        <p className="text-xs text-ocean-400 mt-1">
          {data.testimony_text.length} characters (min. 50)
        </p>
      </div>
    </div>
  );
}
