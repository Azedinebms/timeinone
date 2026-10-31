import "server-only";

import { getPostgres } from "@/lib/db/postgres";

const DEFAULT_POPULAR_LIMIT = 24;
const MAX_LIST_LIMIT = 100;
const DEFAULT_SEARCH_LIMIT = 20;
const SEARCH_EXPANSION_FACTOR = 3;

export type CityRepositoryRecord = {
  id: number;
  geonameId: number;
  name: string;
  asciiName: string | null;
  slug: string;
  latitude: unknown;
  longitude: unknown;
  population: number | null;
  country: { id: number; name: string; iso2: string; iso3: string | null };
  timezone: { id: number; name: string };
};

type DbRow = Record<string, unknown>;

// Preserve the original repository's nested country/timezone response shape.
function mapCity(row: DbRow): CityRepositoryRecord {
  return {
    id: Number(row.id),
    geonameId: Number(row.geonameId),
    name: String(row.name),
    asciiName: row.asciiName == null ? null : String(row.asciiName),
    slug: String(row.slug),
    // Neon returns PostgreSQL DECIMAL as a string, preserving precision.
    latitude: row.latitude,
    longitude: row.longitude,
    population: row.population == null ? null : Number(row.population),
    country: {
      id: Number(row.country_id),
      name: String(row.country_name),
      iso2: String(row.country_iso2),
      iso3: row.country_iso3 == null ? null : String(row.country_iso3),
    },
    timezone: {
      id: Number(row.timezone_id),
      name: String(row.timezone_name),
    },
  };
}

const SELECT_CITY = `
  SELECT c.id, c."geonameId", c.name, c."asciiName", c.slug,
         c.latitude::text AS latitude, c.longitude::text AS longitude,
         c.population,
         co.id AS country_id, co.name AS country_name,
         co.iso2 AS country_iso2, co.iso3 AS country_iso3,
         tz.id AS timezone_id, tz.name AS timezone_name
  FROM cities c
  JOIN countries co ON co.id = c."countryId"
  JOIN timezones tz ON tz.id = c."timezoneId"
`;

const ORDER_POPULAR = `ORDER BY c.population DESC NULLS LAST, c.name ASC, c."geonameId" ASC`;

function normalizeSlug(slug: string): string {
  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch { /* malformed encoding */ }
  return decoded.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function normalizeCountryCode(code: string): string {
  return code.trim().toUpperCase();
}

function normalizeSearchQuery(query: string): string {
  let decoded = query;
  try { decoded = decodeURIComponent(query); } catch { /* malformed encoding */ }
  return decoded.trim().replace(/\s+/g, " ");
}

function removeDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeLimit(limit: number | undefined, fallback: number): number {
  if (typeof limit !== "number" || !Number.isFinite(limit)) return fallback;
  return Math.min(MAX_LIST_LIMIT, Math.max(1, Math.floor(limit)));
}

function deduplicateCitiesById(groups: CityRepositoryRecord[][], limit: number): CityRepositoryRecord[] {
  const seen = new Set<number>();
  const results: CityRepositoryRecord[] = [];
  for (const group of groups) {
    for (const city of group) {
      if (seen.has(city.id)) continue;
      seen.add(city.id);
      results.push(city);
      if (results.length >= limit) return results;
    }
  }
  return results;
}

// Parameterized SQL with Neon query() prevents injection, including in LIKE filters.
async function queryCities(where: string, params: unknown[], limit: number, order = ORDER_POPULAR): Promise<CityRepositoryRecord[]> {
  const pool = getPostgres();

const text = `${SELECT_CITY} WHERE ${where} ${order} LIMIT $${params.length + 1}`;

const result = await pool.query(text, [...params, limit]);

return result.rows.map((row) => mapCity(row as DbRow));
}

export async function getCityById(cityId: number): Promise<CityRepositoryRecord | null> {
  if (!Number.isInteger(cityId) || cityId <= 0) return null;
  return (await queryCities('c.id = $1', [cityId], 1, ''))[0] ?? null;
}

export async function getCityByGeonameId(geonameId: number): Promise<CityRepositoryRecord | null> {
  if (!Number.isInteger(geonameId) || geonameId <= 0) return null;
  return (await queryCities('c."geonameId" = $1', [geonameId], 1, ''))[0] ?? null;
}

export async function getCityBySlug(slug: string): Promise<CityRepositoryRecord | null> {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;
  return (await queryCities('c.slug = $1', [normalized], 1,
    'ORDER BY c.population DESC NULLS LAST, c."geonameId" ASC, c.id ASC'))[0] ?? null;
}

export async function getCityBySlugAndCountryCode(slug: string, countryCode: string): Promise<CityRepositoryRecord | null> {
  const normalized = normalizeSlug(slug);
  const code = normalizeCountryCode(countryCode);
  if (!normalized || code.length !== 2) return null;
  return (await queryCities('c.slug = $1 AND co.iso2 = $2', [normalized, code], 1,
    'ORDER BY c.population DESC NULLS LAST, c."geonameId" ASC, c.id ASC'))[0] ?? null;
}

export async function getPopularCities(limit = DEFAULT_POPULAR_LIMIT): Promise<CityRepositoryRecord[]> {
  return queryCities('c.population > 0', [], normalizeLimit(limit, DEFAULT_POPULAR_LIMIT));
}

export async function getCitiesByCountry(countryCode: string, limit = DEFAULT_POPULAR_LIMIT): Promise<CityRepositoryRecord[]> {
  const code = normalizeCountryCode(countryCode);
  if (code.length !== 2) return [];
  return queryCities('co.iso2 = $1', [code], normalizeLimit(limit, DEFAULT_POPULAR_LIMIT));
}

export async function getCitiesByTimezone(timezoneName: string, limit = DEFAULT_POPULAR_LIMIT): Promise<CityRepositoryRecord[]> {
  const name = normalizeSearchQuery(timezoneName);
  if (!name) return [];
  return queryCities('LOWER(tz.name) = LOWER($1)', [name], normalizeLimit(limit, DEFAULT_POPULAR_LIMIT));
}

// Escape user-supplied LIKE metacharacters so search behaves like Prisma's
// startsWith/contains, rather than treating % and _ as wildcards.
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function searchCities(query: string, limit = DEFAULT_SEARCH_LIMIT): Promise<CityRepositoryRecord[]> {
  const q = normalizeSearchQuery(query);
  if (q.length < 2) return [];
  const normalizedLimit = normalizeLimit(limit, DEFAULT_SEARCH_LIMIT);
  const expanded = Math.min(normalizedLimit * SEARCH_EXPANSION_FACTOR, MAX_LIST_LIMIT);
  const ascii = removeDiacritics(q);
  const slug = normalizeSlug(q);
  const upper = q.toUpperCase();
  const prefixQ = `${escapeLike(q)}%`;
  const prefixAscii = `${escapeLike(ascii)}%`;
  const containsQ = `%${escapeLike(q)}%`;
  const containsAscii = `%${escapeLike(ascii)}%`;
  const containsSlug = `%${escapeLike(slug)}%`;

  const groups = await Promise.all([
    queryCities('c.name ILIKE $1', [q], expanded),
    queryCities('c."asciiName" ILIKE $1', [ascii], expanded),
    queryCities('c.slug = $1', [slug], expanded),
    queryCities('c.name ILIKE $1', [prefixQ], expanded),
    queryCities('c."asciiName" ILIKE $1', [prefixAscii], expanded),
    queryCities('(co.name ILIKE $1 OR co.name ILIKE $2 OR co.iso2 = $3 OR co.iso3 = $3)',
      [q, prefixQ, upper], expanded),
    queryCities('tz.name ILIKE $1', [containsQ], expanded),
    queryCities(`(c.name ILIKE $1 OR c."asciiName" ILIKE $2 OR c.slug LIKE $3
      OR co.name ILIKE $1 OR tz.name ILIKE $1)`,
      [containsQ, containsAscii, containsSlug], expanded),
  ]);
  return deduplicateCitiesById(groups, normalizedLimit);
}

export async function getRelatedCities(cityId: number, limit = 6): Promise<CityRepositoryRecord[]> {
  const current = await getCityById(cityId);
  if (!current) return [];
  const normalizedLimit = normalizeLimit(limit, 6);
  const sameCountry = await queryCities('c.id <> $1 AND c."countryId" = $2',
    [current.id, current.country.id], normalizedLimit);
  if (sameCountry.length >= normalizedLimit) return sameCountry;
  const excludedIds = [current.id, ...sameCountry.map((city) => city.id)];
  const sameTimezone = await queryCities(
    'NOT (c.id = ANY($1::int[])) AND c."timezoneId" = $2',
    [excludedIds, current.timezone.id], normalizedLimit - sameCountry.length);
  return [...sameCountry, ...sameTimezone];
}

export const cityRepository = {
  getCityById,
  getCityByGeonameId,
  getCityBySlug,
  getCityBySlugAndCountryCode,
  getPopularCities,
  getCitiesByCountry,
  getCitiesByTimezone,
  searchCities,
  getRelatedCities,
};

export default cityRepository;
