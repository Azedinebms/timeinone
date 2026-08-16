import "server-only";

import {
  fetchConverterSitemapPage,
  getConverterSitemapCount,
} from "@/services/converter-sitemap.service";

export type TimeDifferenceSitemapPair = {
  fromSlug: string;

  toSlug: string;

  updatedAt: Date;
};

/*
 * Time Difference intentionally reuses
 * the controlled Converter sitemap city set.
 *
 * This keeps both programmatic SEO sections
 * aligned and prevents an uncontrolled
 * city × city URL explosion.
 */

export async function getTimeDifferenceSitemapCount():
  Promise<number> {
  return getConverterSitemapCount();
}

export async function fetchTimeDifferenceSitemapPage(
  pageId: number,
): Promise<
  TimeDifferenceSitemapPair[]
> {
  if (
    !Number.isInteger(
      pageId,
    ) ||
    pageId < 0
  ) {
    return [];
  }

  const pairs =
    await fetchConverterSitemapPage(
      pageId,
    );

  return pairs.map(
    (
      pair,
    ) => ({
      fromSlug:
        pair.fromSlug,

      toSlug:
        pair.toSlug,

      updatedAt:
        pair.updatedAt,
    }),
  );
}