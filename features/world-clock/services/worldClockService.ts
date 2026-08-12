import {
  unstable_cache,
} from "next/cache";

import {
  cityRepository,
  type CityRepositoryRecord,
} from "@/lib/repositories/cityRepository";

import {
  getPopularWorldClockCities as getStaticPopularCities,
  getPopularWorldClockCityBySlug as getStaticCityBySlug,
  getRelatedWorldClockCities as getStaticRelatedCities,
} from "../data/popular-cities";

import type {
  WorldClockCity,
} from "../types";

const DEFAULT_POPULAR_CITY_LIMIT =
  24;

const DEFAULT_RELATED_CITY_LIMIT =
  6;

const MAX_CITY_LIMIT =
  100;

const CITY_CACHE_SECONDS =
  60 * 60;

const POPULAR_CITIES_CACHE_SECONDS =
  60 * 60 * 6;

const RELATED_CITIES_CACHE_SECONDS =
  60 * 60 * 6;

const SEARCH_CACHE_SECONDS =
  60 * 15;

export const WORLD_CLOCK_CACHE_TAGS = {
  cities:
    "atlas:world-clock:cities",

  popularCities:
    "atlas:world-clock:popular-cities",

  relatedCities:
    "atlas:world-clock:related-cities",

  searches:
    "atlas:world-clock:searches",
} as const;

function normalizeLimit(
  limit: number,
  fallback: number,
): number {
  if (
    !Number.isFinite(limit) ||
    limit <= 0
  ) {
    return fallback;
  }

  return Math.min(
    Math.floor(limit),
    MAX_CITY_LIMIT,
  );
}

function normalizeSlug(
  slug: string,
): string {
  try {
    return decodeURIComponent(
      slug,
    )
      .trim()
      .toLowerCase();
  } catch {
    return slug
      .trim()
      .toLowerCase();
  }
}

function normalizeCountryCode(
  countryCode: string,
): string {
  return countryCode
    .trim()
    .toUpperCase();
}

function normalizeSearchQuery(
  query: string,
): string {
  return query
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
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
    return Number.isFinite(
      value,
    )
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

function getRegionFromTimezone(
  timezoneName: string,
): string {
  const timezoneRegion =
    timezoneName.split("/")[0];

  switch (timezoneRegion) {
    case "Africa":
      return "Africa";

    case "America":
      return "Americas";

    case "Antarctica":
      return "Antarctica";

    case "Arctic":
      return "Arctic";

    case "Asia":
      return "Asia";

    case "Atlantic":
      return "Atlantic";

    case "Australia":
    case "Pacific":
      return "Oceania";

    case "Europe":
      return "Europe";

    case "Indian":
      return "Indian Ocean";

    default:
      return "Global";
  }
}

function mapCityRecord(
  record:
    CityRepositoryRecord,
  priority = 0,
): WorldClockCity {
  return {
    id:
      record.id,

    geonameId:
      record.geonameId,

    slug:
      record.slug,

    name:
      record.name,

    asciiName:
      record.asciiName,

    country:
      record.country.name,

    countryCode:
      record.country.iso2,

    timeZone:
      record.timezone.name,

    region:
      getRegionFromTimezone(
        record.timezone.name,
      ),

    latitude:
      decimalToNumber(
        record.latitude,
      ),

    longitude:
      decimalToNumber(
        record.longitude,
      ),

    population:
      record.population,

    priority,
  };
}

function deduplicateCitiesBySlugAndCountry(
  cities:
    CityRepositoryRecord[],
): CityRepositoryRecord[] {
  const seenKeys =
    new Set<string>();

  const uniqueCities:
    CityRepositoryRecord[] = [];

  for (const city of cities) {
    const uniqueKey =
      [
        city.slug
          .trim()
          .toLowerCase(),

        city.country.iso2
          .trim()
          .toLowerCase(),
      ].join(":");

    if (
      seenKeys.has(
        uniqueKey,
      )
    ) {
      continue;
    }

    seenKeys.add(
      uniqueKey,
    );

    uniqueCities.push(
      city,
    );
  }

  return uniqueCities;
}

function getStaticCities(
  limit: number,
): WorldClockCity[] {
  return getStaticPopularCities()
    .slice(
      0,
      limit,
    );
}

async function loadWorldClockCityBySlug(
  slug: string,
): Promise<
  WorldClockCity | null
> {
  try {
    const databaseCity =
      await cityRepository
        .getCityBySlug(
          slug,
        );

    if (databaseCity) {
      return mapCityRecord(
        databaseCity,
      );
    }
  } catch (error) {
    console.error(
      "[WorldClock] Database city lookup failed:",
      error,
    );
  }

  return getStaticCityBySlug(
    slug,
  );
}

const getCachedWorldClockCityBySlug =
  unstable_cache(
    loadWorldClockCityBySlug,

    [
      "atlas",
      "world-clock",
      "city-by-slug",
    ],

    {
      revalidate:
        CITY_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_CACHE_TAGS
          .cities,
      ],
    },
  );

export async function getWorldClockCityBySlug(
  slug: string,
): Promise<
  WorldClockCity | null
> {
  const normalizedSlug =
    normalizeSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  return getCachedWorldClockCityBySlug(
    normalizedSlug,
  );
}

async function loadWorldClockCityBySlugAndCountry(
  slug: string,
  countryCode: string,
): Promise<
  WorldClockCity | null
> {
  try {
    const databaseCity =
      await cityRepository
        .getCityBySlugAndCountryCode(
          slug,
          countryCode,
        );

    if (databaseCity) {
      return mapCityRecord(
        databaseCity,
      );
    }
  } catch (error) {
    console.error(
      "[WorldClock] Country city lookup failed:",
      error,
    );
  }

  const staticCity =
    getStaticCityBySlug(
      slug,
    );

  if (
    staticCity?.countryCode
      .toUpperCase() ===
    countryCode.toUpperCase()
  ) {
    return staticCity;
  }

  return null;
}

const getCachedWorldClockCityBySlugAndCountry =
  unstable_cache(
    loadWorldClockCityBySlugAndCountry,

    [
      "atlas",
      "world-clock",
      "city-by-slug-and-country",
    ],

    {
      revalidate:
        CITY_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_CACHE_TAGS
          .cities,
      ],
    },
  );

export async function getWorldClockCityBySlugAndCountry(
  slug: string,
  countryCode: string,
): Promise<
  WorldClockCity | null
> {
  const normalizedSlug =
    normalizeSlug(slug);

  const normalizedCountryCode =
    normalizeCountryCode(
      countryCode,
    );

  if (
    !normalizedSlug ||
    normalizedCountryCode.length !==
      2
  ) {
    return null;
  }

  return getCachedWorldClockCityBySlugAndCountry(
    normalizedSlug,
    normalizedCountryCode,
  );
}

async function loadWorldClockIndexCities(
  limit: number,
): Promise<
  WorldClockCity[]
> {
  try {
    const records =
      await cityRepository
        .getPopularCities(
          Math.min(
            limit * 3,
            MAX_CITY_LIMIT,
          ),
        );

    const uniqueRecords =
      deduplicateCitiesBySlugAndCountry(
        records,
      ).slice(
        0,
        limit,
      );

    if (
      uniqueRecords.length > 0
    ) {
      return uniqueRecords.map(
        (
          record,
          index,
        ) =>
          mapCityRecord(
            record,
            index + 1,
          ),
      );
    }
  } catch (error) {
    console.error(
      "[WorldClock] Popular city query failed:",
      error,
    );
  }

  return getStaticCities(
    limit,
  );
}

const getCachedWorldClockIndexCities =
  unstable_cache(
    loadWorldClockIndexCities,

    [
      "atlas",
      "world-clock",
      "index-cities",
    ],

    {
      revalidate:
        POPULAR_CITIES_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_CACHE_TAGS
          .cities,

        WORLD_CLOCK_CACHE_TAGS
          .popularCities,
      ],
    },
  );

export async function getWorldClockIndexCities(
  limit =
    DEFAULT_POPULAR_CITY_LIMIT,
): Promise<
  WorldClockCity[]
> {
  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_POPULAR_CITY_LIMIT,
    );

  return getCachedWorldClockIndexCities(
    normalizedLimit,
  );
}

async function loadRelatedWorldClockCities(
  cityId: number,
  citySlug: string,
  cityCountryCode: string,
  limit: number,
): Promise<
  WorldClockCity[]
> {
  try {
    const records =
      await cityRepository
        .getRelatedCities(
          cityId,
          Math.min(
            limit * 2,
            MAX_CITY_LIMIT,
          ),
        );

    const uniqueRecords =
      deduplicateCitiesBySlugAndCountry(
        records,
      )
        .filter(
          (record) =>
            !(
              record.slug ===
                citySlug &&
              record.country.iso2 ===
                cityCountryCode
            ),
        )
        .slice(
          0,
          limit,
        );

    if (
      uniqueRecords.length > 0
    ) {
      return uniqueRecords.map(
        (
          record,
          index,
        ) =>
          mapCityRecord(
            record,
            index + 1,
          ),
      );
    }
  } catch (error) {
    console.error(
      "[WorldClock] Related city query failed:",
      error,
    );
  }

  return [];
}

const getCachedRelatedWorldClockCities =
  unstable_cache(
    loadRelatedWorldClockCities,

    [
      "atlas",
      "world-clock",
      "related-cities",
    ],

    {
      revalidate:
        RELATED_CITIES_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_CACHE_TAGS
          .cities,

        WORLD_CLOCK_CACHE_TAGS
          .relatedCities,
      ],
    },
  );

export async function getRelatedWorldClockCitiesForCity(
  city: WorldClockCity,
  limit =
    DEFAULT_RELATED_CITY_LIMIT,
): Promise<
  WorldClockCity[]
> {
  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_RELATED_CITY_LIMIT,
    );

  if (
    typeof city.id === "number"
  ) {
    const databaseCities =
      await getCachedRelatedWorldClockCities(
        city.id,
        city.slug,
        city.countryCode,
        normalizedLimit,
      );

    if (
      databaseCities.length > 0
    ) {
      return databaseCities;
    }
  }

  return getStaticRelatedCities(
    city,
    normalizedLimit,
  );
}

async function loadWorldClockSearch(
  query: string,
  limit: number,
): Promise<
  WorldClockCity[]
> {
  try {
    const records =
      await cityRepository
        .searchCities(
          query,
          Math.min(
            limit * 2,
            MAX_CITY_LIMIT,
          ),
        );

    const uniqueRecords =
      deduplicateCitiesBySlugAndCountry(
        records,
      ).slice(
        0,
        limit,
      );

    if (
      uniqueRecords.length > 0
    ) {
      return uniqueRecords.map(
        (
          record,
          index,
        ) =>
          mapCityRecord(
            record,
            index + 1,
          ),
      );
    }
  } catch (error) {
    console.error(
      "[WorldClock] City search failed:",
      error,
    );
  }

  return getStaticPopularCities()
    .filter(
      (city) =>
        city.name
          .toLowerCase()
          .includes(query) ||
        city.country
          .toLowerCase()
          .includes(query) ||
        city.slug
          .toLowerCase()
          .includes(query) ||
        city.timeZone
          .toLowerCase()
          .includes(query),
    )
    .slice(
      0,
      limit,
    );
}

const getCachedWorldClockSearch =
  unstable_cache(
    loadWorldClockSearch,

    [
      "atlas",
      "world-clock",
      "city-search",
    ],

    {
      revalidate:
        SEARCH_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_CACHE_TAGS
          .cities,

        WORLD_CLOCK_CACHE_TAGS
          .searches,
      ],
    },
  );

export async function searchWorldClockCities(
  query: string,
  limit = 20,
): Promise<
  WorldClockCity[]
> {
  const normalizedQuery =
    normalizeSearchQuery(
      query,
    );

  const normalizedLimit =
    normalizeLimit(
      limit,
      20,
    );

  if (
    normalizedQuery.length < 2
  ) {
    return [];
  }

  return getCachedWorldClockSearch(
    normalizedQuery,
    normalizedLimit,
  );
}

export const worldClockService = {
  getCityBySlug:
    getWorldClockCityBySlug,

  getCityBySlugAndCountry:
    getWorldClockCityBySlugAndCountry,

  getPopularCities:
    getWorldClockIndexCities,

  getRelatedCities:
    getRelatedWorldClockCitiesForCity,

  searchCities:
    searchWorldClockCities,
};

export default worldClockService;