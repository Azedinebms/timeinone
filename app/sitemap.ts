import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  getAllTimezones,
  getSelectedOffsetTimezones,
  getOffsetSeoPairs,
} from "@/lib/timezones";

import {
  fetchPopularCities,
} from "@/services/city.service";

/* =========================================================
   CONFIG
========================================================= */

const CALENDAR_MIN_YEAR =
  2024;

const CALENDAR_MAX_YEAR =
  2030;

const CONVERTER_CITY_LIMIT =
  40;

const MONTH_SLUGS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

/* =========================================================
   HELPERS
========================================================= */

function createUrl(
  path: string,
): string {
  return new URL(
    path,
    SITE_URL,
  ).toString();
}

function normalizeSlug(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

/* =========================================================
   STATIC PAGES
========================================================= */

function createStaticEntries(
  now: Date,
): MetadataRoute.Sitemap {
  return [
    {
      url:
        createUrl("/"),

      lastModified:
        now,

      changeFrequency:
        "daily",

      priority:
        1,
    },

    {
      url:
        createUrl(
          "/timezone",
        ),

      lastModified:
        now,

      changeFrequency:
        "weekly",

      priority:
        0.95,
    },

    {
      url:
        createUrl(
          "/current-time",
        ),

      lastModified:
        now,

      changeFrequency:
        "daily",

      priority:
        0.9,
    },

    {
      url:
        createUrl(
          "/meeting-planner",
        ),

      lastModified:
        now,

      changeFrequency:
        "weekly",

      priority:
        0.95,
    },

    {
      url:
        createUrl(
          "/about",
        ),

      lastModified:
        now,

      changeFrequency:
        "monthly",

      priority:
        0.7,
    },

    {
      url:
        createUrl(
          "/contact",
        ),

      lastModified:
        now,

      changeFrequency:
        "monthly",

      priority:
        0.7,
    },

    {
      url:
        createUrl(
          "/faq",
        ),

      lastModified:
        now,

      changeFrequency:
        "monthly",

      priority:
        0.7,
    },

    {
      url:
        createUrl(
          "/privacy-policy",
        ),

      lastModified:
        now,

      changeFrequency:
        "yearly",

      priority:
        0.3,
    },

    {
      url:
        createUrl(
          "/terms-of-use",
        ),

      lastModified:
        now,

      changeFrequency:
        "yearly",

      priority:
        0.3,
    },

    {
      url:
        createUrl(
          "/cookie-policy",
        ),

      lastModified:
        now,

      changeFrequency:
        "yearly",

      priority:
        0.3,
    },

    {
      url:
        createUrl(
          "/legal-notice",
        ),

      lastModified:
        now,

      changeFrequency:
        "yearly",

      priority:
        0.3,
    },
  ];
}

/* =========================================================
   CALENDAR
========================================================= */

function createCalendarEntries(
  now: Date,
): MetadataRoute.Sitemap {
  const entries:
    MetadataRoute.Sitemap = [
      {
        url:
          createUrl(
            "/calendar/monthly",
          ),

        lastModified:
          now,

        changeFrequency:
          "monthly",

        priority:
          0.85,
      },

      {
        url:
          createUrl(
            "/calendar/printable",
          ),

        lastModified:
          now,

        changeFrequency:
          "monthly",

        priority:
          0.85,
      },
    ];

  for (
    let year =
      CALENDAR_MIN_YEAR;
    year <=
    CALENDAR_MAX_YEAR;
    year += 1
  ) {
    entries.push({
      url:
        createUrl(
          `/calendar/${year}`,
        ),

      lastModified:
        now,

      changeFrequency:
        "monthly",

      priority:
        0.9,
    });

    for (
      const month of
      MONTH_SLUGS
    ) {
      entries.push({
        url:
          createUrl(
            `/calendar/${year}/${month}`,
          ),

        lastModified:
          now,

        changeFrequency:
          "monthly",

        priority:
          0.88,
      });
    }
  }

  return entries;
}

/* =========================================================
   TIMEZONE DETAIL PAGES
========================================================= */

function createTimezoneEntries(
  now: Date,
): MetadataRoute.Sitemap {
  const entries:
    MetadataRoute.Sitemap = [];

  const usedUrls =
    new Set<string>();

  const addTimezone = (
    slug: string,
    priority = 0.82,
  ) => {
    const normalizedSlug =
      normalizeSlug(slug);

    if (!normalizedSlug) {
      return;
    }

    const url =
      createUrl(
        `/timezone/${normalizedSlug}`,
      );

    if (
      usedUrls.has(url)
    ) {
      return;
    }

    usedUrls.add(url);

    entries.push({
      url,

      lastModified:
        now,

      changeFrequency:
        "monthly",

      priority,
    });
  };

  /*
   * Static timezone definitions:
   *
   * UTC, GMT, PST, EST, CET, JST...
   */

  const timezones =
    getAllTimezones();

  for (
    const timezone of
    timezones
  ) {
    addTimezone(
      timezone.slug,
      0.85,
    );
  }

  /*
   * Selected dynamic offsets:
   *
   * utc-plus-5-30
   * gmt-minus-3
   * ...
   */

  const offsetTimezones =
    getSelectedOffsetTimezones();

  for (
    const timezone of
    offsetTimezones
  ) {
    addTimezone(
      timezone.slug,
      0.8,
    );
  }

  return entries;
}

/* =========================================================
   TIMEZONE SEO PAIRS
========================================================= */

function createTimezonePairEntries(
  now: Date,
): MetadataRoute.Sitemap {
  const entries:
    MetadataRoute.Sitemap = [];

  const usedPairs =
    new Set<string>();

  const pairs =
    getOffsetSeoPairs();

  for (
    const pair of
    pairs
  ) {
    const fromSlug =
      normalizeSlug(
        pair.fromTimezone.slug,
      );

    const toSlug =
      normalizeSlug(
        pair.toTimezone.slug,
      );

    if (
      !fromSlug ||
      !toSlug ||
      fromSlug === toSlug
    ) {
      continue;
    }

    const canonicalPair =
      `${fromSlug}-to-${toSlug}`;

    if (
      usedPairs.has(
        canonicalPair,
      )
    ) {
      continue;
    }

    usedPairs.add(
      canonicalPair,
    );

    entries.push({
      url:
        createUrl(
          `/timezone/${canonicalPair}`,
        ),

      lastModified:
        now,

      changeFrequency:
        "monthly",

      priority:
        0.78,
    });
  }

  return entries;
}

/* =========================================================
   POPULAR CITY CONVERTERS
========================================================= */

async function createConverterEntries(
  now: Date,
): Promise<
  MetadataRoute.Sitemap
> {
  const cities =
    await fetchPopularCities(
      CONVERTER_CITY_LIMIT,
    );

  const uniqueCities =
    Array.from(
      new Map(
        cities
          .filter(
            (city) =>
              Boolean(
                city.slug?.trim(),
              ),
          )
          .map(
            (city) => [
              normalizeSlug(
                city.slug,
              ),
              city,
            ],
          ),
      ).values(),
    );

  const entries:
    MetadataRoute.Sitemap = [];

  const usedPairs =
    new Set<string>();

  for (
    const fromCity of
    uniqueCities
  ) {
    for (
      const toCity of
      uniqueCities
    ) {
      if (
        fromCity.id ===
        toCity.id
      ) {
        continue;
      }

      const fromSlug =
        normalizeSlug(
          fromCity.slug,
        );

      const toSlug =
        normalizeSlug(
          toCity.slug,
        );

      if (
        !fromSlug ||
        !toSlug ||
        fromSlug === toSlug
      ) {
        continue;
      }

      const canonicalPair =
        `${fromSlug}-to-${toSlug}`;

      if (
        usedPairs.has(
          canonicalPair,
        )
      ) {
        continue;
      }

      usedPairs.add(
        canonicalPair,
      );

      entries.push({
        url:
          createUrl(
            `/converter/${canonicalPair}`,
          ),

        lastModified:
          now,

        changeFrequency:
          "weekly",

        priority:
          0.82,
      });
    }
  }

  return entries;
}

/* =========================================================
   SITEMAP
========================================================= */

export default async function sitemap():
  Promise<
    MetadataRoute.Sitemap
  > {
  const now =
    new Date();

  const [
    staticEntries,
    calendarEntries,
    timezoneEntries,
    timezonePairEntries,
    converterEntries,
  ] = await Promise.all([
    Promise.resolve(
      createStaticEntries(
        now,
      ),
    ),

    Promise.resolve(
      createCalendarEntries(
        now,
      ),
    ),

    Promise.resolve(
      createTimezoneEntries(
        now,
      ),
    ),

    Promise.resolve(
      createTimezonePairEntries(
        now,
      ),
    ),

    createConverterEntries(
      now,
    ),
  ]);

  return [
    ...staticEntries,
    ...calendarEntries,
    ...timezoneEntries,
    ...timezonePairEntries,
    ...converterEntries,
  ];
}