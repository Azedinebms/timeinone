import "server-only";

import { getNeon } from "@/lib/db/neon";

const MAX_PAGE_SIZE = 50_000;

type SitemapCityRow = {
  id: number;
  slug: string;
  updatedAt: Date | string;
  countryIso2: string;
};

export type WorldClockSitemapCityRecord = {
  id: number;
  slug: string;
  updatedAt: Date;
  country: { iso2: string };
};

function normalizePage(page: number): number {
  if (!Number.isFinite(page) || page < 0) return 0;
  return Math.floor(page);
}

function normalizePageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize <= 0) return MAX_PAGE_SIZE;
  return Math.min(Math.floor(pageSize), MAX_PAGE_SIZE);
}

export async function countWorldClockSitemapCities(): Promise<number> {
  const sql = await getNeon();
  const rows = await sql`
    SELECT COUNT(DISTINCT (city."slug", city."countryId"))::int AS "total"
    FROM "cities" AS city
    INNER JOIN "countries" AS country ON country."id" = city."countryId"
    INNER JOIN "timezones" AS timezone ON timezone."id" = city."timezoneId"
    WHERE city."slug" IS NOT NULL AND BTRIM(city."slug") <> ''
      AND country."iso2" IS NOT NULL AND BTRIM(country."iso2") <> ''
      AND timezone."name" IS NOT NULL AND BTRIM(timezone."name") <> ''
  `;
  return Number(rows[0]?.total ?? 0);
}

export async function getWorldClockSitemapCities(
  page: number,
  pageSize = MAX_PAGE_SIZE,
): Promise<WorldClockSitemapCityRecord[]> {
  const sql = await getNeon();
  const normalizedPage = normalizePage(page);
  const normalizedPageSize = normalizePageSize(pageSize);
  const offset = normalizedPage * normalizedPageSize;
  if (!Number.isSafeInteger(offset)) {
    throw new RangeError("World clock sitemap page offset exceeds safe integer range");
  }

  const rows = await sql`
    WITH "canonical_cities" AS (
      SELECT DISTINCT ON (city."slug", city."countryId")
        city."id", city."slug", city."updatedAt",
        country."iso2" AS "countryIso2"
      FROM "cities" AS city
      INNER JOIN "countries" AS country ON country."id" = city."countryId"
      INNER JOIN "timezones" AS timezone ON timezone."id" = city."timezoneId"
      WHERE city."slug" IS NOT NULL AND BTRIM(city."slug") <> ''
        AND country."iso2" IS NOT NULL AND BTRIM(country."iso2") <> ''
        AND timezone."name" IS NOT NULL AND BTRIM(timezone."name") <> ''
      ORDER BY city."slug" ASC, city."countryId" ASC,
        city."population" DESC NULLS LAST,
        city."geonameId" ASC, city."id" ASC
    )
    SELECT "id", "slug", "updatedAt", "countryIso2"
    FROM "canonical_cities"
    ORDER BY "id" ASC
    LIMIT ${normalizedPageSize} OFFSET ${offset}
  `;

  return (rows as unknown as SitemapCityRow[]).map((row) => ({
    id: Number(row.id),
    slug: row.slug,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt),
    country: { iso2: row.countryIso2 },
  }));
}

export const worldClockSitemapRepository = {
  countCities: countWorldClockSitemapCities,
  getCities: getWorldClockSitemapCities,
};

export default worldClockSitemapRepository;
