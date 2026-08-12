import "server-only";

import {
  getConverterSitemapCandidates,
  type ConverterSitemapCityRecord,
} from "@/repositories/converter-sitemap.repository";

export const CONVERTER_SITEMAP_CITY_LIMIT = 200;

export const CONVERTER_SITEMAP_PAGE_SIZE = 10_000;

const CONVERTER_CANDIDATE_LIMIT = 1_000;

export type ConverterSitemapPair = {
  fromSlug: string;
  toSlug: string;
  updatedAt: Date;
};

function getCanonicalCities(
  candidates: ConverterSitemapCityRecord[],
) {
  const uniqueCities: ConverterSitemapCityRecord[] = [];

  const usedSlugs = new Set<string>();

  for (const city of candidates) {
    const normalizedSlug = city.slug
      .trim()
      .toLowerCase();

    if (
      !normalizedSlug ||
      usedSlugs.has(normalizedSlug)
    ) {
      continue;
    }

    usedSlugs.add(normalizedSlug);

    uniqueCities.push({
      ...city,
      slug: normalizedSlug,
    });

    if (
      uniqueCities.length >=
      CONVERTER_SITEMAP_CITY_LIMIT
    ) {
      break;
    }
  }

  return uniqueCities;
}

async function fetchCanonicalConverterCities() {
  const candidates =
    await getConverterSitemapCandidates(
      CONVERTER_CANDIDATE_LIMIT,
    );

  return getCanonicalCities(candidates);
}

function calculatePairCount(cityCount: number) {
  if (cityCount < 2) {
    return 0;
  }

  return cityCount * (cityCount - 1);
}

/**
 * Convertit l’index global d’une paire en deux index de villes.
 *
 * Pour n villes, chaque ville source possède n - 1 destinations.
 * La destination identique à la source est automatiquement ignorée.
 */
function resolvePairIndexes(
  pairIndex: number,
  cityCount: number,
) {
  const destinationsPerCity =
    cityCount - 1;

  const fromIndex = Math.floor(
    pairIndex / destinationsPerCity,
  );

  const destinationPosition =
    pairIndex % destinationsPerCity;

  const toIndex =
    destinationPosition >= fromIndex
      ? destinationPosition + 1
      : destinationPosition;

  return {
    fromIndex,
    toIndex,
  };
}

export async function getConverterSitemapCount() {
  const cities =
    await fetchCanonicalConverterCities();

  const pairCount =
    calculatePairCount(cities.length);

  return Math.ceil(
    pairCount /
      CONVERTER_SITEMAP_PAGE_SIZE,
  );
}

export async function fetchConverterSitemapPage(
  pageId: number,
): Promise<ConverterSitemapPair[]> {
  if (
    !Number.isInteger(pageId) ||
    pageId < 0
  ) {
    return [];
  }

  const cities =
    await fetchCanonicalConverterCities();

  const cityCount = cities.length;

  const pairCount =
    calculatePairCount(cityCount);

  const startIndex =
    pageId *
    CONVERTER_SITEMAP_PAGE_SIZE;

  if (startIndex >= pairCount) {
    return [];
  }

  const endIndex = Math.min(
    startIndex +
      CONVERTER_SITEMAP_PAGE_SIZE,
    pairCount,
  );

  const pairs: ConverterSitemapPair[] = [];

  for (
    let pairIndex = startIndex;
    pairIndex < endIndex;
    pairIndex += 1
  ) {
    const {
      fromIndex,
      toIndex,
    } = resolvePairIndexes(
      pairIndex,
      cityCount,
    );

    const fromCity =
      cities[fromIndex];

    const toCity =
      cities[toIndex];

    if (!fromCity || !toCity) {
      continue;
    }

    pairs.push({
      fromSlug: fromCity.slug,
      toSlug: toCity.slug,

      updatedAt:
        fromCity.updatedAt >
        toCity.updatedAt
          ? fromCity.updatedAt
          : toCity.updatedAt,
    });
  }

  return pairs;
}