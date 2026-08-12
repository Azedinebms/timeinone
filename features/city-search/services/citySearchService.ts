import {
  cityRepository,
  type CityRepositoryRecord,
} from "@/lib/repositories/cityRepository";

import type {
  CitySearchResult,
} from "../types";

const DEFAULT_SEARCH_LIMIT =
  10;

const MAX_SEARCH_LIMIT =
  20;

export const CITY_SEARCH_MIN_QUERY_LENGTH =
  2;

function normalizeQuery(
  query: string,
): string {
  try {
    return decodeURIComponent(
      query,
    )
      .trim()
      .replace(/\s+/g, " ");
  } catch {
    return query
      .trim()
      .replace(/\s+/g, " ");
  }
}

function normalizeLimit(
  limit: number | undefined,
): number {
  if (
    typeof limit !== "number" ||
    !Number.isFinite(limit)
  ) {
    return DEFAULT_SEARCH_LIMIT;
  }

  return Math.min(
    MAX_SEARCH_LIMIT,
    Math.max(
      1,
      Math.floor(limit),
    ),
  );
}

function decimalToNumber(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value === "number"
  ) {
    return Number.isFinite(value)
      ? value
      : null;
  }

  const parsedValue =
    Number(String(value));

  return Number.isFinite(
    parsedValue,
  )
    ? parsedValue
    : null;
}

function normalizeCitySlug(
  slug: string,
): string {
  try {
    return decodeURIComponent(
      slug,
    )
      .trim()
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  } catch {
    return slug
      .trim()
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

function normalizeCountryCode(
  countryCode: string,
): string {
  return countryCode
    .trim()
    .toLowerCase();
}

function createRouteSlug(
  city: Pick<
    CityRepositoryRecord,
    "slug" | "country"
  >,
): string {
  const citySlug =
    normalizeCitySlug(
      city.slug,
    );

  const countryCode =
    normalizeCountryCode(
      city.country.iso2,
    );

  return `${citySlug}-${countryCode}`;
}

function mapCityRecord(
  city: CityRepositoryRecord,
): CitySearchResult {
  const routeSlug =
    createRouteSlug(
      city,
    );

  return {
    id:
      city.id,

    geonameId:
      city.geonameId,

    name:
      city.name,

    asciiName:
      city.asciiName,

    slug:
      city.slug,

    country: {
      id:
        city.country.id,

      name:
        city.country.name,

      iso2:
        city.country.iso2,

      iso3:
        city.country.iso3,
    },

    timezone: {
      id:
        city.timezone.id,

      name:
        city.timezone.name,
    },

    latitude:
      decimalToNumber(
        city.latitude,
      ),

    longitude:
      decimalToNumber(
        city.longitude,
      ),

    population:
      city.population,

    routeSlug,

    worldClockPath:
      `/world-clock/${routeSlug}`,
  };
}

/**
 * Une URL TimeInOne World Clock est basée sur :
 *
 * slug + code pays
 *
 * Plusieurs enregistrements GeoNames peuvent
 * produire la même URL. On conserve donc
 * uniquement le premier résultat, déjà classé
 * par pertinence et population par le repository.
 */
function deduplicateCanonicalCities(
  cities: CityRepositoryRecord[],
): CityRepositoryRecord[] {
  const seenRoutes =
    new Set<string>();

  const results:
    CityRepositoryRecord[] = [];

  for (const city of cities) {
    const routeSlug =
      createRouteSlug(
        city,
      );

    if (
      seenRoutes.has(
        routeSlug,
      )
    ) {
      continue;
    }

    seenRoutes.add(
      routeSlug,
    );

    results.push(
      city,
    );
  }

  return results;
}

export async function searchAtlasCities(
  query: string,
  limit =
    DEFAULT_SEARCH_LIMIT,
): Promise<
  CitySearchResult[]
> {
  const normalizedQuery =
    normalizeQuery(
      query,
    );

  if (
    normalizedQuery.length <
    CITY_SEARCH_MIN_QUERY_LENGTH
  ) {
    return [];
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
    );

  /*
   * On demande davantage de résultats au
   * repository pour compenser les éventuels
   * doublons slug + pays.
   */
  const repositoryLimit =
    Math.min(
      normalizedLimit * 3,
      100,
    );

  const records =
    await cityRepository
      .searchCities(
        normalizedQuery,
        repositoryLimit,
      );

  return deduplicateCanonicalCities(
    records,
  )
    .slice(
      0,
      normalizedLimit,
    )
    .map(
      mapCityRecord,
    );
}

export function getNormalizedCitySearchQuery(
  query: string,
): string {
  return normalizeQuery(
    query,
  );
}

export function getNormalizedCitySearchLimit(
  limit: number | undefined,
): number {
  return normalizeLimit(
    limit,
  );
}

function splitRouteSlug(
  routeSlug: string,
): {
  slug: string;
  countryCode: string;
} | null {
  const normalizedValue =
    routeSlug
      .trim()
      .toLowerCase();

  const match =
    normalizedValue.match(
      /^(.+)-([a-z]{2})$/,
    );

  if (!match) {
    return null;
  }

  const [
    ,
    slug,
    countryCode,
  ] = match;

  if (
    !slug ||
    !countryCode
  ) {
    return null;
  }

  return {
    slug,
    countryCode:
      countryCode.toUpperCase(),
  };
}

export async function resolveAtlasCitiesByRouteSlugs(
  routeSlugs:
    string[],
): Promise<
  CitySearchResult[]
> {
  const normalizedRouteSlugs =
    Array.from(
      new Set(
        routeSlugs
          .map(
            (routeSlug) =>
              routeSlug
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ).slice(
      0,
      5,
    );

  const resolvedCities =
    await Promise.all(
      normalizedRouteSlugs.map(
        async (
          routeSlug,
        ) => {
          const parsedRoute =
            splitRouteSlug(
              routeSlug,
            );

          if (!parsedRoute) {
            return null;
          }

          const city =
            await cityRepository
              .getCityBySlugAndCountryCode(
                parsedRoute.slug,
                parsedRoute.countryCode,
              );

          return city
            ? mapCityRecord(
                city,
              )
            : null;
        },
      ),
    );

  return resolvedCities.filter(
    (
      city,
    ): city is CitySearchResult =>
      city !== null,
  );
}

export const citySearchService = {
  search:
    searchAtlasCities,

  resolveByRouteSlugs:
    resolveAtlasCitiesByRouteSlugs,

  normalizeQuery:
    getNormalizedCitySearchQuery,

  normalizeLimit:
    getNormalizedCitySearchLimit,
};

export default citySearchService;