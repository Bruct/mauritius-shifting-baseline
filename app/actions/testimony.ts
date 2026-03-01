'use server';

import { createClient } from '@/lib/supabase/server';

export interface TestimonyPayload {
  location_id?: string;
  location_name: string;
  location_description: string;
  latitude?: number;
  longitude?: number;
  narrator_name: string;
  narrator_age?: number;
  narrator_profession: string;
  title: string;
  testimony_text: string;
  year_of_memory: number;
  year_of_memory_end?: number;
  collection_date: string;
  language: string;
  species_tags: { species_id: string; presence: string; notes?: string }[];
}

export async function submitTestimony(
  payload: TestimonyPayload,
): Promise<{ success: true; testimonyId: string } | { success: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated. Please log in again.' };

  // 1. Create or use existing location
  let locationId = payload.location_id;
  if (!locationId && payload.latitude != null && payload.longitude != null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: loc, error: locErr } = await (supabase.from('locations') as any)
      .insert({
        name: payload.location_name,
        description: payload.location_description || null,
        latitude: payload.latitude,
        longitude: payload.longitude,
        created_by: user.id,
      })
      .select('id')
      .single() as { data: { id: string } | null; error: { message: string } | null };
    if (locErr) return { success: false, error: `Location: ${locErr.message}` };
    locationId = loc!.id;
  }

  if (!locationId) return { success: false, error: 'No location selected or created.' };

  // 2. Create testimony
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: testimony, error: testErr } = await (supabase.from('testimonies') as any)
    .insert({
      location_id: locationId,
      submitted_by: user.id,
      title: payload.title,
      testimony_text: payload.testimony_text,
      narrator_name: payload.narrator_name || null,
      narrator_age: payload.narrator_age ?? null,
      narrator_profession: payload.narrator_profession || null,
      year_of_memory: payload.year_of_memory,
      year_of_memory_end: payload.year_of_memory_end ?? null,
      collection_date: payload.collection_date || null,
      language: payload.language,
      status: 'pending',
    })
    .select('id')
    .single() as { data: { id: string } | null; error: { message: string } | null };
  if (testErr) return { success: false, error: `Testimony: ${testErr.message}` };

  // 3. Insert species tags
  if (payload.species_tags.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: speciesErr } = await (supabase.from('testimony_species') as any).insert(
      payload.species_tags.map((tag) => ({
        testimony_id: testimony!.id,
        species_id: tag.species_id,
        presence: tag.presence,
        notes: tag.notes ?? null,
      })),
    ) as { error: { message: string } | null };
    if (speciesErr) return { success: false, error: `Species: ${speciesErr.message}` };
  }

  return { success: true, testimonyId: testimony!.id };
}
