import type {
  MetadataRoute,
} from "next";

import {
  getWorldClockSitemapCount,
  getWorldClockSitemapEntries,
} from "@/features/world-clock";

export const dynamic = "force-dynamic";

/* =========================================================
   GENERATE WORLD CLOCK SITEMAP SHARDS
========================================================= */

export function generateSitemaps() {
  return [{ id: 0 }];
}

/* =========================================================
   WORLD CLOCK SITEMAP
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
    await getWorldClockSitemapCount();

  if (
    resolvedId >=
    sitemapCount
  ) {
    return [];
  }

  const entries =
    await getWorldClockSitemapEntries(
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