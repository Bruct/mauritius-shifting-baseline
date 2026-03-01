'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, MapPin, User, Calendar, Globe, Mic, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatYear, truncate } from '@/lib/utils';

type ReviewTestimony = {
  id: string;
  title: string;
  testimony_text: string;
  narrator_name: string | null;
  narrator_age: number | null;
  narrator_profession: string | null;
  year_of_memory: number;
  year_of_memory_end: number | null;
  language: string;
  status: string;
  created_at: string;
  locations: { id: string; name: string } | null;
  testimony_media: { id: string; media_type: string }[];
  testimony_species: { species_id: string; presence: string; species: { common_name_en: string | null } | null }[];
};

export function ReviewCard({ testimony }: { testimony: ReviewTestimony }) {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAction = async (status: 'published' | 'rejected') => {
    setSubmitting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('testimonies') as any)
      .update({ status, reviewer_notes: notes || null })
      .eq('id', testimony.id);
    router.refresh();
  };

  const LANG_LABELS: Record<string, string> = { en: 'EN', fr: 'FR', mfe: 'MFE' };

  return (
    <div className="bg-white rounded-2xl border border-ocean-100 overflow-hidden shadow-sm">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-semibold text-ocean-900 text-base">{testimony.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-ocean-400">
              {testimony.narrator_name && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {testimony.narrator_name}
                  {testimony.narrator_profession && ` (${testimony.narrator_profession})`}
                </span>
              )}
              {testimony.locations && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {testimony.locations.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatYear(testimony.year_of_memory, testimony.year_of_memory_end)}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {LANG_LABELS[testimony.language] ?? testimony.language}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {testimony.testimony_media.some((m) => m.media_type === 'audio') && (
              <span className="p-1 bg-ocean-50 rounded text-ocean-500" title="Has audio">
                <Mic className="h-3.5 w-3.5" />
              </span>
            )}
            {testimony.testimony_media.some((m) => m.media_type === 'photo') && (
              <span className="p-1 bg-ocean-50 rounded text-ocean-500" title="Has photos">
                <ImageIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Testimony text */}
        <p className="text-sm text-ocean-700 leading-relaxed">
          {expanded ? testimony.testimony_text : truncate(testimony.testimony_text, 200)}
        </p>
        {testimony.testimony_text.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-ocean-500 hover:text-ocean-700 mt-1"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Species */}
        {testimony.testimony_species.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {testimony.testimony_species.map((ts) => (
              <span key={ts.species_id} className="text-xs px-2 py-0.5 bg-ocean-50 text-ocean-600 rounded-full border border-ocean-100">
                {ts.species?.common_name_en ?? '?'} ({ts.presence})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Review actions */}
      <div className="px-5 pb-5 pt-0 space-y-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional reviewer notes..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-ocean-200 rounded-lg focus:border-ocean-400 outline-none resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('published')}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Approve & Publish
          </button>
          <button
            onClick={() => handleAction('rejected')}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
