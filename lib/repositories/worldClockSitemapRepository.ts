import "server-only";

import {
  getPrismaAsync,
} from "@/lib/db/prisma";

const MAX_PAGE_SIZE =
  50_000;

type SitemapCountRow = {
  total: bigint;
};

type SitemapCityRow = {
  id: number;
  slug: string;
  updatedAt: Date;
  countryIso2: string;
};

export type WorldClockSitemapCityRecord = {
  id: number;
  slug: string;
  updatedAt: Date;

  country: {
    iso2: string;
  };
};

/* =========================================================
   HELPERS
========================================================= */

function normalizePage(
  page: number,
): number {
  if (
    !Number.isFinite(page) ||
    page < 0
  ) {
    return 0;
  }

  return Math.floor(
    page,
  );
}

function normalizePageSize(
  pageSize: number,
): number {
  if (
    !Number.isFinite(pageSize) ||
    pageSize <= 0
  ) {
    return MAX_PAGE_SIZE;
  }

  return Math.min(
    Math.floor(
      pageSize,
    ),
    MAX_PAGE_SIZE,
  );
}

/* =========================================================
   COUNT WORLD CLOCK SITEMAP CITIES
========================================================= */

/**
 * Compte uniquement les URLs canoniques.
 *
 * Une URL World Clock est définie par :
 *
 * slug + countryId
 *
 * Plusieurs villes peuvent partager le même
 * slug dans un même pays, mais elles produisent
 * alors la même URL publique.
 */
export async function countWorldClockSitemapCities():
  Promise<number> {
  const prisma =
    await getPrismaAsync();

  const result =
    await prisma.$queryRaw`
      SELECT
        COUNT(
          DISTINCT (
            city."slug",
            city."countryId"
          )
        ) AS "total"

      FROM "cities" AS city

      INNER JOIN "countries" AS country
        ON country."id" =
          city."countryId"

      INNER JOIN "timezones" AS timezone
        ON timezone."id" =
          city."timezoneId"

      WHERE
        city."slug" IS NOT NULL

        AND BTRIM(
          city."slug"
        ) <> ''

        AND country."iso2" IS NOT NULL

        AND BTRIM(
          country."iso2"
        ) <> ''

        AND timezone."name" IS NOT NULL

        AND BTRIM(
          timezone."name"
        ) <> ''
    `;

  const rows =
    result as SitemapCountRow[];

  const total =
    rows[0]?.total ??
    BigInt(0);

  return Number(
    total,
  );
}

/* =========================================================
   GET WORLD CLOCK SITEMAP CITIES
========================================================= */

/**
 * Retourne une seule ville canonique par :
 *
 * slug + countryId
 *
 * Priorité :
 *
 * 1. population la plus élevée
 * 2. GeoNames ID le plus petit
 * 3. ID interne le plus petit
 *
 * Cette logique évite plusieurs occurrences
 * de la même URL dans le sitemap.
 */
export async function getWorldClockSitemapCities(
  page: number,
  pageSize =
    MAX_PAGE_SIZE,
): Promise<
  WorldClockSitemapCityRecord[]
> {
  const prisma =
    await getPrismaAsync();

  const normalizedPage =
    normalizePage(
      page,
    );

  const normalizedPageSize =
    normalizePageSize(
      pageSize,
    );

  const offset =
    normalizedPage *
    normalizedPageSize;

  const result =
    await prisma.$queryRaw`
      WITH "canonical_cities" AS (
        SELECT DISTINCT ON (
          city."slug",
          city."countryId"
        )
          city."id",
          city."slug",
          city."updatedAt",

          country."iso2"
            AS "countryIso2"

        FROM "cities" AS city

        INNER JOIN "countries" AS country
          ON country."id" =
            city."countryId"

        INNER JOIN "timezones" AS timezone
          ON timezone."id" =
            city."timezoneId"

        WHERE
          city."slug" IS NOT NULL

          AND BTRIM(
            city."slug"
          ) <> ''

          AND country."iso2" IS NOT NULL

          AND BTRIM(
            country."iso2"
          ) <> ''

          AND timezone."name" IS NOT NULL

          AND BTRIM(
            timezone."name"
          ) <> ''

        ORDER BY
          city."slug" ASC,
          city."countryId" ASC,

          city."population"
            DESC NULLS LAST,

          city."geonameId" ASC,
          city."id" ASC
      )

      SELECT
        "id",
        "slug",
        "updatedAt",
        "countryIso2"

      FROM "canonical_cities"

      ORDER BY
        "id" ASC

      LIMIT ${normalizedPageSize}
      OFFSET ${offset}
    `;

  const rows =
    result as SitemapCityRow[];

  return rows.map(
    (row) => ({
      id:
        row.id,

      slug:
        row.slug,

      updatedAt:
        row.updatedAt,

      country: {
        iso2:
          row.countryIso2,
      },
    }),
  );
}

/* =========================================================
   REPOSITORY
========================================================= */

export const worldClockSitemapRepository = {
  countCities:
    countWorldClockSitemapCities,

  getCities:
    getWorldClockSitemapCities,
};

export default worldClockSitemapRepository;