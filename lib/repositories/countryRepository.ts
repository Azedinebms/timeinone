import "server-only";

import {
  getPrismaAsync,
} from "@/lib/db/prisma";

const DEFAULT_COUNTRY_LIMIT =
  250;

const DEFAULT_CITY_LIMIT =
  100;

const MAX_CITY_LIMIT =
  500;

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

const countrySelect = {
  id: true,
  name: true,
  iso2: true,
  iso3: true,

  _count: {
    select: {
      cities: true,
    },
  },
} as const;

const countryCitySelect = {
  id: true,
  geonameId: true,
  name: true,
  asciiName: true,
  slug: true,
  latitude: true,
  longitude: true,
  population: true,

  country: {
    select: {
      id: true,
      name: true,
      iso2: true,
      iso3: true,
    },
  },

  timezone: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

function normalizeCountryCode(
  countryCode: string,
): string {
  return countryCode
    .trim()
    .toUpperCase();
}

function normalizeLimit(
  limit: number | undefined,
  fallback: number,
  maximum: number,
): number {
  if (
    typeof limit !== "number" ||
    !Number.isFinite(limit)
  ) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(
      1,
      Math.floor(limit),
    ),
  );
}

export async function getAllCountriesWithCityCounts(
  limit =
    DEFAULT_COUNTRY_LIMIT,
): Promise<
  CountryRepositoryRecord[]
> {
  const prisma =
    await getPrismaAsync();

  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_COUNTRY_LIMIT,
      DEFAULT_COUNTRY_LIMIT,
    );

  return prisma.country.findMany({
    where: {
      cities: {
        some: {},
      },
    },

    orderBy: {
      name:
        "asc",
    },

    take:
      normalizedLimit,

    select:
      countrySelect,
  });
}

export async function getCountryByCode(
  countryCode: string,
): Promise<
  CountryRepositoryRecord | null
> {
  const prisma =
    await getPrismaAsync();

  const normalizedCode =
    normalizeCountryCode(
      countryCode,
    );

  if (
    normalizedCode.length !== 2
  ) {
    return null;
  }

  return prisma.country.findUnique({
    where: {
      iso2:
        normalizedCode,
    },

    select:
      countrySelect,
  });
}

export async function getPopularCitiesByCountryCode(
  countryCode: string,
  limit =
    DEFAULT_CITY_LIMIT,
): Promise<
  CountryCityRepositoryRecord[]
> {
  const prisma =
    await getPrismaAsync();

  const normalizedCode =
    normalizeCountryCode(
      countryCode,
    );

  if (
    normalizedCode.length !== 2
  ) {
    return [];
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_CITY_LIMIT,
      MAX_CITY_LIMIT,
    );

  return prisma.city.findMany({
    where: {
      country: {
        is: {
          iso2:
            normalizedCode,
        },
      },
    },

    orderBy: [
      {
        population:
          "desc",
      },
      {
        name:
          "asc",
      },
    ],

    take:
      normalizedLimit,

    select:
      countryCitySelect,
  });
}

export const countryRepository = {
  getAllCountriesWithCityCounts,
  getCountryByCode,
  getPopularCitiesByCountryCode,
};

export default countryRepository;