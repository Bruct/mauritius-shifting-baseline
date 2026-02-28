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
    const { data: loc, error: locErr } = await supabase
      .from('locations')
      .insert({
        name: payload.location_name,
        description: payload.location_description || null,
        latitude: payload.latitude,
        longitude: payload.longitude,
        created_by: user.id,
      })
      .select('id')
      .single();
    if (locErr) return { success: false, error: `Location: ${locErr.message}` };
    locationId = loc.id;
  }

  if (!locationId) return { success: false, error: 'No location selected or created.' };

  // 2. Create testimony
  const { data: testimony, error: testErr } = await supabase
    .from('testimonies')
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
    .single();
  if (testErr) return { success: false, error: `Testimony: ${testErr.message}` };

  // 3. Insert species tags
  if (payload.species_tags.length > 0) {
    const { error: speciesErr } = await supabase.from('testimony_species').insert(
      payload.species_tags.map((tag) => ({
        testimony_id: testimony.id,
        species_id: tag.species_id,
        presence: tag.presence as 'abundant' | 'present' | 'rare' | 'absent',
        notes: tag.notes ?? null,
      })),
    );
    if (speciesErr) return { success: false, error: `Species: ${speciesErr.message}` };
  }

  return { success: true, testimonyId: testimony.id };
}
