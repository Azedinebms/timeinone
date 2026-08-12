import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  fetchConverterSitemapPage,
  getConverterSitemapCount,
} from "@/services/converter-sitemap.service";

export async function generateSitemaps() {
  const sitemapCount =
    await getConverterSitemapCount();

  return Array.from(
    {
      length: sitemapCount,
    },
    (_, id) => ({
      id,
    }),
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