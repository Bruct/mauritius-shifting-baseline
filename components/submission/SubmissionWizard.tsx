'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import { CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { submitTestimony } from '@/app/actions/testimony';
import { cn } from '@/lib/utils';
import { Step1Location } from './steps/Step1Location';
import { Step2Narrator } from './steps/Step2Narrator';
import { Step3Memory } from './steps/Step3Memory';
import { Step4Species } from './steps/Step4Species';
import { Step5Media } from './steps/Step5Media';
import { Step6Review } from './steps/Step6Review';

interface SubmissionWizardProps {
  species: {
    id: string;
    common_name_en: string | null;
    common_name_fr: string | null;
    common_name_mfe: string | null;
    scientific_name: string | null;
    species_type: string | null;
  }[];
  existingLocations: { id: string; name: string; latitude: number; longitude: number }[];
  defaultLocationId?: string;
  locale: string;
  userId: string;
}

export type WizardData = {
  // Location
  location_id?: string;
  location_name: string;
  location_description: string;
  latitude?: number;
  longitude?: number;
  // Narrator
  narrator_name: string;
  narrator_age?: number;
  narrator_profession: string;
  // Memory
  title: string;
  testimony_text: string;
  year_of_memory?: number;
  year_of_memory_end?: number;
  language: 'en' | 'fr' | 'mfe';
  collection_date: string;
  // Species
  species_tags: { species_id: string; presence: string; notes?: string }[];
  // Media
  media_files: { file: File; type: 'photo' | 'audio'; caption?: string }[];
};

const STEPS = [
  'step1_title',
  'step2_title',
  'step3_title',
  'step4_title',
  'step5_title',
  'step6_title',
] as const;

const initialData: WizardData = {
  location_name: '',
  location_description: '',
  narrator_name: '',
  narrator_profession: '',
  title: '',
  testimony_text: '',
  language: 'en',
  collection_date: new Date().toISOString().split('T')[0],
  species_tags: [],
  media_files: [],
};

export function SubmissionWizard({
  species,
  existingLocations,
  defaultLocationId,
  locale,
}: SubmissionWizardProps) {
  const t = useTranslations('submission');
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    ...initialData,
    location_id: defaultLocationId,
    language: locale as 'en' | 'fr' | 'mfe',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (updates: Partial<WizardData>) => {
    setData((d) => ({ ...d, ...updates }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // All DB inserts run server-side via a Server Action (avoids browser auth issues)
      const result = await submitTestimony({
        location_id: data.location_id,
        location_name: data.location_name,
        location_description: data.location_description,
        latitude: data.latitude,
        longitude: data.longitude,
        narrator_name: data.narrator_name,
        narrator_age: data.narrator_age,
        narrator_profession: data.narrator_profession,
        title: data.title,
        testimony_text: data.testimony_text,
        year_of_memory: data.year_of_memory!,
        year_of_memory_end: data.year_of_memory_end,
        collection_date: data.collection_date,
        language: data.language,
        species_tags: data.species_tags,
      });

      if (!result.success) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      // Media upload is client-side (requires storage bucket to be set up)
      if (data.media_files.length > 0) {
        const supabase = createClient();
        for (const item of data.media_files) {
          const ext = item.file.name.split('.').pop();
          const path = `${result.testimonyId}/${item.type}-${Date.now()}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from('testimony-media')
            .upload(path, item.file);
          if (uploadErr) {
            // Non-fatal: testimony was saved, media upload failed
            console.warn('Media upload failed:', uploadErr.message);
            continue;
          }
          await supabase.from('testimony_media').insert({
            testimony_id: result.testimonyId,
            media_type: item.type,
            storage_path: path,
            caption: item.caption ?? null,
          });
        }
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err);
      setError(msg || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-ocean-900 mb-2">
            {t('success')}
          </h2>
          <p className="text-ocean-600 mb-6">
            Your testimony will be reviewed and published shortly.
          </p>
          <button
            onClick={() => router.push('/map')}
            className="px-6 py-2.5 bg-ocean-500 text-white font-medium rounded-xl hover:bg-ocean-600 transition-colors"
          >
            Back to map
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    <Step1Location
      key={0}
      data={data}
      onUpdate={update}
      existingLocations={existingLocations}
    />,
    <Step2Narrator key={1} data={data} onUpdate={update} />,
    <Step3Memory key={2} data={data} onUpdate={update} />,
    <Step4Species key={3} data={data} onUpdate={update} species={species} locale={locale} />,
    <Step5Media key={4} data={data} onUpdate={update} />,
    <Step6Review key={5} data={data} species={species} locale={locale} />,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-xl font-bold text-ocean-900">{t('title')}</h1>
          <span className="text-sm text-ocean-500">{step + 1} / {STEPS.length}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i < step ? 'bg-ocean-500' : i === step ? 'bg-ocean-300' : 'bg-ocean-100',
              )}
            />
          ))}
        </div>
        <p className="text-sm text-ocean-600 mt-2 font-medium">{t(STEPS[step])}</p>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-ocean-100 p-6 mb-6">
        {steps[step]}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-coral-600 bg-coral-50 px-4 py-3 rounded-xl mb-4">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-5 py-2.5 text-ocean-600 font-medium rounded-xl border border-ocean-200 hover:bg-ocean-50 disabled:opacity-40 transition-all"
        >
          {t('back')}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="px-5 py-2.5 bg-ocean-500 text-white font-medium rounded-xl hover:bg-ocean-600 transition-colors"
          >
            {t('next')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-60 transition-colors"
          >
            {submitting ? t('submitting') : t('submit')}
          </button>
        )}
      </div>
    </div>
  );
}
