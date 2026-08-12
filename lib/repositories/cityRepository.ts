import "server-only";

import {
  getPrismaAsync,
} from "@/lib/db/prisma";

const DEFAULT_POPULAR_LIMIT =
  24;

const MAX_LIST_LIMIT =
  100;

const DEFAULT_SEARCH_LIMIT =
  20;

const SEARCH_EXPANSION_FACTOR =
  3;

export type CityRepositoryRecord = {
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

const citySelect = {
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

function normalizeSlug(
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
    .toUpperCase();
}

function normalizeSearchQuery(
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

/**
 * Produit une version sans accents pour comparer
 * plus facilement les requêtes avec asciiName.
 *
 * Exemple :
 * São Paulo → Sao Paulo
 * München   → Munchen
 */
function removeDiacritics(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );
}

function normalizeLimit(
  limit: number | undefined,
  fallback: number,
): number {
  if (
    typeof limit !== "number" ||
    !Number.isFinite(limit)
  ) {
    return fallback;
  }

  return Math.min(
    MAX_LIST_LIMIT,
    Math.max(
      1,
      Math.floor(limit),
    ),
  );
}

function deduplicateCitiesById(
  cityGroups:
    CityRepositoryRecord[][],
  limit: number,
): CityRepositoryRecord[] {
  const seenIds =
    new Set<number>();

  const results:
    CityRepositoryRecord[] = [];

  for (
    const cityGroup
    of cityGroups
  ) {
    for (
      const city
      of cityGroup
    ) {
      if (
        seenIds.has(
          city.id,
        )
      ) {
        continue;
      }

      seenIds.add(
        city.id,
      );

      results.push(
        city,
      );

      if (
        results.length >=
        limit
      ) {
        return results;
      }
    }
  }

  return results;
}

export async function getCityById(
  cityId: number,
): Promise<
  CityRepositoryRecord | null
> {
  console.log(
    `[TimeInOne][DB] getCityById START cityId=${cityId}`,
  );

  try {
    const prisma =
      await getPrismaAsync();

    console.log(
      `[TimeInOne][DB] getCityById PRISMA_READY cityId=${cityId}`,
    );

    if (
      !Number.isInteger(cityId) ||
      cityId <= 0
    ) {
      console.log(
        `[TimeInOne][DB] getCityById INVALID cityId=${cityId}`,
      );

      return null;
    }

    const city =
      await prisma.city.findUnique({
        where: {
          id: cityId,
        },

        select:
          citySelect,
      });

    console.log(
      `[TimeInOne][DB] getCityById SUCCESS cityId=${cityId} found=${Boolean(
        city,
      )}`,
    );

    return city;
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error(
            String(error),
          );

    const extra =
      error as {
        code?: unknown;
        clientVersion?: unknown;
        cause?: unknown;
      };

    console.error(
      `[TimeInOne][DB] getCityById ERROR cityId=${cityId}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_NAME=${err.name}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_MESSAGE=${err.message}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_CODE=${String(
        extra?.code ?? "",
      )}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_CLIENT_VERSION=${String(
        extra?.clientVersion ?? "",
      )}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_CAUSE=${String(
        extra?.cause ?? "",
      )}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_STACK=${err.stack ?? ""}`,
    );

    throw error;
  }
}

export async function getCityByGeonameId(
  geonameId: number,
): Promise<
  CityRepositoryRecord | null
> {
  console.log(
    `[TimeInOne][DB] getCityByGeonameId START geonameId=${geonameId}`,
  );

  try {
    const prisma =
      await getPrismaAsync();

    console.log(
      `[TimeInOne][DB] getCityByGeonameId PRISMA_READY geonameId=${geonameId}`,
    );

    if (
      !Number.isInteger(
        geonameId,
      ) ||
      geonameId <= 0
    ) {
      console.log(
        `[TimeInOne][DB] getCityByGeonameId INVALID geonameId=${geonameId}`,
      );

      return null;
    }

    const city =
      await prisma.city.findUnique({
        where: {
          geonameId,
        },

        select:
          citySelect,
      });

    console.log(
      `[TimeInOne][DB] getCityByGeonameId SUCCESS geonameId=${geonameId} found=${Boolean(
        city,
      )}`,
    );

    return city;
  } catch (error) {
    const err =
      error instanceof Error
        ? error
        : new Error(
            String(error),
          );

    const extra =
      error as {
        code?: unknown;
        clientVersion?: unknown;
        cause?: unknown;
      };

    console.error(
      `[TimeInOne][DB] getCityByGeonameId ERROR geonameId=${geonameId}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_NAME=${err.name}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_MESSAGE=${err.message}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_CODE=${String(
        extra?.code ?? "",
      )}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_CLIENT_VERSION=${String(
        extra?.clientVersion ?? "",
      )}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_CAUSE=${String(
        extra?.cause ?? "",
      )}`,
    );

    console.error(
      `[TimeInOne][DB] ERROR_STACK=${err.stack ?? ""}`,
    );

    throw error;
  }
}

/**
 * Retourne la ville la plus pertinente
 * lorsqu'un même slug existe plusieurs fois.
 *
 * La population est utilisée comme premier
 * critère de sélection.
 */
export async function getCityBySlug(
  slug: string,
): Promise<
  CityRepositoryRecord | null
> {
  const prisma =
  await getPrismaAsync();
  const normalizedSlug =
    normalizeSlug(
      slug,
    );

  if (!normalizedSlug) {
    return null;
  }

  return prisma.city.findFirst({
    where: {
      slug:
        normalizedSlug,
    },

    orderBy: [
      {
        population:
          "desc",
      },
      {
        geonameId:
          "asc",
      },
      {
        id:
          "asc",
      },
    ],

    select:
      citySelect,
  });
}

/**
 * Retourne la ville canonique correspondant
 * à un slug et à un pays.
 *
 * En cas de doublon dans le même pays,
 * la ville la plus peuplée est sélectionnée.
 */
export async function getCityBySlugAndCountryCode(
  slug: string,
  countryCode: string,
): Promise<
  CityRepositoryRecord | null
> {
  const prisma =
  await getPrismaAsync();
  const normalizedSlug =
    normalizeSlug(
      slug,
    );

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

  return prisma.city.findFirst({
    where: {
      slug:
        normalizedSlug,

      country: {
        is: {
          iso2:
            normalizedCountryCode,
        },
      },
    },

    orderBy: [
      {
        population:
          "desc",
      },
      {
        geonameId:
          "asc",
      },
      {
        id:
          "asc",
      },
    ],

    select:
      citySelect,
  });
}

export async function getPopularCities(
  limit =
    DEFAULT_POPULAR_LIMIT,
): Promise<
  CityRepositoryRecord[]
> {
  const prisma =
  await getPrismaAsync();
  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_POPULAR_LIMIT,
    );

  return prisma.city.findMany({
    where: {
      population: {
        gt: 0,
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
      {
        geonameId:
          "asc",
      },
    ],

    take:
      normalizedLimit,

    select:
      citySelect,
  });
}

export async function getCitiesByCountry(
  countryCode: string,
  limit =
    DEFAULT_POPULAR_LIMIT,
): Promise<
  CityRepositoryRecord[]
> {
  const prisma =
  await getPrismaAsync();
  const normalizedCountryCode =
    normalizeCountryCode(
      countryCode,
    );

  if (
    normalizedCountryCode.length !==
      2
  ) {
    return [];
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_POPULAR_LIMIT,
    );

  return prisma.city.findMany({
    where: {
      country: {
        is: {
          iso2:
            normalizedCountryCode,
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
      {
        geonameId:
          "asc",
      },
    ],

    take:
      normalizedLimit,

    select:
      citySelect,
  });
}

export async function getCitiesByTimezone(
  timezoneName: string,
  limit =
    DEFAULT_POPULAR_LIMIT,
): Promise<
  CityRepositoryRecord[]
> {
  const prisma =
  await getPrismaAsync();
  const normalizedTimezoneName =
    normalizeSearchQuery(
      timezoneName,
    );

  if (
    !normalizedTimezoneName
  ) {
    return [];
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_POPULAR_LIMIT,
    );

  return prisma.city.findMany({
    where: {
      timezone: {
        is: {
          name: {
            equals:
              normalizedTimezoneName,

            mode:
              "insensitive",
          },
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
      {
        geonameId:
          "asc",
      },
    ],

    take:
      normalizedLimit,

    select:
      citySelect,
  });
}

/**
 * Recherche avancée utilisée par TimeInOne.
 *
 * Les groupes sont fusionnés dans cet ordre :
 *
 * 1. nom exact ;
 * 2. nom ASCII exact ;
 * 3. slug exact ;
 * 4. nom commençant par la requête ;
 * 5. nom ASCII commençant par la requête ;
 * 6. code ou nom du pays ;
 * 7. fuseau horaire ;
 * 8. correspondance partielle générale.
 *
 * Dans chaque groupe, les villes les plus
 * peuplées sont prioritaires.
 */
export async function searchCities(
  query: string,
  limit =
    DEFAULT_SEARCH_LIMIT,
): Promise<
  CityRepositoryRecord[]
> {
  const prisma =
  await getPrismaAsync();
  const normalizedQuery =
    normalizeSearchQuery(
      query,
    );

  if (
    normalizedQuery.length <
    2
  ) {
    return [];
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      DEFAULT_SEARCH_LIMIT,
    );

  const expandedLimit =
    Math.min(
      normalizedLimit *
        SEARCH_EXPANSION_FACTOR,
      MAX_LIST_LIMIT,
    );

  const asciiQuery =
    removeDiacritics(
      normalizedQuery,
    );

  const slugQuery =
    normalizeSlug(
      normalizedQuery,
    );

  const upperQuery =
    normalizedQuery
      .toUpperCase();

  const commonOrderBy = [
    {
      population:
        "desc" as const,
    },
    {
      name:
        "asc" as const,
    },
    {
      geonameId:
        "asc" as const,
    },
  ];

  const [
    exactNameCities,
    exactAsciiNameCities,
    exactSlugCities,
    prefixNameCities,
    prefixAsciiNameCities,
    countryCities,
    timezoneCities,
    partialCities,
  ] = await Promise.all([
    /*
     * 1. Nom exact.
     */
    prisma.city.findMany({
      where: {
        name: {
          equals:
            normalizedQuery,

          mode:
            "insensitive",
        },
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 2. Nom ASCII exact.
     *
     * Permet par exemple :
     * Sao Paulo → São Paulo
     */
    prisma.city.findMany({
      where: {
        asciiName: {
          equals:
            asciiQuery,

          mode:
            "insensitive",
        },
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 3. Slug exact.
     */
    prisma.city.findMany({
      where: {
        slug:
          slugQuery,
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 4. Nom commençant par la requête.
     */
    prisma.city.findMany({
      where: {
        name: {
          startsWith:
            normalizedQuery,

          mode:
            "insensitive",
        },
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 5. Nom ASCII commençant par la requête.
     */
    prisma.city.findMany({
      where: {
        asciiName: {
          startsWith:
            asciiQuery,

          mode:
            "insensitive",
        },
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 6. Recherche par pays.
     *
     * Exemples :
     * France
     * Morocco
     * FR
     * MA
     */
    prisma.city.findMany({
      where: {
        country: {
          is: {
            OR: [
              {
                name: {
                  equals:
                    normalizedQuery,

                  mode:
                    "insensitive",
                },
              },
              {
                name: {
                  startsWith:
                    normalizedQuery,

                  mode:
                    "insensitive",
                },
              },
              {
                iso2:
                  upperQuery,
              },
              {
                iso3:
                  upperQuery,
              },
            ],
          },
        },
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 7. Recherche par fuseau horaire.
     *
     * Exemples :
     * Europe/Paris
     * Europe
     * Casablanca
     */
    prisma.city.findMany({
      where: {
        timezone: {
          is: {
            name: {
              contains:
                normalizedQuery,

              mode:
                "insensitive",
            },
          },
        },
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),

    /*
     * 8. Correspondance partielle générale.
     */
    prisma.city.findMany({
      where: {
        OR: [
          {
            name: {
              contains:
                normalizedQuery,

              mode:
                "insensitive",
            },
          },
          {
            asciiName: {
              contains:
                asciiQuery,

              mode:
                "insensitive",
            },
          },
          {
            slug: {
              contains:
                slugQuery,
            },
          },
          {
            country: {
              is: {
                name: {
                  contains:
                    normalizedQuery,

                  mode:
                    "insensitive",
                },
              },
            },
          },
          {
            timezone: {
              is: {
                name: {
                  contains:
                    normalizedQuery,

                  mode:
                    "insensitive",
                },
              },
            },
          },
        ],
      },

      orderBy:
        commonOrderBy,

      take:
        expandedLimit,

      select:
        citySelect,
    }),
  ]);

  return deduplicateCitiesById(
    [
      exactNameCities,
      exactAsciiNameCities,
      exactSlugCities,
      prefixNameCities,
      prefixAsciiNameCities,
      countryCities,
      timezoneCities,
      partialCities,
    ],
    normalizedLimit,
  );
}

export async function getRelatedCities(
  cityId: number,
  limit = 6,
): Promise<
  CityRepositoryRecord[]
> {
  const prisma =
  await getPrismaAsync();
  const currentCity =
    await getCityById(
      cityId,
    );

  if (!currentCity) {
    return [];
  }

  const normalizedLimit =
    normalizeLimit(
      limit,
      6,
    );

  const sameCountryCities =
    await prisma.city.findMany({
      where: {
        id: {
          not:
            currentCity.id,
        },

        countryId:
          currentCity.country.id,
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
        {
          geonameId:
            "asc",
        },
      ],

      take:
        normalizedLimit,

      select:
        citySelect,
    });

  if (
    sameCountryCities.length >=
    normalizedLimit
  ) {
    return sameCountryCities;
  }

  const remainingLimit =
    normalizedLimit -
    sameCountryCities.length;

  const excludedIds = [
    currentCity.id,

    ...sameCountryCities.map(
      (
    city:
      CityRepositoryRecord,
  ) =>
    city.id,
    ),
  ];

  const sameTimezoneCities =
    await prisma.city.findMany({
      where: {
        id: {
          notIn:
            excludedIds,
        },

        timezoneId:
          currentCity.timezone.id,
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
        {
          geonameId:
            "asc",
        },
      ],

      take:
        remainingLimit,

      select:
        citySelect,
    });

  return [
    ...sameCountryCities,
    ...sameTimezoneCities,
  ];
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