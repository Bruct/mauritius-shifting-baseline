-- =========================================================
-- ENUMERATIONS
-- =========================================================

CREATE TYPE user_role AS ENUM ('collector', 'admin');
CREATE TYPE testimony_status AS ENUM ('draft', 'pending', 'published', 'rejected');
CREATE TYPE media_type AS ENUM ('photo', 'audio');
CREATE TYPE species_presence AS ENUM ('abundant', 'present', 'rare', 'absent');

-- =========================================================
-- USER PROFILES (extends auth.users)
-- =========================================================

CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  role         user_role NOT NULL DEFAULT 'collector',
  organization TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- LOCATIONS (map pins)
-- =========================================================

CREATE TABLE public.locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  latitude    DOUBLE PRECISION NOT NULL,
  longitude   DOUBLE PRECISION NOT NULL,
  geom        GEOMETRY(POINT, 4326) GENERATED ALWAYS AS (
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
              ) STORED,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- TESTIMONIES
-- =========================================================

CREATE TABLE public.testimonies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id         UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  submitted_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  testimony_text      TEXT NOT NULL,
  narrator_name       TEXT,
  narrator_age        INTEGER CHECK (narrator_age > 0 AND narrator_age < 130),
  narrator_profession TEXT,
  year_of_memory      INTEGER NOT NULL CHECK (year_of_memory >= 1900 AND year_of_memory <= EXTRACT(YEAR FROM NOW())),
  year_of_memory_end  INTEGER CHECK (year_of_memory_end >= 1900),
  collection_date     DATE,
  language            TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'fr', 'mfe')),
  status              testimony_status NOT NULL DEFAULT 'pending',
  reviewer_notes      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT year_range_valid CHECK (year_of_memory_end IS NULL OR year_of_memory_end >= year_of_memory)
);

-- =========================================================
-- TESTIMONY MEDIA
-- =========================================================

CREATE TABLE public.testimony_media (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testimony_id UUID NOT NULL REFERENCES public.testimonies(id) ON DELETE CASCADE,
  media_type   media_type NOT NULL,
  storage_path TEXT NOT NULL,
  caption      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- SPECIES CATALOG
-- =========================================================

CREATE TABLE public.species (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  common_name_en  TEXT,
  common_name_fr  TEXT,
  common_name_mfe TEXT,
  scientific_name TEXT,
  species_type    TEXT CHECK (species_type IN ('fish', 'coral', 'invertebrate', 'mammal', 'turtle', 'other')),
  image_url       TEXT,
  description     TEXT
);

-- =========================================================
-- SPECIES MENTIONS
-- =========================================================

CREATE TABLE public.testimony_species (
  testimony_id UUID NOT NULL REFERENCES public.testimonies(id) ON DELETE CASCADE,
  species_id   UUID NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  presence     species_presence NOT NULL,
  notes        TEXT,
  PRIMARY KEY (testimony_id, species_id)
);
