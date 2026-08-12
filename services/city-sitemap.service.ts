import {
  countCitiesForSitemap,
  getCitiesForSitemap,
} from "@/repositories/city-sitemap.repository";

export const CITY_SITEMAP_PAGE_SIZE = 10_000;

export async function getCitySitemapCount() {
  const cityCount =
    await countCitiesForSitemap();

  return Math.ceil(
    cityCount / CITY_SITEMAP_PAGE_SIZE,
  );
}

export async function fetchCitySitemapPage(
  pageId: number,
) {
  if (
    !Number.isInteger(pageId) ||
    pageId < 0
  ) {
    return [];
  }

  const offset =
    pageId * CITY_SITEMAP_PAGE_SIZE;

  return getCitiesForSitemap(
    offset,
    CITY_SITEMAP_PAGE_SIZE,
  );
}