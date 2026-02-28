import { Link } from '@/lib/i18n/routing';
import { Calendar, MapPin, User, Mic, Image } from 'lucide-react';
import { formatYear, truncate, cn } from '@/lib/utils';
import type { TestimonyFull } from '@/lib/supabase/types';

interface TestimonyCardProps {
  testimony: Partial<TestimonyFull> & {
    id: string;
    title: string;
    testimony_text: string;
    year_of_memory: number;
    year_of_memory_end?: number | null;
    locations?: { name: string } | null;
  };
  compact?: boolean;
}

const DECADE_COLORS: Record<number, string> = {
  1940: 'bg-amber-100 text-amber-800',
  1950: 'bg-yellow-100 text-yellow-800',
  1960: 'bg-lime-100 text-lime-800',
  1970: 'bg-green-100 text-green-800',
  1980: 'bg-teal-100 text-teal-800',
  1990: 'bg-cyan-100 text-cyan-800',
  2000: 'bg-sky-100 text-sky-800',
  2010: 'bg-blue-100 text-blue-800',
  2020: 'bg-violet-100 text-violet-800',
};

function getDecadeColor(year: number): string {
  const decade = Math.floor(year / 10) * 10;
  return DECADE_COLORS[decade] ?? 'bg-ocean-100 text-ocean-800';
}

export function TestimonyCard({ testimony, compact = false }: TestimonyCardProps) {
  const hasAudio = testimony.testimony_media?.some((m) => m.media_type === 'audio');
  const hasPhoto = testimony.testimony_media?.some((m) => m.media_type === 'photo');

  return (
    <Link
      href={`/testimonies/${testimony.id}`}
      className="group block bg-white rounded-2xl border border-ocean-100 hover:border-ocean-300 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {/* Year badge stripe */}
      <div className={cn('h-1', getDecadeColor(testimony.year_of_memory).split(' ')[0].replace('100', '400'))} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={cn(
              'inline-block px-2.5 py-0.5 rounded-full text-xs font-bold',
              getDecadeColor(testimony.year_of_memory),
            )}
          >
            {formatYear(testimony.year_of_memory, testimony.year_of_memory_end)}
          </span>
          <div className="flex items-center gap-1.5">
            {hasAudio && (
              <span className="flex items-center gap-0.5 text-xs text-ocean-400">
                <Mic className="h-3 w-3" />
              </span>
            )}
            {hasPhoto && (
              <span className="flex items-center gap-0.5 text-xs text-ocean-400">
                <Image className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-ocean-900 text-base mb-2 group-hover:text-ocean-700 transition-colors leading-tight">
          {testimony.title}
        </h3>

        {/* Excerpt */}
        {!compact && (
          <p className="text-sm text-ocean-600 leading-relaxed mb-4">
            {truncate(testimony.testimony_text, 120)}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-ocean-400">
          {testimony.narrator_name && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {testimony.narrator_name}
              {testimony.narrator_profession && `, ${testimony.narrator_profession}`}
            </span>
          )}
          {testimony.locations?.name && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {testimony.locations.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
