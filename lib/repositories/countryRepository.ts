
import "server-only";

import { getNeon } from "@/lib/db/neon";

const DEFAULT_COUNTRY_LIMIT = 250;
const DEFAULT_CITY_LIMIT = 100;
const MAX_CITY_LIMIT = 500;

export type CountryRepositoryRecord = {
  id: number;
  name: string;
  iso2: string;
  iso3: string | null;
  _count: {
    cities: number;
  };
};

export type CountryCityRepositoryRecord = {
  id: number;
  geonameId: number;
  name: string;
  asciiName: string | null;
  slug: string;
  latitude: unknown;
  longitude: unknown;
  population: number | null;
  country: {
    id: number;
    name: string;
    iso2: string;
    iso3: string | null;
  };
  timezone: {
    id: number;
    name: string;
  };
};

function normalizeCountryCode(code: string): string {
  return code.trim().toUpperCase();
}

function normalizeLimit(
  limit: number | undefined,
  fallback: number,
  maximum: number
): number {
  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(1, Math.floor(limit)));
}

export async function getAllCountriesWithCityCounts(
  limit = DEFAULT_COUNTRY_LIMIT
): Promise<CountryRepositoryRecord[]> {
  const sql = await getNeon();
  const normalizedLimit = normalizeLimit(
    limit,
    DEFAULT_COUNTRY_LIMIT,
    DEFAULT_COUNTRY_LIMIT
  );

  const rows = await sql`
    SELECT
      co.id,
      co.name,
      co.iso2,
      co.iso3,
      COUNT(ci.id)::int AS city_count
    FROM countries co
    INNER JOIN cities ci ON ci."countryId" = co.id
    GROUP BY co.id, co.name, co.iso2, co.iso3
    ORDER BY co.name ASC
    LIMIT ${normalizedLimit}
  `;

  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    iso2: String(row.iso2),
    iso3: row.iso3 as string | null,
    _count: {
      cities: Number(row.city_count),
    },
  }));
}

export async function getCountryByCode(
  countryCode: string
): Promise<CountryRepositoryRecord | null> {
  const normalizedCode = normalizeCountryCode(countryCode);

  if (normalizedCode.length !== 2) {
    return null;
  }

  const sql = await getNeon();

  const rows = await sql`
    SELECT
      co.id,
      co.name,
      co.iso2,
      co.iso3,
      (
        SELECT COUNT(*)::int
        FROM cities ci
        WHERE ci."countryId" = co.id
      ) AS city_count
    FROM countries co
    WHERE co.iso2 = ${normalizedCode}
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0];

  return {
    id: Number(row.id),
    name: String(row.name),
    iso2: String(row.iso2),
    iso3: row.iso3 as string | null,
    _count: {
      cities: Number(row.city_count),
    },
  };
}

export async function getPopularCitiesByCountryCode(
  countryCode: string,
  limit = DEFAULT_CITY_LIMIT
): Promise<CountryCityRepositoryRecord[]> {
  const normalizedCode = normalizeCountryCode(countryCode);

  if (normalizedCode.length !== 2) {
    return [];
  }

  const normalizedLimit = normalizeLimit(
    limit,
    DEFAULT_CITY_LIMIT,
    MAX_CITY_LIMIT
  );

  const sql = await getNeon();

  const rows = await sql`
    SELECT
      ci.id,
      ci."geonameId",
      ci.name,
      ci."asciiName",
      ci.slug,
      ci.latitude::text AS latitude,
      ci.longitude::text AS longitude,
      ci.population,
      co.id AS country_id,
      co.name AS country_name,
      co.iso2 AS country_iso2,
      co.iso3 AS country_iso3,
      tz.id AS timezone_id,
      tz.name AS timezone_name
    FROM cities ci
    INNER JOIN countries co ON co.id = ci."countryId"
    INNER JOIN timezones tz ON tz.id = ci."timezoneId"
    WHERE co.iso2 = ${normalizedCode}
    ORDER BY ci.population DESC NULLS LAST, ci.name ASC
    LIMIT ${normalizedLimit}
  `;

  return rows.map((row) => ({
    id: Number(row.id),
    geonameId: Number(row.geonameId),
    name: String(row.name),
    asciiName: row.asciiName as string | null,
    slug: String(row.slug),
    latitude: row.latitude,
    longitude: row.longitude,
    population:
      row.population === null ? null : Number(row.population),
    country: {
      id: Number(row.country_id),
      name: String(row.country_name),
      iso2: String(row.country_iso2),
      iso3: row.country_iso3 as string | null,
    },
    timezone: {
      id: Number(row.timezone_id),
      name: String(row.timezone_name),
    },
  }));
}

export const countryRepository = {
  getAllCountriesWithCityCounts,
  getCountryByCode,
  getPopularCitiesByCountryCode,
};

export default countryRepository;
