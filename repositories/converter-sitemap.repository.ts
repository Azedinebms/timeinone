
import "server-only";

import { getPostgres } from "@/lib/db/postgres";

export type ConverterSitemapCityRecord = {
  id: number;
  slug: string;
  population: number | null;
  updatedAt: Date;
};

type ConverterSitemapCityRow = {
  id: number;
  slug: string;
  population: number | null;
  updatedAt: Date | string;
};

/* =========================================================
   GET CONVERTER SITEMAP CANDIDATES
========================================================= */

export async function getConverterSitemapCandidates(
  limit = 1_000,
): Promise<ConverterSitemapCityRecord[]> {
  // Limite sécurisée pour éviter les requêtes excessives.
  const safeLimit = Number.isFinite(limit)
    ? Math.max(0, Math.floor(limit))
    : 1_000;

  if (safeLimit === 0) {
    return [];
  }

  const pool = getPostgres();

  const result = await pool.query<ConverterSitemapCityRow>(
    `SELECT
       city.id,
       city.slug,
       city.population,
       city."updatedAt"
     FROM cities AS city
     WHERE city.population > 0
     ORDER BY
       city.population DESC,
       city.id ASC
     LIMIT $1`,
    [safeLimit],
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    slug: String(row.slug),
    population:
      row.population === null
        ? null
        : Number(row.population),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt
        : new Date(String(row.updatedAt)),
  }));
}
