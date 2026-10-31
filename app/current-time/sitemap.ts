import type {
  MetadataRoute,
} from "next";

import {
  getCurrentTimeSitemapCount,
  getCurrentTimeSitemapEntries,
} from "@/services/current-time-sitemap.service";

export const dynamic = "force-dynamic";

/* =========================================================
   GENERATE SHARDS
========================================================= */

export function generateSitemaps() {
  return [{ id: 0 }];
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