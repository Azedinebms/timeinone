
import "server-only";

import { getNeon } from "@/lib/db/neon";

export type CitySitemapRecord = {
  slug: string;
  updatedAt: Date;

  country: {
    iso2: string;
  };
};

/* =========================================================
   COUNT CITIES FOR SITEMAP
========================================================= */

export async function countCitiesForSitemap(): Promise<number> {
  const sql = await getNeon();

  const rows = await sql`
    SELECT COUNT(*)::int AS total
    FROM cities
  `;

  return Number(rows[0]?.total ?? 0);
}

/* =========================================================
   GET CITIES FOR SITEMAP
========================================================= */

export async function getCitiesForSitemap(
  offset: number,
  limit: number,
): Promise<CitySitemapRecord[]> {
  const sql = await getNeon();

  const safeOffset = Math.max(
    0,
    Math.floor(Number.isFinite(offset) ? offset : 0),
  );

  const safeLimit = Math.max(
    0,
    Math.floor(Number.isFinite(limit) ? limit : 0),
  );

  if (safeLimit === 0) {
    return [];
  }

  const rows = await sql`
    SELECT
      city.slug,
      city."updatedAt",
      country.iso2 AS "countryIso2"

    FROM cities AS city

    INNER JOIN countries AS country
      ON country.id = city."countryId"

    ORDER BY city.id ASC

    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;

  return rows.map((row) => ({
    slug: String(row.slug),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt
        : new Date(String(row.updatedAt)),
    country: {
      iso2: String(row.countryIso2),
    },
  }));
}
