import type { CityOption } from "@/types/city";

import {
  getCityByGeonameId,
  getCityById,
  getCityBySlug,
  getCityBySlugAndCountry,
  getPopularCities,
  searchCities,
  type CityWithRelations,
} from "@/repositories/city.repository";

function mapCityToOption(
  city: CityWithRelations,
): CityOption {
  return {
    id: city.id,
    city: city.name,
    country: city.country.name,
    countryCode: city.country.iso2,
    slug: city.slug,
    timezone: city.timezone.name,

    latitude:
      city.latitude === null
        ? null
        : Number(city.latitude),

    longitude:
      city.longitude === null
        ? null
        : Number(city.longitude),

    population: city.population,
  };
}

export async function fetchPopularCities(
  limit = 20,
) {
  const cities = await getPopularCities(
    limit,
  );

  return cities.map(mapCityToOption);
}

export async function findCityById(
  id: number,
) {
  const city = await getCityById(id);

  return city
    ? mapCityToOption(city)
    : null;
}

export async function findCityByGeonameId(
  geonameId: number,
) {
  const city =
    await getCityByGeonameId(
      geonameId,
    );

  return city
    ? mapCityToOption(city)
    : null;
}

export async function findCityBySlug(
  slug: string,
  countryIso2?: string,
) {
  const city = await getCityBySlug(
    slug,
    countryIso2,
  );

  return city
    ? mapCityToOption(city)
    : null;
}

export async function findCityBySlugAndCountry(
  slug: string,
  countryIso2: string,
) {
  const city =
    await getCityBySlugAndCountry(
      slug,
      countryIso2,
    );

  return city
    ? mapCityToOption(city)
    : null;
}

export async function findCities(
  query: string,
  limit = 20,
) {
  const cities = await searchCities(
    query,
    limit,
  );

  return cities.map(mapCityToOption);
}