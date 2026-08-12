import "server-only";

import {
  getPrismaAsync,
} from "@/lib/db/prisma";

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
): Promise<
  ConverterSitemapCityRecord[]
> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findMany({
    take:
      limit,

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
        id:
          "asc",
      },
    ],

    select: {
      id: true,
      slug: true,
      population: true,
      updatedAt: true,
    },
  });
}