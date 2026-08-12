import "server-only";

import {
  getPrismaAsync,
} from "@/lib/db/prisma";

export type CityWithRelations = {
  id: number;
  geonameId: number;
  name: string;
  asciiName: string | null;
  slug: string;
  latitude: unknown;
  longitude: unknown;
  population: number | null;

  country: {
    name: string;
    iso2: string;
  };

  timezone: {
    name: string;
  };
};

type CitySearchRow = {
  id: number;
  geonameId: number;
  name: string;
  asciiName: string | null;
  slug: string;
  latitude: unknown;
  longitude: unknown;
  population: number | null;

  countryName: string;
  countryIso2: string;

  timezoneName: string;

  similarityScore: number;
};

const cityRelations = {
  country: true,
  timezone: true,
} as const;

/* =========================================================
   POPULAR CITIES
========================================================= */

export async function getPopularCities(
  limit = 20,
): Promise<CityWithRelations[]> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findMany({
    take:
      limit,

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

    include:
      cityRelations,
  });
}

/* =========================================================
   CITY BY ID
========================================================= */

export async function getCityById(
  id: number,
): Promise<CityWithRelations | null> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findUnique({
    where: {
      id,
    },

    include:
      cityRelations,
  });
}

/* =========================================================
   CITY BY GEONAME ID
========================================================= */

export async function getCityByGeonameId(
  geonameId: number,
): Promise<CityWithRelations | null> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findUnique({
    where: {
      geonameId,
    },

    include:
      cityRelations,
  });
}

/* =========================================================
   CITY BY SLUG
========================================================= */

export async function getCityBySlug(
  slug: string,
  countryIso2?: string,
): Promise<CityWithRelations | null> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findFirst({
    where: {
      slug:
        slug.toLowerCase(),

      ...(countryIso2
        ? {
            country: {
              iso2:
                countryIso2.toUpperCase(),
            },
          }
        : {}),
    },

    include:
      cityRelations,

    orderBy: {
      population:
        "desc",
    },
  });
}

/* =========================================================
   CITY BY SLUG + COUNTRY
========================================================= */

export async function getCityBySlugAndCountry(
  slug: string,
  countryIso2: string,
): Promise<CityWithRelations | null> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findFirst({
    where: {
      slug:
        slug.toLowerCase(),

      country: {
        iso2:
          countryIso2.toUpperCase(),
      },
    },

    include:
      cityRelations,

    orderBy: {
      population:
        "desc",
    },
  });
}

/* =========================================================
   CITY SEARCH
========================================================= */

export async function searchCities(
  query: string,
  limit = 20,
): Promise<CityWithRelations[]> {
  const normalizedQuery =
    query
      .trim()
      .toLowerCase();

  if (
    normalizedQuery.length <
    2
  ) {
    return [];
  }

  const prisma =
    await getPrismaAsync();

  const safeLimit =
    Math.min(
      Math.max(
        limit,
        1,
      ),
      50,
    );

  const rows =
    await prisma.$queryRaw<
      CitySearchRow[]
    >`
      SELECT
        city.id,
        city."geonameId",
        city.name,
        city."asciiName",
        city.slug,
        city.latitude,
        city.longitude,
        city.population,

        country.name
          AS "countryName",

        country.iso2
          AS "countryIso2",

        timezone.name
          AS "timezoneName",

        GREATEST(
          similarity(
            LOWER(city.name),
            ${normalizedQuery}
          ),

          similarity(
            LOWER(
              COALESCE(
                city."asciiName",
                ''
              )
            ),
            ${normalizedQuery}
          ),

          similarity(
            LOWER(city.slug),
            ${normalizedQuery}
          )
        )
          AS "similarityScore"

      FROM cities AS city

      INNER JOIN countries AS country
        ON country.id =
          city."countryId"

      INNER JOIN timezones AS timezone
        ON timezone.id =
          city."timezoneId"

      WHERE
        LOWER(city.name)
          LIKE '%' ||
          ${normalizedQuery} ||
          '%'

        OR LOWER(
          COALESCE(
            city."asciiName",
            ''
          )
        )
          LIKE '%' ||
          ${normalizedQuery} ||
          '%'

        OR LOWER(city.slug)
          LIKE '%' ||
          ${normalizedQuery} ||
          '%'

        OR similarity(
          LOWER(city.name),
          ${normalizedQuery}
        ) >= 0.2

        OR similarity(
          LOWER(
            COALESCE(
              city."asciiName",
              ''
            )
          ),
          ${normalizedQuery}
        ) >= 0.2

      ORDER BY
        CASE
          WHEN LOWER(city.name) =
            ${normalizedQuery}
            THEN 0

          WHEN LOWER(
            city."asciiName"
          ) =
            ${normalizedQuery}
            THEN 1

          WHEN LOWER(city.name)
            LIKE
              ${normalizedQuery} ||
              '%'
            THEN 2

          WHEN LOWER(
            city."asciiName"
          )
            LIKE
              ${normalizedQuery} ||
              '%'
            THEN 3

          ELSE 4
        END,

        "similarityScore" DESC,

        city.population
          DESC NULLS LAST,

        city.name ASC

      LIMIT ${safeLimit};
    `;

return rows.map(
  (row: CitySearchRow) => ({
      id:
        row.id,

      geonameId:
        row.geonameId,

      name:
        row.name,

      asciiName:
        row.asciiName,

      slug:
        row.slug,

      latitude:
        row.latitude,

      longitude:
        row.longitude,

      population:
        row.population,

      country: {
        name:
          row.countryName,

        iso2:
          row.countryIso2,
      },

      timezone: {
        name:
          row.timezoneName,
      },
    }),
  );
}