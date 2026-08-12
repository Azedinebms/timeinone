import "server-only";

import type { CityOption } from "@/types/city";

import {
  fetchPopularCities,
} from "@/services/city.service";

export type RelatedConverterLink = {
  label: string;
  href: string;
  fromCity: string;
  toCity: string;
};

type GetRelatedConvertersInput = {
  fromCity: CityOption;
  toCity: CityOption;
  limit?: number;
};

function createConverterLink(
  fromCity: CityOption,
  toCity: CityOption,
): RelatedConverterLink {
  return {
    label:
      `${fromCity.city} to ${toCity.city}`,

    href:
      `/converter/${fromCity.slug}-to-${toCity.slug}`,

    fromCity: fromCity.city,
    toCity: toCity.city,
  };
}

function getUniqueCanonicalCities(
  cities: CityOption[],
) {
  const uniqueCities: CityOption[] = [];
  const usedSlugs = new Set<string>();

  for (const city of cities) {
    const slug = city.slug
      .trim()
      .toLowerCase();

    if (
      !slug ||
      usedSlugs.has(slug)
    ) {
      continue;
    }

    usedSlugs.add(slug);

    uniqueCities.push(city);
  }

  return uniqueCities;
}

export async function getRelatedConverters({
  fromCity,
  toCity,
  limit = 8,
}: GetRelatedConvertersInput): Promise<
  RelatedConverterLink[]
> {
  const popularCities =
    await fetchPopularCities(40);

  const canonicalCities =
    getUniqueCanonicalCities(
      popularCities,
    ).filter(
      (city) =>
        city.id !== fromCity.id &&
        city.id !== toCity.id &&
        city.slug !== fromCity.slug &&
        city.slug !== toCity.slug,
    );

  const links: RelatedConverterLink[] = [];

  const linksPerDirection =
    Math.max(
      Math.ceil(limit / 2),
      1,
    );

  for (
    let index = 0;
    index < linksPerDirection;
    index += 1
  ) {
    const destination =
      canonicalCities[index];

    if (!destination) {
      break;
    }

    links.push(
      createConverterLink(
        fromCity,
        destination,
      ),
    );
  }

  for (
    let index = linksPerDirection;
    index < canonicalCities.length;
    index += 1
  ) {
    if (links.length >= limit) {
      break;
    }

    const source =
      canonicalCities[index];

    if (!source) {
      continue;
    }

    links.push(
      createConverterLink(
        toCity,
        source,
      ),
    );
  }

  return links;
}