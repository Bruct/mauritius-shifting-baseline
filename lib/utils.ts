import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number, yearEnd?: number | null): string {
  if (yearEnd && yearEnd !== year) return `${year}–${yearEnd}`;
  return String(year);
}

export function getDecade(year: number): number {
  return Math.floor(year / 10) * 10;
}

export function getDecadeLabel(decade: number): string {
  return `${decade}s`;
}

export function getSupabasePublicUrl(path: string, bucket = 'testimony-media'): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

export function formatDate(dateStr: string, locale = 'en'): string {
  return new Date(dateStr).toLocaleDateString(
    locale === 'mfe' ? 'fr-MU' : locale,
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export const presenceColors: Record<string, string> = {
  abundant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  present: 'bg-ocean-100 text-ocean-800 border-ocean-200',
  rare: 'bg-sandy-100 text-sandy-800 border-sandy-200',
  absent: 'bg-coral-100 text-coral-800 border-coral-200',
};

export const presenceIcons: Record<string, string> = {
  abundant: '●●●',
  present: '●●○',
  rare: '●○○',
  absent: '○○○',
};
