'use client';

import { useTranslations } from 'next-intl';
import { PROFESSIONS } from '@/lib/constants/mauritius';
import type { WizardData } from '../SubmissionWizard';

interface Step2Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export function Step2Narrator({ data, onUpdate }: Step2Props) {
  const t = useTranslations('submission');

  return (
    <div className="space-y-5">
      <p className="text-sm text-ocean-600">{t('step2_desc')}</p>

      <div>
        <label className="block text-sm font-medium text-ocean-700 mb-1.5">
          {t('narrator_name')} *
        </label>
        <input
          type="text"
          value={data.narrator_name}
          onChange={(e) => onUpdate({ narrator_name: e.target.value })}
          placeholder="Jean-Pierre Leblanc"
          className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-1.5">
            {t('narrator_age')}
          </label>
          <input
            type="number"
            value={data.narrator_age ?? ''}
            onChange={(e) => onUpdate({ narrator_age: e.target.value ? parseInt(e.target.value) : undefined })}
            min={10}
            max={120}
            placeholder="72"
            className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-1.5">
            {t('narrator_profession')}
          </label>
          <select
            value={data.narrator_profession}
            onChange={(e) => onUpdate({ narrator_profession: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-ocean-200 focus:border-ocean-400 outline-none text-sm bg-white"
          >
            <option value="">Select...</option>
            {PROFESSIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label_en}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
