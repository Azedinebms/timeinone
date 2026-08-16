import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  fetchTimeDifferenceSitemapPage,
  getTimeDifferenceSitemapCount,
} from "@/services/time-difference-sitemap.service";

/* =========================================================
   GENERATE TIME DIFFERENCE SITEMAP SHARDS
========================================================= */

export async function generateSitemaps() {
  const sitemapCount =
    await getTimeDifferenceSitemapCount();

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
   TIME DIFFERENCE SITEMAP
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
    await getTimeDifferenceSitemapCount();

  if (
    resolvedId >=
    sitemapCount
  ) {
    return [];
  }

  const pairs =
    await fetchTimeDifferenceSitemapPage(
      resolvedId,
    );

  return pairs.map(
    (
      pair,
    ) => {
      const path =
        `/time-difference/${pair.fromSlug}-to-${pair.toSlug}`;

      return {
        url:
          new URL(
            path,
            SITE_URL,
          ).toString(),

        lastModified:
          pair.updatedAt,

        changeFrequency:
          "weekly" as const,

        priority:
          0.8,
      };
    },
  );
}