CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS cities_name_trgm_idx
ON cities
USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS cities_ascii_name_trgm_idx
ON cities
USING GIN ("asciiName" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS cities_slug_trgm_idx
ON cities
USING GIN (slug gin_trgm_ops);

CREATE INDEX IF NOT EXISTS cities_population_desc_idx
ON cities (population DESC NULLS LAST);