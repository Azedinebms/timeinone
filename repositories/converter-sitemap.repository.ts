
import "server-only";

import { getNeon } from "@/lib/db/neon";

export type ConverterSitemapCityRecord = {
  id: number;
  slug: string;
  population: number | null;
  updatedAt: Date;
};

/* =========================================================
   GET CONVERTER SITEMAP CANDIDATES
========================================================= */

export async function getConverterSitemapCandidates(
  limit = 1_000,
): Promise<ConverterSitemapCityRecord[]> {
  const sql = await getNeon();

  // Limite sécurisée pour éviter les requêtes excessives.
  const safeLimit = Number.isFinite(limit)
    ? Math.max(0, Math.floor(limit))
    : 1_000;

  if (safeLimit === 0) {
    return [];
  }

  const rows = await sql`
    SELECT
      city.id,
      city.slug,
      city.population,
      city."updatedAt"

    FROM cities AS city

    WHERE
      city.population > 0

    ORDER BY
      city.population DESC,
      city.id ASC

    LIMIT ${safeLimit}
  `;

  return rows.map((row) => ({
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
