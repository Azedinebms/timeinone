import "server-only";

import { getNeon } from "@/lib/db/neon";

export type CityWithRelations = {
  id: number;
  geonameId: number;
  name: string;
  asciiName: string | null;
  slug: string;
  latitude: unknown;
  longitude: unknown;
  population: number | null;
  country: { name: string; iso2: string };
  timezone: { name: string };
};

type CityRow = {
  id: number;
  geonameId: number;
  name: string;
  asciiName: string | null;
  slug: string;
  latitude: string | null;
  longitude: string | null;
  population: number | null;
  countryName: string;
  countryIso2: string;
  timezoneName: string;
};

function mapCity(row: CityRow): CityWithRelations {
  return {
    id: Number(row.id),
    geonameId: Number(row.geonameId),
    name: row.name,
    asciiName: row.asciiName,
    slug: row.slug,
    latitude: row.latitude,
    longitude: row.longitude,
    population: row.population === null ? null : Number(row.population),
    country: { name: row.countryName, iso2: row.countryIso2 },
    timezone: { name: row.timezoneName },
  };
}

function normalizeLimit(limit: number, maximum: number): number {
  if (!Number.isFinite(limit)) return maximum;
  return Math.min(Math.max(Math.floor(limit), 0), maximum);
}

export async function getPopularCities(limit = 20): Promise<CityWithRelations[]> {
  const sql = await getNeon();
  const safeLimit = normalizeLimit(limit, 500);
  const rows = await sql`
    SELECT city.id, city."geonameId", city.name, city."asciiName", city.slug,
      city.latitude::text AS latitude, city.longitude::text AS longitude, city.population,
      country.name AS "countryName", country.iso2 AS "countryIso2",
      timezone.name AS "timezoneName"
    FROM cities AS city
    JOIN countries AS country ON country.id = city."countryId"
    JOIN timezones AS timezone ON timezone.id = city."timezoneId"
    ORDER BY city.population DESC NULLS LAST, city.name ASC
    LIMIT ${safeLimit}
  `;
  return rows.map((row) => mapCity(row as CityRow));
}

export async function getCityById(id: number): Promise<CityWithRelations | null> {
  if (!Number.isInteger(id)) return null;
  const sql = await getNeon();
  const rows = await sql`
    SELECT city.id, city."geonameId", city.name, city."asciiName", city.slug,
      city.latitude::text AS latitude, city.longitude::text AS longitude, city.population,
      country.name AS "countryName", country.iso2 AS "countryIso2",
      timezone.name AS "timezoneName"
    FROM cities AS city
    JOIN countries AS country ON country.id = city."countryId"
    JOIN timezones AS timezone ON timezone.id = city."timezoneId"
    WHERE city.id = ${id}
    LIMIT 1
  `;
  return rows.length ? mapCity(rows[0] as CityRow) : null;
}

export async function getCityByGeonameId(geonameId: number): Promise<CityWithRelations | null> {
  if (!Number.isInteger(geonameId)) return null;
  const sql = await getNeon();
  const rows = await sql`
    SELECT city.id, city."geonameId", city.name, city."asciiName", city.slug,
      city.latitude::text AS latitude, city.longitude::text AS longitude, city.population,
      country.name AS "countryName", country.iso2 AS "countryIso2",
      timezone.name AS "timezoneName"
    FROM cities AS city
    JOIN countries AS country ON country.id = city."countryId"
    JOIN timezones AS timezone ON timezone.id = city."timezoneId"
    WHERE city."geonameId" = ${geonameId}
    LIMIT 1
  `;
  return rows.length ? mapCity(rows[0] as CityRow) : null;
}

export async function getCityBySlug(
  slug: string,
  countryIso2?: string,
): Promise<CityWithRelations | null> {
  const sql = await getNeon();
  const normalizedSlug = slug.toLowerCase();
  const normalizedCountry = countryIso2?.toUpperCase() ?? null;
  const rows = await sql`
    SELECT city.id, city."geonameId", city.name, city."asciiName", city.slug,
      city.latitude::text AS latitude, city.longitude::text AS longitude, city.population,
      country.name AS "countryName", country.iso2 AS "countryIso2",
      timezone.name AS "timezoneName"
    FROM cities AS city
    JOIN countries AS country ON country.id = city."countryId"
    JOIN timezones AS timezone ON timezone.id = city."timezoneId"
    WHERE city.slug = ${normalizedSlug}
      AND (${normalizedCountry}::text IS NULL OR country.iso2 = ${normalizedCountry})
    ORDER BY city.population DESC NULLS LAST
    LIMIT 1
  `;
  return rows.length ? mapCity(rows[0] as CityRow) : null;
}

export async function getCityBySlugAndCountry(
  slug: string,
  countryIso2: string,
): Promise<CityWithRelations | null> {
  return getCityBySlug(slug, countryIso2);
}

export async function searchCities(query: string, limit = 20): Promise<CityWithRelations[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) return [];
  const safeLimit = Math.min(Math.max(Number.isFinite(limit) ? Math.floor(limit) : 20, 1), 50);
  const sql = await getNeon();
  // PostgreSQL pg_trgm extension is required, as in the original Prisma SQL.
  const rows = await sql`
    SELECT city.id, city."geonameId", city.name, city."asciiName", city.slug,
      city.latitude::text AS latitude, city.longitude::text AS longitude, city.population,
      country.name AS "countryName", country.iso2 AS "countryIso2",
      timezone.name AS "timezoneName",
      GREATEST(
        similarity(LOWER(city.name), ${normalizedQuery}),
        similarity(LOWER(COALESCE(city."asciiName", '')), ${normalizedQuery}),
        similarity(LOWER(city.slug), ${normalizedQuery})
      ) AS "similarityScore"
    FROM cities AS city
    JOIN countries AS country ON country.id = city."countryId"
    JOIN timezones AS timezone ON timezone.id = city."timezoneId"
    WHERE LOWER(city.name) LIKE '%' || ${normalizedQuery} || '%'
      OR LOWER(COALESCE(city."asciiName", '')) LIKE '%' || ${normalizedQuery} || '%'
      OR LOWER(city.slug) LIKE '%' || ${normalizedQuery} || '%'
      OR similarity(LOWER(city.name), ${normalizedQuery}) >= 0.2
      OR similarity(LOWER(COALESCE(city."asciiName", '')), ${normalizedQuery}) >= 0.2
    ORDER BY
      CASE
        WHEN LOWER(city.name) = ${normalizedQuery} THEN 0
        WHEN LOWER(city."asciiName") = ${normalizedQuery} THEN 1
        WHEN LOWER(city.name) LIKE ${normalizedQuery} || '%' THEN 2
        WHEN LOWER(city."asciiName") LIKE ${normalizedQuery} || '%' THEN 3
        ELSE 4
      END,
      "similarityScore" DESC,
      city.population DESC NULLS LAST,
      city.name ASC
    LIMIT ${safeLimit}
  `;
  return rows.map((row) => mapCity(row as CityRow));
}
