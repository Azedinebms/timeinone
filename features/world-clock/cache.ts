import {
  revalidateTag,
} from "next/cache";

import {
  WORLD_CLOCK_CACHE_TAGS,
} from "./services/worldClockService";

import {
  WORLD_CLOCK_COUNTRY_CACHE_TAGS,
} from "./services/worldClockCountryService";

import {
  WORLD_CLOCK_SITEMAP_CACHE_TAGS,
} from "./services/worldClockSitemapService";

const REVALIDATION_PROFILE =
  "max";

export function revalidateWorldClockCities():
  void {
  revalidateTag(
    WORLD_CLOCK_CACHE_TAGS
      .cities,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_CACHE_TAGS
      .popularCities,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_CACHE_TAGS
      .relatedCities,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_CACHE_TAGS
      .searches,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_SITEMAP_CACHE_TAGS
      .sitemaps,

    REVALIDATION_PROFILE,
  );
}

export function revalidateWorldClockCountries():
  void {
  revalidateTag(
    WORLD_CLOCK_COUNTRY_CACHE_TAGS
      .countries,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_COUNTRY_CACHE_TAGS
      .countryPages,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_SITEMAP_CACHE_TAGS
      .sitemaps,

    REVALIDATION_PROFILE,
  );
}

export function revalidateAllWorldClockData():
  void {
  revalidateWorldClockCities();
  revalidateWorldClockCountries();

  revalidateTag(
    WORLD_CLOCK_SITEMAP_CACHE_TAGS
      .sitemapCount,

    REVALIDATION_PROFILE,
  );

  revalidateTag(
    WORLD_CLOCK_SITEMAP_CACHE_TAGS
      .sitemapEntries,

    REVALIDATION_PROFILE,
  );
}