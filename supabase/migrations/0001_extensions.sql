-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS "postgis";
-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Fuzzy text search (for species name search)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- Accent-insensitive search (French/Kreol names)
CREATE EXTENSION IF NOT EXISTS "unaccent";
