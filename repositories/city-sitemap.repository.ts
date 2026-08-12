import "server-only";

import {
  getPrismaAsync,
} from "@/lib/db/prisma";

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

export async function countCitiesForSitemap():
  Promise<number> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.count();
}

/* =========================================================
   GET CITIES FOR SITEMAP
========================================================= */

export async function getCitiesForSitemap(
  offset: number,
  limit: number,
): Promise<CitySitemapRecord[]> {
  const prisma =
    await getPrismaAsync();

  return prisma.city.findMany({
    skip:
      offset,

    take:
      limit,

    orderBy: {
      id:
        "asc",
    },

    select: {
      slug:
        true,

      updatedAt:
        true,

      country: {
        select: {
          iso2:
            true,
        },
      },
    },
  });
}