import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  CONVERTER_SITEMAP_CITY_LIMIT,
  CONVERTER_SITEMAP_PAGE_SIZE,
  fetchConverterSitemapPage,
} from "@/services/converter-sitemap.service";

export const dynamic = "force-dynamic";

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

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = await id;

  const pageId = Number(resolvedId);

  if (
    !Number.isInteger(pageId) ||
    pageId < 0
  ) {
    return [];
  }

  const pairs =
    await fetchConverterSitemapPage(
      pageId,
    );

  return pairs.map((pair) => {
    const path =
      `/converter/${pair.fromSlug}-to-${pair.toSlug}`;

    return {
      url: new URL(
        path,
        SITE_URL,
      ).toString(),

      lastModified:
        pair.updatedAt,

      changeFrequency:
        "weekly" as const,

      priority: 0.8,
    };
  });
}