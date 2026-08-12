import {
  unstable_cache,
} from "next/cache";

import {
  worldClockSitemapRepository,
} from "@/lib/repositories/worldClockSitemapRepository";

import {
  countryRepository,
} from "@/lib/repositories/countryRepository";

import {
  SITE_URL,
} from "@/lib/seo";

export const WORLD_CLOCK_SITEMAP_PAGE_SIZE =
  50_000;

const SITEMAP_COUNT_CACHE_SECONDS =
  60 * 60 * 24;

const SITEMAP_ENTRIES_CACHE_SECONDS =
  60 * 60 * 24;

export const WORLD_CLOCK_SITEMAP_CACHE_TAGS = {
  sitemaps:
    "atlas:world-clock:sitemaps",

  sitemapCount:
    "atlas:world-clock:sitemap-count",

  sitemapEntries:
    "atlas:world-clock:sitemap-entries",
} as const;

export type WorldClockSitemapEntry = {
  url: string;
  lastModified: Date;

  changeFrequency:
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

  priority: number;
};

function normalizeCountryCode(
  countryCode: string,
): string {
  return countryCode
    .trim()
    .toLowerCase();
}

function normalizeCitySlug(
  slug: string,
): string {
  return slug
    .trim()
    .toLowerCase();
}

function normalizeSitemapId(
  sitemapId: number,
): number {
  if (
    !Number.isInteger(
      sitemapId,
    ) ||
    sitemapId < 0
  ) {
    return 0;
  }

  return sitemapId;
}

function createCityPath(
  slug: string,
  countryCode: string,
): string {
  return [
    "/world-clock/",
    normalizeCitySlug(slug),
    "-",
    normalizeCountryCode(
      countryCode,
    ),
  ].join("");
}

async function loadWorldClockSitemapCount():
  Promise<number> {
  const cityCount =
    await worldClockSitemapRepository
      .countCities();

  return Math.max(
    1,
    Math.ceil(
      cityCount /
      WORLD_CLOCK_SITEMAP_PAGE_SIZE,
    ),
  );
}

const getCachedWorldClockSitemapCount =
  unstable_cache(
    loadWorldClockSitemapCount,

    [
      "atlas",
      "world-clock",
      "sitemap-count",
    ],

    {
      revalidate:
        SITEMAP_COUNT_CACHE_SECONDS,

      tags: [
        WORLD_CLOCK_SITEMAP_CACHE_TAGS
          .sitemaps,

        WORLD_CLOCK_SITEMAP_CACHE_TAGS
          .sitemapCount,
      ],
    },
  );

export async function getWorldClockSitemapCount():
  Promise<number> {
  return getCachedWorldClockSitemapCount();
}

async function getCountryEntries(
  lastModified: Date,
): Promise<
  WorldClockSitemapEntry[]
> {
  const countries =
    await countryRepository
      .getAllCountriesWithCityCounts();

  return countries.map(
    (country) => ({
      url:
        `${SITE_URL}/world-clock/countries/${normalizeCountryCode(
          country.iso2,
        )}`,

      lastModified,

      changeFrequency:
        "daily",

      priority:
        0.8,
    }),
  );
}

async function loadWorldClockSitemapEntries(
  sitemapId: number,
): Promise<
  WorldClockSitemapEntry[]
> {
  const records =
    await worldClockSitemapRepository
      .getCities(
        sitemapId,
        WORLD_CLOCK_SITEMAP_PAGE_SIZE,
      );

  const cityEntries:
    WorldClockSitemapEntry[] =
    records.map(
      (city) => ({
        url:
          `${SITE_URL}${createCityPath(
            city.slug,
            city.country.iso2,
          )}`,

        lastModified:
          city.updatedAt,

        changeFrequency:
          "daily",

        priority:
          0.8,
      }),
    );

  if (
    sitemapId !== 0
  ) {
    return cityEntries;
  }

  const now =
    new Date();

  const countryEntries =
    await getCountryEntries(
      now,
    );

  return [
    {
      url:
        `${SITE_URL}/world-clock`,

      lastModified:
        now,

      changeFrequency:
        "daily",

      priority:
        0.9,
    },

    {
      url:
        `${SITE_URL}/world-clock/countries`,

      lastModified:
        now,

      changeFrequency:
        "weekly",

      priority:
        0.8,
    },

    ...countryEntries,
    ...cityEntries,
  ];
}



export async function getWorldClockSitemapEntries(
  sitemapId: number,
): Promise<
  WorldClockSitemapEntry[]
> {
  const normalizedSitemapId =
    normalizeSitemapId(
      sitemapId,
    );

  return loadWorldClockSitemapEntries(
    normalizedSitemapId,
  );
}

export const worldClockSitemapService = {
  getSitemapCount:
    getWorldClockSitemapCount,

  getEntries:
    getWorldClockSitemapEntries,
};

export default worldClockSitemapService;