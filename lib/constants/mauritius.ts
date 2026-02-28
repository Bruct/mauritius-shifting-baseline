export const MAURITIUS_DISTRICTS = [
  'Port Louis',
  'Pamplemousses',
  'Rivière du Rempart',
  'Flacq',
  'Grand Port',
  'Savanne',
  'Black River',
  'Moka',
  'Plaines Wilhems',
] as const;

export const PROFESSIONS = [
  { value: 'fisherman', label_en: 'Fisherman', label_fr: 'Pêcheur', label_mfe: 'Pesker' },
  { value: 'diver', label_en: 'Diver', label_fr: 'Plongeur', label_mfe: 'Plonzer' },
  { value: 'boat_captain', label_en: 'Boat Captain', label_fr: 'Capitaine de bateau', label_mfe: 'Kapiten Bato' },
  { value: 'marine_biologist', label_en: 'Marine Biologist', label_fr: 'Biologiste marin', label_mfe: 'Byolozis Marin' },
  { value: 'tourist_guide', label_en: 'Tourist Guide', label_fr: 'Guide touristique', label_mfe: 'Gid Touris' },
  { value: 'local_resident', label_en: 'Local Resident', label_fr: 'Habitant local', label_mfe: 'Rezidan Lokal' },
  { value: 'researcher', label_en: 'Researcher', label_fr: 'Chercheur', label_mfe: 'Sersher' },
  { value: 'other', label_en: 'Other', label_fr: 'Autre', label_mfe: 'Lot' },
] as const;

export const DECADES = [
  { value: 1940, label: '1940s' },
  { value: 1950, label: '1950s' },
  { value: 1960, label: '1960s' },
  { value: 1970, label: '1970s' },
  { value: 1980, label: '1980s' },
  { value: 1990, label: '1990s' },
  { value: 2000, label: '2000s' },
  { value: 2010, label: '2010s' },
  { value: 2020, label: '2020s' },
] as const;

export const SPECIES_TYPES = [
  { value: 'fish', label_en: 'Fish', label_fr: 'Poissons', label_mfe: 'Pwason' },
  { value: 'coral', label_en: 'Coral', label_fr: 'Coraux', label_mfe: 'Koray' },
  { value: 'invertebrate', label_en: 'Invertebrate', label_fr: 'Invertébré', label_mfe: 'Invertebre' },
  { value: 'mammal', label_en: 'Marine Mammal', label_fr: 'Mammifère marin', label_mfe: 'Mamilfer Marin' },
  { value: 'turtle', label_en: 'Sea Turtle', label_fr: 'Tortue marine', label_mfe: 'Torti Lamer' },
  { value: 'other', label_en: 'Other', label_fr: 'Autre', label_mfe: 'Lot' },
] as const;

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'mfe', label: 'Kreol Morisyen' },
] as const;

// Year range for memories
export const MEMORY_YEAR_MIN = 1940;
export const MEMORY_YEAR_MAX = new Date().getFullYear();
