-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimony_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimony_species ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =========================================================
-- PROFILES
-- =========================================================

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- =========================================================
-- LOCATIONS
-- =========================================================

CREATE POLICY "locations_select_all" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "locations_insert_authenticated" ON public.locations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "locations_update_admin" ON public.locations
  FOR UPDATE USING (public.is_admin());

-- =========================================================
-- TESTIMONIES
-- =========================================================

-- Public can read published testimonies
CREATE POLICY "testimonies_select_published" ON public.testimonies
  FOR SELECT USING (
    status = 'published'
    OR submitted_by = auth.uid()
    OR public.is_admin()
  );

-- Authenticated users can insert
CREATE POLICY "testimonies_insert_authenticated" ON public.testimonies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND submitted_by = auth.uid());

-- Submitter can update their own drafts; admins can update status
CREATE POLICY "testimonies_update" ON public.testimonies
  FOR UPDATE USING (
    (submitted_by = auth.uid() AND status = 'draft')
    OR public.is_admin()
  );

-- Only admins can delete
CREATE POLICY "testimonies_delete_admin" ON public.testimonies
  FOR DELETE USING (public.is_admin());

-- =========================================================
-- TESTIMONY MEDIA
-- =========================================================

CREATE POLICY "media_select" ON public.testimony_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.testimonies t
      WHERE t.id = testimony_id
        AND (t.status = 'published' OR t.submitted_by = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "media_insert" ON public.testimony_media
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.testimonies t
      WHERE t.id = testimony_id AND t.submitted_by = auth.uid()
    )
  );

CREATE POLICY "media_delete" ON public.testimony_media
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.testimonies t
      WHERE t.id = testimony_id AND (t.submitted_by = auth.uid() OR public.is_admin())
    )
  );

-- =========================================================
-- SPECIES
-- =========================================================

CREATE POLICY "species_select_all" ON public.species
  FOR SELECT USING (true);

CREATE POLICY "species_write_admin" ON public.species
  FOR ALL USING (public.is_admin());

-- =========================================================
-- TESTIMONY SPECIES
-- =========================================================

CREATE POLICY "testimony_species_select" ON public.testimony_species
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.testimonies t
      WHERE t.id = testimony_id
        AND (t.status = 'published' OR t.submitted_by = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "testimony_species_insert" ON public.testimony_species
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.testimonies t
      WHERE t.id = testimony_id AND t.submitted_by = auth.uid()
    )
  );

-- =========================================================
-- STORAGE BUCKET POLICIES
-- =========================================================

-- Run these in Supabase dashboard > Storage:
-- 1. Create bucket named 'testimony-media' (public: false)
-- 2. Add policies:

-- SELECT: published testimony media is public
-- INSERT: authenticated users can upload to testimony-media/<testimony_id>/

COMMENT ON TABLE public.testimonies IS
  'Testimonies from Mauritians about their historical memories of the marine ecosystem.
   status: draft → pending → published | rejected
   year_of_memory: the year the MEMORY refers to (not when it was collected)';
