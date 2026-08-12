import type {
  MetadataRoute,
} from "next";

import {
  getCurrentTimeSitemapCount,
  getCurrentTimeSitemapEntries,
} from "@/services/current-time-sitemap.service";

/* =========================================================
   GENERATE SHARDS
========================================================= */

export async function generateSitemaps() {
  const sitemapCount =
    await getCurrentTimeSitemapCount();

  return Array.from(
    {
      length:
        sitemapCount,
    },
    (
      _,
      id,
    ) => ({
      id,
    }),
  );
}

/* =========================================================
   CURRENT TIME SITEMAP
========================================================= */

export default async function sitemap({
  id,
}: {
  id:
    Promise<string>;
}): Promise<
  MetadataRoute.Sitemap
> {
  const resolvedId =
    Number(
      await id,
    );

  if (
    !Number.isInteger(
      resolvedId,
    ) ||
    resolvedId < 0
  ) {
    return [];
  }

  const sitemapCount =
    await getCurrentTimeSitemapCount();

  if (
    resolvedId >=
    sitemapCount
  ) {
    return [];
  }

  const entries =
    await getCurrentTimeSitemapEntries(
      resolvedId,
    );

  return entries.map(
    (
      entry,
    ) => ({
      url:
        entry.url,

      lastModified:
        entry.lastModified,

      changeFrequency:
        entry.changeFrequency,

      priority:
        entry.priority,
    }),
  );
}