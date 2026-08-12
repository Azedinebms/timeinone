import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  getAllTimezones,
  getOffsetSeoPairs,
  getSelectedOffsetTimezones,
  type TimezoneDefinition,
} from "@/lib/timezones";

type SitemapEntry =
  MetadataRoute.Sitemap[number];

function createAbsoluteUrl(
  path: string,
) {
  return new URL(
    path,
    SITE_URL,
  ).toString();
}

function createDetailEntry(
  timezone: TimezoneDefinition,
): SitemapEntry {
  return {
    url:
      createAbsoluteUrl(
        `/timezone/${timezone.slug}`,
      ),

    changeFrequency:
      "monthly",

    priority: 0.85,
  };
}

function createConverterEntry(
  fromTimezone:
    TimezoneDefinition,

  toTimezone:
    TimezoneDefinition,

  priority = 0.75,
): SitemapEntry {
  return {
    url:
      createAbsoluteUrl(
        `/timezone/${fromTimezone.slug}-to-${toTimezone.slug}`,
      ),

    changeFrequency:
      "monthly",

    priority,
  };
}

function createEntryKey(
  entry: SitemapEntry,
) {
  return entry.url;
}

export default function sitemap():
  MetadataRoute.Sitemap {
  const predefinedTimezones =
    getAllTimezones();

  const offsetTimezones =
    getSelectedOffsetTimezones();

  const offsetSeoPairs =
    getOffsetSeoPairs();

  const entries:
    MetadataRoute.Sitemap = [];

  const usedUrls =
    new Set<string>();

  function addEntry(
    entry: SitemapEntry,
  ) {
    const key =
      createEntryKey(entry);

    if (
      usedUrls.has(key)
    ) {
      return;
    }

    usedUrls.add(key);
    entries.push(entry);
  }

  /*
   * 1. Pages individuelles
   * des fuseaux prédéfinis.
   */
  for (
    const timezone of
      predefinedTimezones
  ) {
    addEntry(
      createDetailEntry(
        timezone,
      ),
    );
  }

  /*
   * 2. Pages individuelles
   * des offsets UTC et GMT.
   */
  for (
    const timezone of
      offsetTimezones
  ) {
    addEntry(
      createDetailEntry(
        timezone,
      ),
    );
  }

  /*
   * 3. Toutes les conversions
   * entre les fuseaux contrôlés.
   *
   * Le catalogue statique reste petit,
   * donc ces paires sont acceptables.
   */
  for (
    const fromTimezone of
      predefinedTimezones
  ) {
    for (
      const toTimezone of
        predefinedTimezones
    ) {
      if (
        fromTimezone.slug ===
        toTimezone.slug
      ) {
        continue;
      }

      addEntry(
        createConverterEntry(
          fromTimezone,
          toTimezone,
          0.8,
        ),
      );
    }
  }

  /*
   * 4. Conversions sélectives
   * entre offsets dynamiques et
   * fuseaux populaires.
   */
  for (
    const pair of
      offsetSeoPairs
  ) {
    addEntry(
      createConverterEntry(
        pair.fromTimezone,
        pair.toTimezone,
        0.75,
      ),
    );
  }

  return entries;
}