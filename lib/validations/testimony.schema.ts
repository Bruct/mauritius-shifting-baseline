import { z } from 'zod';
import { MEMORY_YEAR_MIN, MEMORY_YEAR_MAX } from '../constants/mauritius';

export const locationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Location name must be at least 2 characters'),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const narratorSchema = z.object({
  narrator_name: z.string().min(2, 'Please enter your name'),
  narrator_age: z.number().min(10).max(120).optional().nullable(),
  narrator_profession: z.string().optional(),
});

export const memorySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  testimony_text: z.string().min(50, 'Please describe your memory in at least 50 characters'),
  year_of_memory: z.number()
    .min(MEMORY_YEAR_MIN, `Year must be after ${MEMORY_YEAR_MIN}`)
    .max(MEMORY_YEAR_MAX, `Year cannot be in the future`),
  year_of_memory_end: z.number()
    .min(MEMORY_YEAR_MIN)
    .max(MEMORY_YEAR_MAX)
    .optional()
    .nullable(),
  language: z.enum(['en', 'fr', 'mfe']),
  collection_date: z.string().optional(),
}).refine(
  (data) => !data.year_of_memory_end || data.year_of_memory_end >= data.year_of_memory,
  { message: 'End year must be after start year', path: ['year_of_memory_end'] },
);

export const speciesTagSchema = z.object({
  species_id: z.string().uuid(),
  presence: z.enum(['abundant', 'present', 'rare', 'absent']),
  notes: z.string().optional(),
});

export const testimonySubmissionSchema = locationSchema
  .and(narratorSchema)
  .and(memorySchema)
  .and(z.object({
    species_tags: z.array(speciesTagSchema).optional(),
    status: z.enum(['draft', 'pending']).default('pending'),
  }));

export type TestimonySubmission = z.infer<typeof testimonySubmissionSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type NarratorInput = z.infer<typeof narratorSchema>;
export type MemoryInput = z.infer<typeof memorySchema>;
