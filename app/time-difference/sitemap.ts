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

import {
  CONVERTER_SITEMAP_CITY_LIMIT,
  CONVERTER_SITEMAP_PAGE_SIZE,
} from "@/services/converter-sitemap.service";

export const dynamic = "force-dynamic";

/* =========================================================
   GENERATE TIME DIFFERENCE SITEMAP SHARDS
========================================================= */

export function generateSitemaps() {
  const cityCount = CONVERTER_SITEMAP_CITY_LIMIT;

  const pairCount = cityCount * (cityCount - 1);

  const sitemapCount = Math.ceil(
    pairCount / CONVERTER_SITEMAP_PAGE_SIZE,
  );

  return Array.from(
    { length: sitemapCount },
    (_, id) => ({ id }),
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