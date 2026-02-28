-- Geographic index for location queries
CREATE INDEX idx_locations_geom ON public.locations USING GIST (geom);
CREATE INDEX idx_locations_coords ON public.locations (latitude, longitude);

-- Testimony queries
CREATE INDEX idx_testimonies_location ON public.testimonies (location_id);
CREATE INDEX idx_testimonies_status ON public.testimonies (status);
CREATE INDEX idx_testimonies_year ON public.testimonies (year_of_memory);
CREATE INDEX idx_testimonies_submitted_by ON public.testimonies (submitted_by);

-- Full-text search on testimonies
CREATE INDEX idx_testimonies_fulltext ON public.testimonies
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(testimony_text, '')));

-- Species name search (trigram)
CREATE INDEX idx_species_name_trgm ON public.species
  USING GIN (
    (coalesce(common_name_en, '') || ' ' || coalesce(common_name_fr, '') || ' ' || coalesce(scientific_name, ''))
    gin_trgm_ops
  );

-- Media
CREATE INDEX idx_media_testimony ON public.testimony_media (testimony_id);

-- Species tags
CREATE INDEX idx_testimony_species_testimony ON public.testimony_species (testimony_id);
CREATE INDEX idx_testimony_species_species ON public.testimony_species (species_id);
