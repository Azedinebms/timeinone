import {
  unstable_cache,
} from "next/cache";

import {
  countryRepository,
  type CountryCityRepositoryRecord,
} from "@/lib/repositories/countryRepository";

import type {
  WorldClockCity,
} from "../types";

import type {
  WorldClockCountry,
  WorldClockCountryPageData,
} from "../types/country";

const DEFAULT_COUNTRY_CITY_LIMIT =
  60;

const MAX_COUNTRY_CITY_LIMIT =
  500;

const COUNTRIES_CACHE_SECONDS =
  60 * 60 * 24;

const COUNTRY_PAGE_CACHE_SECONDS =
  60 * 60 * 6;

export const WORLD_CLOCK_COUNTRY_CACHE_TAGS = {
  countries:
    "atlas:world-clock:countries",

  countryPages:
    "atlas:world-clock:country-pages",
} as const;

function normalizeCountryCode(
  countryCode: string,
): string {
  return countryCode
    .trim()
    .toUpperCase();
}

function normalizeCityLimit(
  limit: number,
): number {
  if (
    !Number.isFinite(limit) ||
    limit <= 0
  ) {
    return DEFAULT_COUNTRY_CITY_LIMIT;
  }

  return Math.min(
    Math.floor(limit),
    MAX_COUNTRY_CITY_LIMIT,
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

    case "Asia":
      return "Asia";

    case "Europe":
      return "Europe";

    case "Australia":
    case "Pacific":
      return "Oceania";

    case "Atlantic":
      return "Atlantic";

    case "Indian":
      return "Indian Ocean";

    case "Antarctica":
      return "Antarctica";

    default:
      return "Global";
  }
}

function mapCountryCityRecord(
  record:
    CountryCityRepositoryRecord,
  priority: number,
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

function deduplicateCities(
  cities:
    CountryCityRepositoryRecord[],
): CountryCityRepositoryRecord[] {
  const seen =
    new Set<string>();

  return cities.filter(
    (city) => {
      const key =
        [
          city.slug,
          city.country.iso2,
        ]
          .join(":")
          .toLowerCase();

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}

async function loadWorldClockCountries():
  Promise<
    WorldClockCountry[]
  > {
  const countries =
    await countryRepository
      .getAllCountriesWithCityCounts();

  return countries.map(
    (country) => ({
      id:
        country.id,

      name:
        country.name,

      countryCode:
        country.iso2,

      iso3:
        country.iso3,

      cityCount:
        country._count.cities,
    }),
  );
}

const getCachedWorldClockCountries =
  unstable_cache(
    loadWorldClockCountries,

    [
      "atlas",
      "world-clock",
      "countries",
    ],

    {
      revalidate:
        COUNTRIES_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_COUNTRY_CACHE_TAGS
          .countries,
      ],
    },
  );

export async function getWorldClockCountries():
  Promise<
    WorldClockCountry[]
  > {
  return getCachedWorldClockCountries();
}

async function loadWorldClockCountryByCode(
  countryCode: string,
  cityLimit: number,
): Promise<
  WorldClockCountryPageData | null
> {
  const country =
    await countryRepository
      .getCountryByCode(
        countryCode,
      );

  if (!country) {
    return null;
  }

  const cityRecords =
    await countryRepository
      .getPopularCitiesByCountryCode(
        country.iso2,
        Math.min(
          cityLimit * 2,
          MAX_COUNTRY_CITY_LIMIT,
        ),
      );

  const cities =
    deduplicateCities(
      cityRecords,
    )
      .slice(
        0,
        cityLimit,
      )
      .map(
        (
          city,
          index,
        ) =>
          mapCountryCityRecord(
            city,
            index + 1,
          ),
      );

  return {
    country: {
      id:
        country.id,

      name:
        country.name,

      countryCode:
        country.iso2,

      iso3:
        country.iso3,

      cityCount:
        country._count.cities,
    },

    cities,
  };
}

const getCachedWorldClockCountryByCode =
  unstable_cache(
    loadWorldClockCountryByCode,

    [
      "atlas",
      "world-clock",
      "country-page",
    ],

    {
      revalidate:
        COUNTRY_PAGE_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_COUNTRY_CACHE_TAGS
          .countries,

        WORLD_CLOCK_COUNTRY_CACHE_TAGS
          .countryPages,
      ],
    },
  );

export async function getWorldClockCountryByCode(
  countryCode: string,
  cityLimit =
    DEFAULT_COUNTRY_CITY_LIMIT,
): Promise<
  WorldClockCountryPageData | null
> {
  const normalizedCountryCode =
    normalizeCountryCode(
      countryCode,
    );

  if (
    normalizedCountryCode.length !==
      2
  ) {
    return null;
  }

  const normalizedLimit =
    normalizeCityLimit(
      cityLimit,
    );

  return getCachedWorldClockCountryByCode(
    normalizedCountryCode,
    normalizedLimit,
  );
}

export const worldClockCountryService = {
  getCountries:
    getWorldClockCountries,

  getCountryByCode:
    getWorldClockCountryByCode,
};

export default worldClockCountryService;