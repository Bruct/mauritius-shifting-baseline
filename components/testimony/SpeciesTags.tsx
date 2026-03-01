import { cn, presenceColors, presenceIcons } from '@/lib/utils';

type SpeciesTag = {
  presence: string;
  notes?: string | null;
  species: {
    id: string;
    common_name_en: string | null;
    common_name_fr: string | null;
    scientific_name: string | null;
    species_type: string | null;
  };
};

interface SpeciesTagsProps {
  tags: SpeciesTag[];
  locale?: string;
}

export function SpeciesTags({ tags, locale = 'en' }: SpeciesTagsProps) {
  if (tags.length === 0) return null;

  const getName = (s: SpeciesTag['species']) => {
    if (locale === 'fr') return s.common_name_fr ?? s.common_name_en ?? s.scientific_name ?? 'Unknown';
    return s.common_name_en ?? s.common_name_fr ?? s.scientific_name ?? 'Unknown';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag.species.id}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
            presenceColors[tag.presence] ?? presenceColors.present,
          )}
          title={tag.notes ?? undefined}
        >
          <span className="font-mono text-[10px] opacity-70">
            {presenceIcons[tag.presence]}
          </span>
          {getName(tag.species)}
          {tag.species.scientific_name && (
            <span className="italic opacity-60 hidden sm:inline">
              ({tag.species.scientific_name})
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
